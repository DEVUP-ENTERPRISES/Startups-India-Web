const { Course, Module, Lesson } = require('../courses/course.model');
const { ModuleQuiz } = require('../courses/moduleQuiz.model');
const {
  Enrollment,
  LessonProgress,
  ModuleQuizAttempt,
} = require('../enrollments/enrollment.model');
const { ApiError } = require('../../utils/apiError');
const { extractS3Key, generateDownloadUrl } = require('../../utils/s3');
const { cacheGet, cacheSet, cacheDel } = require('../../infrastructure/cache/redis');

const DOWNLOAD_URL_EXPIRY_SECONDS = 3600;

async function signS3Url(fileUrl, explicitKey = null) {
  const key = explicitKey || extractS3Key(fileUrl);
  if (!key) return fileUrl;

  const signed = await generateDownloadUrl(key, DOWNLOAD_URL_EXPIRY_SECONDS);
  return signed || fileUrl;
}

// ─── COURSE DASHBOARD ──────────────────────────────────────────
async function getCourseDashboard(userId, courseId) {
  const course = await Course.findById(courseId).lean();
  if (!course) throw new ApiError(404, 'Course not found');

  const enrollment = await Enrollment.findOne({ userId, courseId }).lean();
  if (!enrollment) {
    return {
      state: 'not_enrolled',
      course: await sanitizeCourse(course),
    };
  }

  // Cohort check: if course hasn't started yet (compare dates only, course is active on its startDate)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const courseStart = course.startDate
    ? new Date(
        new Date(course.startDate).getFullYear(),
        new Date(course.startDate).getMonth(),
        new Date(course.startDate).getDate()
      )
    : null;
  if (courseStart && todayStart < courseStart) {
    return {
      state: 'pre_start',
      course: await sanitizeCourse(course),
      enrollment,
      preStartMessage: course.preStartMessage || 'Welcome! The course will begin shortly.',
      startDate: course.startDate,
    };
  }

  // Active state - return full course content with progress
  // Check progress cache first
  const progressCacheKey = `progress:${userId}:${courseId}`;
  const cachedDashboard = await cacheGet(progressCacheKey);
  if (cachedDashboard) return cachedDashboard;

  const modules = await Module.find({ courseId }).sort({ sortOrder: 1 }).lean();
  const lessons = await Lesson.find({
    moduleId: { $in: modules.map(m => m._id) },
  })
    .sort({ sortOrder: 1 })
    .lean();

  const quizzes = await ModuleQuiz.find({
    moduleId: { $in: modules.map(m => m._id) },
    isActive: true,
  }).lean();

  const lessonProgress = await LessonProgress.find({ userId, courseId }).lean();
  const quizAttempts = await ModuleQuizAttempt.find({ userId, courseId }).lean();

  // Update last accessed
  Enrollment.updateOne(
    { _id: enrollment._id },
    { $set: { lastAccessedAt: new Date(), status: 'active' } }
  ).exec();

  // Build module unlock map
  const moduleData = buildModuleData(
    modules,
    lessons,
    quizzes,
    lessonProgress,
    quizAttempts,
    course
  );

  // Calculate overall progress
  const totalLessons = lessons.length;
  const completedLessons = lessonProgress.filter(lp => lp.isCompleted).length;
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const dashboardResult = {
    state: 'active',
    course: await sanitizeCourse(course),
    enrollment: { ...enrollment, progress: overallProgress },
    modules: moduleData,
    progress: {
      totalLessons,
      completedLessons,
      percentage: overallProgress,
    },
  };

  // Cache progress for 120s (short TTL - progress changes frequently)
  cacheSet(progressCacheKey, dashboardResult, 120).catch(() => {});

  return dashboardResult;
}

