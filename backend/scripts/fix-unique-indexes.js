// Usage: node scripts/fix-unique-indexes.js           (dry run, read-only)
//        node scripts/fix-unique-indexes.js --apply   (rebuild the indexes as unique)
require('dotenv').config();
const mongoose = require('mongoose');

const TARGETS = [
  { collection: 'eventregistrations', field: 'paymentOrderId' },
  { collection: 'events', field: 'slug' },
];

async function main() {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  let blocked = false;

  for (const { collection, field } of TARGETS) {
    const col = db.collection(collection);
    const name = `${field}_1`;
    const existing = (await col.indexes()).find(i => i.name === name);
    const dupes = await col
      .aggregate([
        { $match: { [field]: { $type: 'string' } } },
        { $group: { _id: `$${field}`, count: { $sum: 1 }, ids: { $push: '$_id' } } },
        { $match: { count: { $gt: 1 } } },
        { $limit: 20 },
      ])
      .toArray();

    console.log(`\n${collection}.${field}: index=${existing ? JSON.stringify({ unique: !!existing.unique, sparse: !!existing.sparse }) : 'missing'}`);
    if (dupes.length) {
      blocked = true;
      console.log(`  DUPLICATES (resolve manually before applying):`);
      for (const d of dupes) console.log(`   ${d._id} x${d.count} -> ${d.ids.join(', ')}`);
      continue;
    }
    if (existing?.unique) {
      console.log('  already unique - nothing to do');
      continue;
    }
    if (!apply) {
      console.log('  would rebuild as { unique: true, sparse: true }');
      continue;
    }
    if (existing) await col.dropIndex(name);
    await col.createIndex({ [field]: 1 }, { unique: true, sparse: true, name });
    console.log('  rebuilt as unique sparse');
  }

  await mongoose.disconnect();
  if (blocked) process.exitCode = 2;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
