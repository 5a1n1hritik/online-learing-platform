import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createQuiz = async (req, res) => {
  const { title, timeLimit, passingScore, courseId } = req.body;

  if (!title || !timeLimit || !passingScore || !courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  // Check if the course exists
  const course = await prisma.course.findUnique({
    where: {
      id: parseInt(courseId),
    },
  });
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        timeLimit,
        passingScore,
        courseId,
      },
    });
    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
    });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};

export const getQuizById = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

export const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, timeLimit, passingScore } = req.body;

  try {
    const quiz = await prisma.quiz.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        timeLimit,
        passingScore,
      },
    });

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update quiz",
    });
  }
};

export const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.quiz.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
    });
  }
};

export const getQuizByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId: parseInt(courseId),
      },
    });

    if (quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quizzes found for this course",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quizzes fetched successfully",
      quiz: quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};

export const addQuestionToQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { question_en, question_hi, difficulty, options } = req.body;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: parseInt(quizId),
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (!question_en || !question_hi || !difficulty || !options) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const createdQuestion = await prisma.quizQuestion.create({
      data: {
        question_en,
        question_hi,
        difficulty,
        quiz: { connect: { id: parseInt(quizId) } },
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
      message: "Questions added successfully",
      questions: createdQuestion,
    });
  } catch (error) {
    console.error("Error adding questions to quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add questions to quiz",
    });
  }
};

export const getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const language = req.query.language || "en"; // 'en' or 'hi'

    const questions = await prisma.quizQuestion.findMany({
      where: { quizId: parseInt(quizId) },
      include: { options: true },
    });

    const localizedQuestions = questions.map((q) => ({
      id: q.id,
      question: language === "hi" ? q.question_hi : q.question_en,
      difficulty: q.difficulty,
      options: q.options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        text: language === "hi" ? opt.text_hi : opt.text_en,
      })),
    }));

    res.status(200).json({
      success: true,
      message: "Quiz questions fetched successfully",
      questions: localizedQuestions,
    });
  } catch (error) {
    console.error("Get Quiz Questions Error:", error);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
};

export const submitQuiz = async (req, res) => {
  const quizId = parseInt(req.params.quizId);
  const userId = req.user.id;
  const { timeTaken, answers } = req.body;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let score = 0;
    const answerRecords = [];

    for (const answer of answers) {
      const option = await prisma.quizOption.findUnique({
        where: { id: answer.selectedOption },
      });
      if (!option) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid option selected" });
      }

      const question = await prisma.quizQuestion.findUnique({
        where: { id: option.quizQuestionId },
      });
      if (!question) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid question for option" });
      }

      const isCorrect = option.isCorrect;
      if (isCorrect) score += 1;

      answerRecords.push({
        questionId: question.id,
        selectedOption: option.id,
        isCorrect,
      });
    }

    const submission = await prisma.quizSubmission.create({
      data: {
        user: { connect: { id: userId } },
        quiz: { connect: { id: quizId } },
        score,
        timeTaken,
        userAnswers: {
          create: answerRecords.map((ans) => ({
            question: { connect: { id: ans.questionId } },
            selectedOption: ans.selectedOption,
            isCorrect: ans.isCorrect,
          })),
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      score,
      totalQuestions: answers.length,
    });
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    res.status(500).json({ success: false, error: "Failed to submit quiz" });
  }
};

export const getUserQuizResult = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    const submission = await prisma.quizSubmission.findFirst({
      where: {
        quizId: parseInt(quizId),
        userId: parseInt(userId),
      },
      include: {
        quiz: true,
        userAnswers: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
            selectedOption: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const detailedAnswers = submission.userAnswers.map((ans) => {
      const correctOption = ans.question.options.find((opt) => opt.isCorrect);
      const selectedOption = ans.selectedOption;

      return {
        questionId: ans.question.id,
        questionText_en: ans.question.question_en,
        questionText_hi: ans.question.question_hi,
        selectedOptionId: selectedOption?.id || null,
        selectedOptionText_en: selectedOption?.text_en || null,
        selectedOptionText_hi: selectedOption?.text_hi || null,
        isCorrect: ans.isCorrect,
        correctOptionId: correctOption?.id || null,
        correctOptionText_en: correctOption?.text_en || null,
        correctOptionText_hi: correctOption?.text_hi || null,
        allOptions: ans.question.options.map((opt) => ({
          id: opt.id,
          text_en: opt.text_en,
          text_hi: opt.text_hi,
          isCorrect: opt.isCorrect,
        })),
      };
    });

    res.status(200).json({
      success: true,
      message: "Quiz result fetched successfully",
      quiz: {
        id: submission.quiz.id,
        title: submission.quiz.title,
      },
      score: submission.score,
      timeTaken: submission.timeTaken,
      totalQuestions: submission.userAnswers.length,
      detailedAnswers,
    });
  } catch (error) {
    console.error("Get Quiz Result Error:", error);
    res.status(500).json({ error: "Failed to fetch quiz result" });
  }
};

export const getQuizProgress = async (req, res) => {
  const { userId } = req.params;

  try {
    const progress = await prisma.quizSubmission.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        quiz: true, // Include quiz details if needed
      },
    });

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Error fetching quiz progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz progress",
    });
  }
};
