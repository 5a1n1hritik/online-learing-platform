import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createExamPaper = async (req, res) => {
  const { title } = req.body;

  try {
    const examPaper = await prisma.examPaper.create({
      data: {
        title,
      },
    });
    res.status(201).json({
      success: true,
      message: "Exam paper created successfully",
      examPaper,
    });
  } catch (error) {
    console.error("Error creating exam paper:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create exam paper",
    });
  }
};

export const addQuestionToPaper = async (req, res) => {
  const { paperId } = req.params;
  const { questionId, order } = req.body;

  try {
    const questionData = await prisma.examPaperQuestion.create({
      data: {
        paperId: parseInt(paperId),
        questionId: parseInt(questionId),
        order: parseInt(order) || 0,
      },
    });
    res.status(201).json({
      success: true,
      message: "Question linked to paper successfully",
      questionData,
    });
  } catch (error) {
    console.log("Error linking question to paper:", error);
    res.status(500).json({
      success: false,
      error: "Failed to link question to paper",
      details: error.message,
    });
  }
};