function buildModuleData(modules, lessons, quizzes, lessonProgress, quizAttempts, course) {
  const lpMap = {};
  lessonProgress.forEach(lp => {
    lpMap[String(lp.lessonId)] = lp;
  });

  const qaMap = {};
  quizAttempts.forEach(qa => {
    const key = String(qa.moduleId);
    if (!qaMap[key] || qa.passed) {
      qaMap[key] = qa;
    }
  });

  const quizMap = {};
  quizzes.forEach(q => {
    quizMap[String(q.moduleId)] = q;
  });

  const lessonsByModule = {};
  lessons.forEach(l => {
    const key = String(l.moduleId);
    if (!lessonsByModule[key]) lessonsByModule[key] = [];
    lessonsByModule[key].push(l);
  });

  const startDate = course.startDate ? new Date(course.startDate) : null;
  const now = new Date();

  return modules.map((mod, index) => {
    const modId = String(mod._id);
    const modLessons = lessonsByModule[modId] || [];
    const quiz = quizMap[modId] || null;
    const quizAttempt = qaMap[modId] || null;

    const completedInModule = modLessons.filter(l => lpMap[String(l._id)]?.isCompleted).length;
    const moduleProgress =
      modLessons.length > 0 ? Math.round((completedInModule / modLessons.length) * 100) : 0;
    const allLessonsComplete = modLessons.length > 0 && completedInModule === modLessons.length;
    const quizPassed = quizAttempt?.passed || false;

    // Determine unlock status
    let isUnlocked = false;
    if (index === 0) {
      // First module: unlock based on unlockAfterDays from course start
      if (mod.unlockAfterDays && mod.unlockAfterDays > 0 && startDate) {
        const unlockDate = new Date(startDate);
        unlockDate.setDate(unlockDate.getDate() + mod.unlockAfterDays);
        isUnlocked = now >= unlockDate;
      } else {
        isUnlocked = true;
      }
    } else {
      // Subsequent modules: previous module must be complete (all lessons + quiz passed)
      const prevMod = modules[index - 1];
      const prevModId = String(prevMod._id);
      const prevLessons = lessonsByModule[prevModId] || [];
      const prevCompleted = prevLessons.filter(l => lpMap[String(l._id)]?.isCompleted).length;
      const prevAllComplete = prevLessons.length > 0 && prevCompleted === prevLessons.length;
      const prevQuizPassed = qaMap[prevModId]?.passed || false;
      const prevQuizExists = !!quizMap[prevModId];

      const prevModuleDone = prevAllComplete && (!prevQuizExists || prevQuizPassed);

      // Also check unlockAfterDays
      if (mod.unlockAfterDays && mod.unlockAfterDays > 0 && startDate) {
        const unlockDate = new Date(startDate);
        unlockDate.setDate(unlockDate.getDate() + mod.unlockAfterDays);
        isUnlocked = prevModuleDone && now >= unlockDate;
      } else {
        isUnlocked = prevModuleDone;
      }
    }

    return {
      ...mod,
      isUnlocked,
      lessons: modLessons.map((l, li) => {
        // Sequential lesson locking: first lesson always unlocked (if module is unlocked),
        // subsequent lessons require previous lesson to be completed
        const isLessonLocked = li > 0 ? !lpMap[String(modLessons[li - 1]._id)]?.isCompleted : false;
        return {
          ...l,
          isCompleted: !!lpMap[String(l._id)]?.isCompleted,
          completedAt: lpMap[String(l._id)]?.completedAt || null,
          isLocked: isLessonLocked,
        };
      }),
      quiz: quiz
        ? {
            _id: quiz._id,
            title: quiz.title,
            questionCount: quiz.questions?.length || 0,
            passingScore: quiz.passingScore,
          }
        : null,
      quizAttempt: quizAttempt
        ? {
            score: quizAttempt.score,
            totalQuestions: quizAttempt.totalQuestions,
            percentage: quizAttempt.percentage,
            passed: quizAttempt.passed,
            attemptedAt: quizAttempt.createdAt,
          }
        : null,
      progress: moduleProgress,
      allLessonsComplete,
      quizPassed,
    };
  });
}

