import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes'; // <--- Make sure this is imported

dotenv.config();

const app = express();

// 1. Enable Security Headers (CORS)
app.use(cors());

// 2. Enable JSON inputs
app.use(express.json());

const PORT = process.env.PORT || 4000;

// 3. Register the Routes
// This tells the server: "If the URL starts with /api/auth, go to authRoutes"
app.use('/api/auth', authRoutes);

// This tells the server: "If the URL starts with /api/tasks, go to taskRoutes"
// *** If this line is missing, you get a 404! ***
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});