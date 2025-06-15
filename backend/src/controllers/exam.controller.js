import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createExam = async (req, res) => {
  const {
    title,
    description,
    timeLimit,
    passingScore,
    type,
    courseId,
    paperId,
    category,
    difficulty,
    tags,
    participants,
    isPaid,
    negativeMarking,
  } = req.body;

  try {
    // Validate required fields
    if (!title || !timeLimit || !passingScore || !type || !courseId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Validate type
    const validTypes = [
      "QUIZ",
      "PRACTICE",
      "MOCK",
      "MCQ",
      "FINAL",
      "DESCRIPTIVE",
      "MIXED",
    ];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid exam type. Valid types are: ${validTypes.join(", ")}`,
      });
    }
    // Validate difficulty level (optional, but recommended)
    const validDifficulties = ["EASY", "MEDIUM", "HARD"];
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: `Invalid difficulty level. Valid options: ${validDifficulties.join(
          ", "
        )}`,
      });
    }
    // Validate courseId
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    // Validate paperId if provided
    if (paperId) {
      const paper = await prisma.examPaper.findUnique({
        where: { id: parseInt(paperId) },
      });
      if (!paper) {
        return res.status(404).json({ error: "Exam paper not found" });
      }
    }
    const exam = await prisma.exam.create({
      data: {
        title,
        description: description || "",
        categoryId: category ? parseInt(category) : null,
        difficulty: difficulty ? difficulty.toUpperCase() : undefined,
        tags: tags || [],
        negativeMarking: negativeMarking || 0,
        timeLimit,
        passingScore,
        type: type.toUpperCase(),
        courseId,
        paperId: paperId || null,
        participants: participants || 0,
        isPaid: isPaid || false,
      },
    });
    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create exam",
      details: error.message,
    });
  }
};

export const getAllExams = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      type,
      difficulty,
      courseId,
      categoryId,
      isPaid,
      search,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const filters = {};
    if (type) filters.type = type;
    if (difficulty) filters.difficulty = difficulty;
    if (courseId) filters.courseId = parseInt(courseId);
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (isPaid !== undefined) filters.isPaid = isPaid === "true";

    const searchConditions = [];

    if (search) {
      searchConditions.push(
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search.toLowerCase()] } }
      );
    }

    const where = {
      ...filters,
      ...(searchConditions.length > 0 && {
        OR: searchConditions,
      }),
    };

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          course: { select: { id: true, title: true } },
          category: { select: { id: true, name: true } },
          paper: { select: { id: true, title: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.exam.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      message: "Exams fetched successfully",
      data: exams,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCourseExams = async (req, res) => {
  const { courseId } = req.params;
  try {
    // Validate courseId
    if (!courseId || isNaN(parseInt(courseId))) {
      return res.status(400).json({ error: "Invalid course ID" });
    }
    const exams = await prisma.exam.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        paper: {
          include: {
            questions: {
              orderBy: { order: "asc" },
              include: {
                question: {
                  include: { options: true },
                },
              },
            },
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Exams for course fetched successfully",
      exams,
    });
  } catch (err) {
    console.error("Error fetching course exams:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch course exams",
      details: err.message,
    });
  }
};

export const getExamDetails = async (req, res) => {
  const { examId } = req.params;
  try {
    // Validate examId
    if (!examId || isNaN(parseInt(examId))) {
      return res.status(400).json({ error: "Invalid exam ID" });
    }
    const exam = await prisma.exam.findUnique({
      where: { id: parseInt(examId) },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        paper: {
          include: {
            questions: {
              orderBy: { order: "asc" },
              include: {
                question: {
                  include: { options: true },
                },
              },
            },
          },
        },
        submissions: {
          select: {
            id: true,
            userId: true,
            score: true,
            status: true,
            submittedAt: true,
          },
        },
        activities: {
          select: {
            id: true,
            userId: true,
            startedAt: true,
            completedAt: true,
            status: true,
            attempts: true,
          },
        },
        // questions: { include: { options: true } },
      },
    });

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({
      success: true,
      message: "Exam details fetched successfully",
      exam,
    });
  } catch (err) {
    console.error("Error fetching exam:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch exam",
      details: err.message,
    });
  }
};

export const addQuestionToExam = async (req, res) => {
  const { examId } = req.params;
  const { question_en, question_hi, difficulty, options } = req.body;

  try {
    const exams = await prisma.exam.findUnique({
      where: {
        id: parseInt(examId),
      },
    });

    if (!exams) {
      return res.status(404).json({ error: "Exam not found" });
    }

    if (!question_en || !question_hi || !difficulty || !options) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const examQuestion = await prisma.examQuestion.create({
      data: {
        question_en,
        question_hi,
        difficulty,
        exam: { connect: { id: parseInt(examId) } },
        options: {
          create: options.map((opt) => ({
            label: opt.label,
            text_en: opt.text_en,
            text_hi: opt.text_hi,
            isCorrect: opt.isCorrect || false,
          })),
        },
      },
      include: { options: true },
    });

    res.status(201).json({
      success: true,
      message: "Exam questions added successfully",
      examQuestion,
    });
  } catch (error) {
    console.error("Error adding questions to exam:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add questions to exam",
    });
  }
};

export const checkExamAttempt = async (req, res) => {
  const examId = parseInt(req.params.examId);
  const userId = req.user?.id;
  if (!userId || !examId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user or invalid exam ID.",
    });
  }
  try {
    // Check for an existing pending attempt (started but not submitted)
    const existingActivity = await prisma.examActivity.findFirst({
      where: {
        examId,
        userId,
        status: "STARTED",
      },
      select: {
        id: true,
        attempts: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Exam attempt status fetched successfully",
      hasOngoingAttempt: !!existingActivity,
      ongoingActivity: existingActivity || null,
    });
  } catch (error) {
    console.error("Error checking exam attempt:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

export const startExam = async (req, res) => {
  const examId = parseInt(req.params.examId);
  const userId = req.user?.id;
  const resume = req.query.resume === "true";

  if (!userId || !examId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user or invalid exam ID.",
    });
  }
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      // include: {
      //   paper: {
      //     include: {
      //       questions: {
      //         orderBy: { order: "asc" },
      //         include: {
      //           question: {
      //             include: { options: true },
      //           },
      //         },
      //       },
      //     },
      //   },
      //   questions: { include: { options: true } },
      // },
    });
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Resume old exam
    if (resume) {
      const existingActivity = await prisma.examActivity.findFirst({
        where: {
          userId,
          examId,
          status: "STARTED",
        },
      });

      if (existingActivity) {
        return res.status(200).json({
          success: true,
          message: "Resuming previous exam attempt",
          exam: {
            id: exam.id,
            title: exam.title,
            timeLimit: exam.timeLimit,
            passingScore: exam.passingScore,
            type: exam.type,
            attempts: existingActivity.attempts,
          },
          activity: {
            id: existingActivity.id,
            userId: existingActivity.userId,
            status: existingActivity.status,
            startedAt: existingActivity.createdAt,
            attempts: existingActivity.attempts,
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "No previous exam attempt to resume.",
        });
      }
    }

    // 3. Expire any previously unsubmitted attempts
    await prisma.examActivity.updateMany({
      where: {
        examId,
        userId,
        status: "STARTED",
      },
      data: {
        status: "EXPIRED",
      },
    });

    // Count total attempts made by this user for this exam
    const totalAttempts = await prisma.examActivity.count({
      where: {
        userId,
        examId,
      },
    });

    // Create a new activity
    const activity = await prisma.examActivity.create({
      data: {
        examId,
        userId,
        attempts: totalAttempts + 1,
        status: "STARTED",
      },
    });

    // Return the exam details along with the activity
    return res.status(200).json({
      success: true,
      message: "New exam attempt started successfully",
      exam: {
        id: exam.id,
        title: exam.title,
        timeLimit: exam.timeLimit,
        passingScore: exam.passingScore,
        type: exam.type,
        attempts: activity.attempts,
      },
      // Return the activity details
      activity: {
        id: activity.id,
        userId: activity.userId,
        status: activity.status,
        startedAt: activity.createdAt,
        attempts: activity.attempts,
      },
    });
  } catch (error) {
    console.error("Error starting exam activity:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

export const submitExam = async (req, res) => {
  const examId = parseInt(req.params.examId);
  const { answers, timeTaken, activityId } = req.body;
  const userId = req.user?.id;

  if (!userId || !examId || !activityId || !Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input or unauthenticated user.",
    });
  }

  try {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        paper: {
          include: {
            questions: {
              orderBy: { order: "asc" },
              include: {
                question: {
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!exam || !exam.paper || exam.paper.questions.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Exam or its questions not found" });

    // Prepare answer evaluations
    const totalQuestions = exam.paper.questions.length;
    if (totalQuestions === 0) {
      return res.status(400).json({
        success: false,
        message: "No questions found in the exam",
      });
    }

    const negativeMarkPerWrong = exam.negativeMarking || 0;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    let totalScore = 0;

    const review = [];
    const examAnswers = [];

    // Create the submission
    const submission = await prisma.examSubmission.create({
      data: {
        examId,
        userId,
        score: 0,
        timeTaken,
        status: "PENDING",
      },
    });

    const questionsList = exam?.paper?.questions || [];

    for (const paperQ of questionsList.sort((a, b) => a.order - b.order)) {
      const q = paperQ.question;
      if (!q || !q.options) continue;

      const answer = answers.find((ans) => ans.questionId === q.id);
      const selectedOptionId = answer?.selectedOptionId || null;

      const correctOptionId = q.options.find((opt) => opt.isCorrect)?.id;
      if (!correctOptionId) {
        skipped++;
        continue;
      }

      const attempted = selectedOptionId !== null;
      const isCorrect = attempted && selectedOptionId === correctOptionId;

      if (isCorrect) {
        correct++;
        totalScore += 1;
      } else if (attempted) {
        incorrect++;
        totalScore -= negativeMarkPerWrong;
      } else {
        skipped++;
      }

      examAnswers.push({
        submissionId: submission.id,
        questionId: q.id,
        selectedOption: selectedOptionId,
        isCorrect,
        attempted,
        examActivityId: activityId,
      });

      review.push({
        questionId: q.id,
        questionText_en: q.question_en,
        questionText_hi: q.question_hi,
        options: q.options.map((opt) => ({
          optionId: opt.id,
          text_en: opt.text_en,
          text_hi: opt.text_hi,
          isCorrect: opt.isCorrect,
        })),
        correctOptionId,
        selectedOptionId,
        isCorrect,
        attempted,
      });
    }

    // Calculate the score and status
    const score = Math.max(0, +totalScore.toFixed(2));
    const percentage = (score / totalQuestions) * 100;
    const passMark = exam.passingScore || 70;
    const status = percentage >= passMark ? "PASSED" : "FAILED";

    // Save all exam answers + update submission using transaction
    await prisma.$transaction([
      prisma.examAnswer.createMany({
        data: examAnswers,
      }),
      prisma.examSubmission.update({
        where: { id: submission.id },
        data: {
          score,
          status,
        },
      }),
    ]);

    // Update the activity status to COMPLETED
    await prisma.examActivity.update({
      where: { id: activityId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        durationSeconds: timeTaken,
      },
    });

    const uniqueParticipants = await prisma.examSubmission.findMany({
      where: { examId },
      distinct: ["userId"],
      select: { userId: true },
    });
    const participantCount = uniqueParticipants.length;

    await prisma.exam.update({
      where: { id: examId },
      data: {
        participants: participantCount,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      exam: {
        id: examId,
        title: exam.title,
      },
      result: {
        submissionId: submission.id,
        score,
        total: totalQuestions,
        correct,
        incorrect,
        skipped,
        passMark,
        percentage: +percentage.toFixed(2),
        status,
        timeTaken,
        negativeMarking: negativeMarkPerWrong,
        review,
      },
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateExam = async (req, res) => {
  const examId = parseInt(req.params.id);
  const {
    title,
    description,
    timeLimit,
    passingScore,
    type,
    courseId,
    paperId,
    categoryId,
    difficulty,
    tags,
    isPaid,
    negativeMarking,
  } = req.body;

  try {
    // Validate required fields
    if (
      !examId ||
      !title ||
      !timeLimit ||
      !passingScore ||
      !type ||
      !courseId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate type
    const validTypes = [
      "QUIZ",
      "PRACTICE",
      "MOCK",
      "MCQ",
      "FINAL",
      "DESCRIPTIVE",
      "MIXED",
    ];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid exam type. Valid types are: ${validTypes.join(", ")}`,
      });
    }

    // Validate difficulty level (optional, but recommended)
    const validDifficulties = ["EASY", "MEDIUM", "HARD"];
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: `Invalid difficulty level. Valid options: ${validDifficulties.join(
          ", "
        )}`,
      });
    }

    // Validate courseId
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Validate categoryId if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // Validate paperId if provided
    if (paperId) {
      const paper = await prisma.examPaper.findUnique({
        where: { id: parseInt(paperId) },
      });
      if (!paper) {
        return res.status(404).json({ error: "Exam paper not found" });
      }
    }

    const updatedExam = await prisma.exam.update({
      where: { id: parseInt(examId) },
      data: {
        title,
        description: description || "",
        categoryId: categoryId ? parseInt(categoryId) : null,
        difficulty: difficulty ? difficulty.toUpperCase() : undefined,
        tags: tags || [],
        negativeMarking: negativeMarking || 0,
        timeLimit,
        passingScore,
        type: type.toUpperCase(),
        courseId,
        paperId: paperId || null,
        isPaid: isPaid || false,
      },
    });

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      exam: updatedExam,
    });
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update exam",
      details: error.message,
    });
  }
};

export const deleteExam = async (req, res) => {
  const examId = parseInt(req.params.id);
  try {
    // Validate examId
    if (!examId || isNaN(examId)) {
      return res.status(400).json({ error: "Invalid exam ID" });
    }

    // Check if the exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Delete the exam
    await prisma.exam.delete({
      where: { id: examId },
    });

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete exam",
      details: error.message,
    });
  }
};