// ─── LESSON DETAIL (with signed video URL) ─────────────────────
async function getLessonDetail(userId, courseId, lessonId) {
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) throw new ApiError(404, 'Lesson not found');

  // Verify the lesson belongs to a module of this course
  const mod = await Module.findById(lesson.moduleId).lean();
  if (!mod || String(mod.courseId) !== courseId) {
    throw new ApiError(403, 'Lesson does not belong to this course');
  }

  // Sequential lesson locking: check if previous lesson in module is completed
  const moduleLessons = await Lesson.find({ moduleId: lesson.moduleId })
    .sort({ sortOrder: 1 })
    .lean();
  const lessonIndex = moduleLessons.findIndex(l => String(l._id) === lessonId);
  if (lessonIndex > 0) {
    const prevLesson = moduleLessons[lessonIndex - 1];
    const prevProgress = await LessonProgress.findOne({
      userId,
      courseId,
      lessonId: prevLesson._id,
    }).lean();
    if (!prevProgress?.isCompleted) {
      throw new ApiError(403, 'Complete the previous lesson first to unlock this lesson');
    }
  }

  // Generate signed URL if S3 video
  const signedVideoUrl = await signS3Url(lesson.videoUrl, lesson.videoKey);
  const signedAttachments = await Promise.all(
    (lesson.attachments || []).map(async attachment => ({
      ...attachment,
      downloadUrl: await signS3Url(attachment.fileUrl, attachment.key),
    }))
  );

  const lp = await LessonProgress.findOne({ userId, courseId, lessonId }).lean();

  return {
    ...lesson,
    attachments: signedAttachments,
    videoUrl: signedVideoUrl,
    isCompleted: !!lp?.isCompleted,
    completedAt: lp?.completedAt || null,
  };
}

