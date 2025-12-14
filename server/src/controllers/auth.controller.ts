import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { z } from 'zod';

// 1. Validation Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 2. Register Controller
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data.name, data.email, data.password);
    res.status(201).json(result);
  } catch (error: any) {
    // NUCLEAR FIX: We cast 'error' to 'any' right here to force it to work
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    return res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

// 3. Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};

