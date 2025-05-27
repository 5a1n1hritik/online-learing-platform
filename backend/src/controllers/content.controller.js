import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const uploadContent = async (req, res) => {
  try {
    const { title, description, contentType, contentUrl } = req.body;

    if (!title || !description || !contentType || !contentUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        contentType,
        contentUrl,
      },
    });

    return res.status(201).json(newContent);
  } catch (error) {
    console.error("Error uploading content:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
