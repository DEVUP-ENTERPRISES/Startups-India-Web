const h = require('./harness');
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

before(h.start);
after(h.stop);

let seq = 0;
async function seedCourse(priceInr) {
  const { Course, Module, Lesson } = require('../../src/modules/courses/course.model');
  seq += 1;
  const course = await Course.create({
    slug: `founder-course-${seq}`,
    title: 'Founder Course',
    priceInr,
    materials: [{ title: 'Pitch deck template', fileUrl: 'https://cdn.example/deck.pdf' }],
  });
  const mod = await Module.create({ courseId: course._id, moduleNumber: 1, weekNumber: 1, title: 'Week 1', sortOrder: 1 });
  await Lesson.create([
    { moduleId: mod._id, lessonNumber: 1, title: 'Intro', contentType: 'video', videoUrl: 'https://cdn/free.mp4', isPreview: true, sortOrder: 1 },
    { moduleId: mod._id, lessonNumber: 2, title: 'Paid', contentType: 'video', videoUrl: 'https://cdn/paid.mp4', quizQuestions: [{ q: 'x', answer: 'y' }], sortOrder: 2 },
  ]);
  return { course, mod };
}

test('course is charged at the database price even when the client sends ₹1', async () => {
  const { course } = await seedCourse(49900);
  const user = await h.signup();

  const order = await h.api('POST', '/api/v1/payments/razorpay/order', {
    token: user.token,
    body: { courseId: String(course._id), amount: 100, currency: 'USD', metadata: { couponCode: 'FREE' }, notes: { x: 'y' } },
  });
  assert.equal(order.status, 201, JSON.stringify(order.body));
  const sent = h.orders.at(-1);
  assert.equal(sent.amount, 49900);
  assert.equal(sent.currency, 'INR');
  assert.equal(sent.notes.x, undefined, 'client notes must not reach Razorpay');

  const { Payment } = require('../../src/modules/payments/payment.model');
  const record = await Payment.findOne({ orderId: sent.id }).lean();
  assert.equal(record.metadata.couponCode, undefined, 'client metadata must not be stored');
});

test('full purchase: materials locked -> pay -> verify -> enrolled -> materials open', async () => {
  const { course } = await seedCourse(49900);
  const user = await h.signup();
  const materials = `/api/v1/courses/${course._id}/materials`;

  assert.equal((await h.api('GET', materials, { token: user.token })).status, 403);

  const order = await h.api('POST', '/api/v1/payments/razorpay/order', {
    token: user.token,
    body: { courseId: String(course._id), amount: 49900 },
  });
  const orderId = h.orders.at(-1).id;
  const verify = await h.api('POST', '/api/v1/payments/razorpay/verify', {
    token: user.token,
    body: { orderId, paymentId: 'pay_course_1', signature: h.checkoutSignature(orderId, 'pay_course_1'), courseId: String(course._id) },
  });
  assert.equal(verify.status, 200, JSON.stringify(verify.body));
  assert.ok(order.body);

  const open = await h.api('GET', materials, { token: user.token });
  assert.equal(open.status, 200);
  assert.equal(open.body.data.materials[0].title, 'Pitch deck template');

  const enrollments = await h.api('GET', '/api/v1/enrollments', { token: user.token });
  assert.ok(JSON.stringify(enrollments.body).includes(String(course._id)));
});

test('a free course cannot be pushed through paid checkout', async () => {
  const { course } = await seedCourse(0);
  const user = await h.signup();
  const order = await h.api('POST', '/api/v1/payments/razorpay/order', {
    token: user.token,
    body: { courseId: String(course._id), amount: 49900 },
  });
  assert.equal(order.status, 400);
});

test('an order needs a course or an event', async () => {
  const user = await h.signup();
  const order = await h.api('POST', '/api/v1/payments/razorpay/order', { token: user.token, body: { amount: 100 } });
  assert.equal(order.status, 400);
});

test('a client-created "succeeded" payment never turns into a free enrollment', async () => {
  const { course } = await seedCourse(49900);
  const user = await h.signup();
  const res = await h.api('POST', '/api/v1/payments', {
    token: user.token,
    body: { courseId: String(course._id), amount: 0, status: 'succeeded', provider: 'manual' },
  });
  assert.ok(res.status < 300, JSON.stringify(res.body));

  const { Payment } = require('../../src/modules/payments/payment.model');
  const stored = await Payment.findOne({ userId: user.id, courseId: course._id }).lean();
  assert.equal(stored.status, 'created');
  assert.notEqual(stored.provider, 'manual');

  await require('../../src/modules/enrollments/enrollments.service').reconcileOrphanedPayments();
  const { Enrollment } = require('../../src/modules/enrollments/enrollment.model');
  assert.equal(await Enrollment.countDocuments({ userId: user.id, courseId: course._id }), 0);
});

test('boot reconciliation enrolls a genuinely paid but un-enrolled purchase, once', async () => {
  const { course } = await seedCourse(49900);
  const user = await h.signup();
  const { Payment } = require('../../src/modules/payments/payment.model');
  await Payment.create({ userId: user.id, courseId: course._id, provider: 'razorpay', amount: 49900, currency: 'INR', status: 'succeeded', orderId: 'order_orphan_1' });

  const svc = require('../../src/modules/enrollments/enrollments.service');
  await svc.reconcileOrphanedPayments();
  await svc.reconcileOrphanedPayments();
  const { Enrollment } = require('../../src/modules/enrollments/enrollment.model');
  assert.equal(await Enrollment.countDocuments({ userId: user.id, courseId: course._id }), 1);
});

test('public syllabus shows preview content only and never quiz answers', async () => {
  const { mod } = await seedCourse(49900);
  const res = await h.api('GET', `/api/v1/courses/modules/${mod._id}/lessons`);
  assert.equal(res.status, 200);
  const [intro, paid] = res.body.data;
  assert.equal(intro.videoUrl, 'https://cdn/free.mp4');
  assert.equal(paid.videoUrl, undefined);
  assert.ok(!JSON.stringify(res.body).includes('answer'));
});

test('course webhook settles a purchase when the browser never returns', async () => {
  const { course } = await seedCourse(49900);
  const user = await h.signup();
  await h.api('POST', '/api/v1/payments/razorpay/order', {
    token: user.token,
    body: { courseId: String(course._id), amount: 49900 },
  });
  const orderId = h.orders.at(-1).id;
  const hook = h.signWebhook({
    event: 'payment.captured',
    payload: { payment: { entity: { id: 'pay_hook_course', order_id: orderId, amount: 49900, currency: 'INR' } } },
  });
  const res = await h.api('POST', '/api/v1/payments/razorpay/webhook', { raw: hook.raw, headers: { 'x-razorpay-signature': hook.sig } });
  assert.equal(res.status, 200);

  const { Enrollment } = require('../../src/modules/enrollments/enrollment.model');
  assert.equal(await Enrollment.countDocuments({ userId: user.id, courseId: course._id }), 1);
});
