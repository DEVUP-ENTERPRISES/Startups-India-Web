export default function SchemaOrg({ schema }) {
  if (!schema) return null;
  const json = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {json.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
