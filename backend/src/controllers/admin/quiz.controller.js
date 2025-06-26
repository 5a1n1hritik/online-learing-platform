import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createQuiz = async (req, res) => {
  const { title, timeLimit, passingScore, courseId, dueDate, maxAttempts } =
    req.body;

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
        dueDate: dueDate ? new Date(dueDate) : null,
        maxAttempts: maxAttempts ?? 3,
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
  const {
    page = 1,
    limit = 10,
    title,
    courseId,
    status, // "completed", "pending", "upcoming"
  } = req.query;

  const userId = req.user?.userId;
  const pageNum = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNum - 1) * pageSize;

  const filters = {};

  if (courseId) {
    filters.courseId = Number(courseId);
  }

  if (title) {
    filters.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  const now = new Date();

  try {
    const quizzes = await prisma.quiz.findMany({
      where: filters,
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        submissions: {
          where: {
            userId: Number(userId),
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    const filtered = quizzes.filter((quiz) => {
      const hasSubmitted = quiz.submissions.length > 0;
      const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;

      if (status === "completed") return hasSubmitted;
      if (status === "pending")
        return !hasSubmitted && (!dueDate || dueDate <= now);
      if (status === "upcoming")
        return !hasSubmitted && dueDate && dueDate > now;
      return true; // If no status filter, return all
    });

    res.status(200).json({
      success: true,
      page: pageNum,
      totalPages: Math.ceil(filtered.length / pageSize),
      totalQuizzes: filtered.length,
      quizzes: filtered,
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
  const { quizId } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: parseInt(quizId),
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        course: true,
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
  const { quizId } = req.params;
  const { title, timeLimit, passingScore, dueDate, maxAttempts } = req.body;

  try {
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (timeLimit !== undefined) updateData.timeLimit = timeLimit;
    if (passingScore !== undefined) updateData.passingScore = passingScore;
    if (maxAttempts !== undefined) updateData.maxAttempts = maxAttempts;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);

    const quiz = await prisma.quiz.update({
      where: {
        id: parseInt(quizId),
      },
      data: updateData,
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
  const { quizId } = req.params;

  try {
    await prisma.quiz.delete({
      where: {
        id: parseInt(quizId),
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

    const parsedOptions =
      typeof options === "string" ? JSON.parse(options) : options;

    const imageUrl = req.file?.path || null;

    const createdQuestion = await prisma.quizQuestion.create({
      data: {
        question_en,
        question_hi,
        difficulty,
        imageUrl,
        quiz: { connect: { id: parseInt(quizId) } },
        options: {
          create: parsedOptions.map((opt) => ({
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

    const localizedQuestions = questions.map((q) => {
      const isExternalUrl = q.imageUrl?.startsWith("http");
      const fullImageUrl = isExternalUrl
        ? q.imageUrl
        : q.imageUrl
        ? `${req.protocol}://${req.get("host")}${q.imageUrl}`
        : null;

      return {
        id: q.id,
        question: language === "hi" ? q.question_hi : q.question_en,
        difficulty: q.difficulty,
        imageUrl: fullImageUrl,
        options: q.options.map((opt) => ({
          id: opt.id,
          label: opt.label,
          text: language === "hi" ? opt.text_hi : opt.text_en,
        })),
      };
    });

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
