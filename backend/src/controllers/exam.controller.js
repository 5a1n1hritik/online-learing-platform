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
