const { Router } = require('express');
const { authRequired, requireRole } = require('../../middlewares/authMiddleware');
const { asyncHandler } = require('../../utils/asyncHandler');
const { cacheMiddleware } = require('../../middlewares/cache.middleware');
const ctrl = require('./admin.controller');

const adminRouter = Router();

// All admin routes require authentication + admin role
adminRouter.use(authRequired, requireRole('admin'));

// Dashboard analytics (cached 60s)
adminRouter.get('/dashboard', cacheMiddleware('dashboard:stats', 60), asyncHandler(ctrl.dashboard));

// Monitoring
adminRouter.get('/monitoring', asyncHandler(ctrl.monitoring));

// Users
adminRouter.get('/users', asyncHandler(ctrl.getUsers));
adminRouter.get('/users/:id', asyncHandler(ctrl.getUser));
adminRouter.patch('/users/:id', asyncHandler(ctrl.updateUser));
adminRouter.delete('/users/:id', asyncHandler(ctrl.deleteUser));

// Courses
adminRouter.get('/courses', asyncHandler(ctrl.getCourses));
adminRouter.get('/courses/:id', asyncHandler(ctrl.getCourse));
adminRouter.post('/courses', asyncHandler(ctrl.createCourse));
adminRouter.patch('/courses/:id', asyncHandler(ctrl.updateCourse));
adminRouter.delete('/courses/:id', asyncHandler(ctrl.deleteCourse));

// Course Builder - Modules
adminRouter.get('/courses/:courseId/modules', asyncHandler(ctrl.getModules));
adminRouter.post('/modules', asyncHandler(ctrl.createModule));
adminRouter.patch('/modules/:id', asyncHandler(ctrl.updateModule));
adminRouter.delete('/modules/:id', asyncHandler(ctrl.deleteModule));
adminRouter.post('/courses/:courseId/modules/reorder', asyncHandler(ctrl.reorderModules));

// Course Builder - Lessons
adminRouter.get('/modules/:moduleId/lessons', asyncHandler(ctrl.getLessons));
adminRouter.post('/lessons', asyncHandler(ctrl.createLesson));
adminRouter.patch('/lessons/:id', asyncHandler(ctrl.updateLesson));
adminRouter.delete('/lessons/:id', asyncHandler(ctrl.deleteLesson));

// Course Builder - Quizzes
adminRouter.get('/modules/:moduleId/quiz', asyncHandler(ctrl.getModuleQuiz));
adminRouter.post('/quizzes', asyncHandler(ctrl.upsertModuleQuiz));
adminRouter.delete('/modules/:moduleId/quiz', asyncHandler(ctrl.deleteModuleQuiz));

// Course Materials (admin-uploaded notes/PDFs)
adminRouter.post('/courses/:id/materials', asyncHandler(ctrl.addCourseMaterial));
adminRouter.delete('/courses/:id/materials/:materialId', asyncHandler(ctrl.deleteCourseMaterial));

// S3 Upload URL
adminRouter.post('/upload-url', asyncHandler(ctrl.getUploadUrl));

// Payments
adminRouter.get('/payments', asyncHandler(ctrl.getPayments));
adminRouter.post('/payments/:id/refund', asyncHandler(ctrl.refundPayment));

// Enrollments
adminRouter.get('/enrollments', asyncHandler(ctrl.getEnrollments));
adminRouter.post('/enrollments', asyncHandler(ctrl.createEnrollment));

// Certificates
adminRouter.get('/certificates', asyncHandler(ctrl.getCertificates));
adminRouter.post('/certificates/:id/revoke', asyncHandler(ctrl.revokeCertificate));

// Blog
adminRouter.get('/blog', asyncHandler(ctrl.getBlogPosts));
adminRouter.post('/blog', asyncHandler(ctrl.createBlogPost));
adminRouter.patch('/blog/:id', asyncHandler(ctrl.updateBlogPost));
adminRouter.delete('/blog/:id', asyncHandler(ctrl.deleteBlogPost));

// Events
adminRouter.get('/events', asyncHandler(ctrl.getEvents));
adminRouter.post('/events', asyncHandler(ctrl.createEvent));
adminRouter.patch('/events/:id', asyncHandler(ctrl.updateEvent));
adminRouter.delete('/events/:id', asyncHandler(ctrl.deleteEvent));

// Leads/CRM
adminRouter.get('/leads', asyncHandler(ctrl.getLeads));
adminRouter.post('/leads', asyncHandler(ctrl.createLead));
adminRouter.patch('/leads/:id', asyncHandler(ctrl.updateLead));
adminRouter.delete('/leads/:id', asyncHandler(ctrl.deleteLead));

// Testimonials
adminRouter.get('/testimonials', asyncHandler(ctrl.getTestimonials));
adminRouter.post('/testimonials', asyncHandler(ctrl.createTestimonial));
adminRouter.patch('/testimonials/:id', asyncHandler(ctrl.updateTestimonial));
adminRouter.delete('/testimonials/:id', asyncHandler(ctrl.deleteTestimonial));

// Notifications
adminRouter.get('/notifications', asyncHandler(ctrl.getNotifications));
adminRouter.post('/notifications', asyncHandler(ctrl.createNotification));
adminRouter.delete('/notifications/:id', asyncHandler(ctrl.deleteNotification));

// Settings
adminRouter.get('/settings', asyncHandler(ctrl.getSettings));
adminRouter.post('/settings', asyncHandler(ctrl.upsertSetting));
adminRouter.delete('/settings/:key', asyncHandler(ctrl.deleteSetting));

module.exports = { adminRouter };
