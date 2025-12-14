import { Request, Response } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../services/task.service';
import { z } from 'zod';

// Schema for creating a task
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

// 1. Create Task
// 1. Create Task (With Debug Logs)
// 1. Create Task
export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const data = taskSchema.parse(req.body);
    const task = await createTask(userId, data.title, data.description);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
// 2. Get All Tasks
export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const tasks = await getTasks(userId);
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Update Task
export const update = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const task = await updateTask(userId, id, req.body);
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 4. Delete Task
export const remove = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    await deleteTask(userId, id);
    res.json({ message: "Task deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};