// ─── MARK LESSON COMPLETE ──────────────────────────────────────
async function markLessonComplete(userId, courseId, lessonId, timeSpentSeconds = 0) {
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) throw new ApiError(404, 'Lesson not found');

  const mod = await Module.findById(lesson.moduleId).lean();
  if (!mod || String(mod.courseId) !== courseId) {
    throw new ApiError(403, 'Lesson does not belong to this course');
  }

  // Sequential lesson locking: verify previous lesson is completed
  const moduleLessons = await Lesson.find({ moduleId: lesson.moduleId })
    .sort({ sortOrder: 1 })
    .lean();
  const lessonIndex = moduleLessons.findIndex(l => String(l._id) === lessonId);
  if (lessonIndex > 0) {
    const prevLesson = moduleLessons[lessonIndex - 1];
    const prevProgress = await LessonProgress.findOne({
      userId,
      courseId,
      lessonId: prevLesson._id,
    }).lean();
    if (!prevProgress?.isCompleted) {
      throw new ApiError(403, 'Complete the previous lesson first');
    }
  }

  // Validate minimum time spent (90% of lesson duration required)
  const minTimeSeconds = (lesson.durationMinutes || 0) * 60;
  if (minTimeSeconds > 0 && timeSpentSeconds < minTimeSeconds * 0.9) {
    throw new ApiError(
      400,
      `You need to spend at least ${Math.ceil((minTimeSeconds * 0.9) / 60)} minutes on this lesson`
    );
  }

  const progress = await LessonProgress.findOneAndUpdate(
    { userId, courseId, lessonId },
    {
      $set: {
        moduleId: lesson.moduleId,
        lessonTitle: lesson.title,
        isCompleted: true,
        completedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  ).lean();

  // Recalculate overall enrollment progress
  const [allLessons, completedCount] = await Promise.all([
    Lesson.countDocuments({
      moduleId: { $in: await Module.find({ courseId }).distinct('_id') },
    }),
    LessonProgress.countDocuments({
      userId,
      courseId,
      isCompleted: true,
    }),
  ]);
  const pct = allLessons > 0 ? Math.round((completedCount / allLessons) * 100) : 0;

  const updateData = { progress: pct };
  if (pct === 100) {
    updateData.completed = true;
    updateData.completedAt = new Date();
    updateData.status = 'completed';
  }
  await Enrollment.updateOne({ userId, courseId }, { $set: updateData });

  // Invalidate progress cache so next dashboard load gets fresh data
  cacheDel(`progress:${userId}:${courseId}`).catch(() => {});

  return { progress, overallProgress: pct };
}

// ─── MODULE QUIZ ───────────────────────────────────────────────
async function getModuleQuiz(userId, courseId, moduleId) {
  const mod = await Module.findById(moduleId).lean();
  if (!mod || String(mod.courseId) !== courseId) {
    throw new ApiError(403, 'Module does not belong to this course');
  }

  const quiz = await ModuleQuiz.findOne({ moduleId, isActive: true }).lean();
  if (!quiz) throw new ApiError(404, 'No quiz found for this module');

  // Strip correct answers for student view
  const sanitizedQuestions = quiz.questions.map((q, i) => ({
    index: i,
    question: q.question,
    options: q.options,
  }));

  const lastAttempt = await ModuleQuizAttempt.findOne({ userId, moduleId })
    .sort({ createdAt: -1 })
    .lean();

  return {
    _id: quiz._id,
    title: quiz.title,
    questions: sanitizedQuestions,
    passingScore: quiz.passingScore,
    lastAttempt: lastAttempt
      ? {
          score: lastAttempt.score,
          totalQuestions: lastAttempt.totalQuestions,
          percentage: lastAttempt.percentage,
          passed: lastAttempt.passed,
          attemptedAt: lastAttempt.createdAt,
        }
      : null,
  };
}

async function submitModuleQuiz(userId, courseId, moduleId, answers) {
  const mod = await Module.findById(moduleId).lean();
  if (!mod || String(mod.courseId) !== courseId) {
    throw new ApiError(403, 'Module does not belong to this course');
  }

  const quiz = await ModuleQuiz.findOne({ moduleId, isActive: true }).lean();
  if (!quiz) throw new ApiError(404, 'No quiz found for this module');

  // Grade answers
  let correct = 0;
  const total = quiz.questions.length;

  for (const ans of answers) {
    const question = quiz.questions[ans.questionIndex];
    if (question && ans.selectedOption === question.correctOption) {
      correct++;
    }
  }

  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percentage >= quiz.passingScore;

  const attempt = await ModuleQuizAttempt.create({
    userId,
    courseId,
    moduleId,
    quizId: quiz._id,
    answers,
    score: correct,
    totalQuestions: total,
    percentage,
    passed,
  });

  // Invalidate progress cache (quiz result affects module unlock state)
  cacheDel(`progress:${userId}:${courseId}`).catch(() => {});

  return {
    score: correct,
    totalQuestions: total,
    percentage,
    passed,
    passingScore: quiz.passingScore,
    attemptedAt: attempt.createdAt,
  };
}

// ─── HELPERS ───────────────────────────────────────────────────
async function sanitizeCourse(course) {
  return {
    _id: course._id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    thumbnailUrl: await signS3Url(course.thumbnailUrl, course.thumbnailKey),
    videoIntroUrl: course.videoIntroUrl,
    priceInr: course.priceInr,
    originalPriceInr: course.originalPriceInr,
    durationWeeks: course.durationWeeks,
    totalModules: course.totalModules,
    category: course.category,
    level: course.level,
    difficultyLevel: course.difficultyLevel,
    enrolledCount: course.enrolledCount,
    startDate: course.startDate,
    endDate: course.endDate,
    enrollmentStatus: course.enrollmentStatus,
    isPublished: course.isPublished,
  };
}

module.exports = {
  getCourseDashboard,
  getLessonDetail,
  markLessonComplete,
  getModuleQuiz,
  submitModuleQuiz,
};
