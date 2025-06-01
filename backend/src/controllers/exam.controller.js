import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createExam = async (req, res) => {
  const { title, timeLimit, passingScore, type, courseId, paperId } = req.body;

  try {
    // Validate required fields
    if (!title || !timeLimit || !passingScore || !type || !courseId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Validate type
    const validTypes = ["MCQ", "Descriptive", "Mixed"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid exam type. Valid types are: ${validTypes.join(", ")}`,
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
        timeLimit,
        passingScore,
        type,
        courseId,
        paperId: paperId || null,
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
    const exams = await prisma.exam.findMany({
      //   include: {
      //     paper: {
      //       include: {
      //         questions: {
      //           orderBy: { order: "asc" },
      //           include: {
      //             question: {
      //               include: { options: true },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
    });
    res.status(200).json({
      success: true,
      message: "Exams fetched successfully",
      exams,
    });
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch exams",
      details: err.message,
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
      //   include: {
      //     paper: {
      //       include: {
      //         questions: {
      //           orderBy: { order: "asc" },
      //           include: {
      //             question: {
      //               include: { options: true },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
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
        questions: { include: { options: true } },
      },
    });
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

export const startExam = async (req, res) => {
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
    const prevAttempts = await prisma.examActivity.count({
      where: {
        examId,
        userId,
        status: "STARTED",
      },
    });
    // If the user has already started this exam, return an error
    if (prevAttempts) {
      return res.status(400).json({
        success: false,
        message:
          "You have already started this exam and not submitted it yet. Please complete or submit your previous attempt before starting a new one.",
      });
    }
    // If the user has no previous submissions, this is their first attempt
    // Check if the exam exists
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
    // If the exam is found, we can proceed to start it
    // Count total attempts made by this user for this exam
    const totalAttempts = await prisma.examActivity.count({
      where: {
        userId,
        examId,
      },
    });
    // If this is the first attempt, set attempts to 0

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
      message: "Exam started successfully",
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
    // Get exam with questions and correct answers
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

    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

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

      if (isCorrect) correct++;
      else if (attempted) incorrect++;
      else skipped++;

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
    const score = correct;
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
