import express, { Response, Request } from "express";
import cors from "cors";
import prisma from "./db.js";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(cors());

// Validation schemas
const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).default([])
});

const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  tags: z.array(z.string()).optional()
});

// Get all notes
app.get("/notes", async (_, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Create a new note
app.post("/notes", async (req, res) => {
  try {
    const validatedData = createNoteSchema.parse(req.body);
    
    const note = await prisma.note.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        tags: validatedData.tags
      }
    });
    
    res.status(201).json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
        res.status(400).json({ 
            error: "Validation error", 
            details: error.errors 
        });
        return
    }
    console.error('Error creating note:', error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Update a note
app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const validatedData = updateNoteSchema.parse(req.body);
    
    const note = await prisma.note.update({
      where: { id },
      data: validatedData
    });
    
    res.status(200).json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
        res.status(400).json({ 
            error: "Validation error", 
            details: error.errors 
        });
        return
    }
    console.error('Error updating note:', error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete a note
app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.note.delete({
      where: { id }
    });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// Get all unique tags
app.get("/tags", async (_, res) => {
  try {
    const notes = await prisma.note.findMany({
      select: {
        tags: true
      }
    });
    
    const allTags = notes.flatMap(note => note.tags);
    const uniqueTags = [...new Set(allTags)].sort();
    
    res.status(200).json(uniqueTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Notes API Server is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});