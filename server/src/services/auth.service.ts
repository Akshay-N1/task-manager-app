import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (name: string, email: string, password: string) => {
  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // 2. Hash the password (security requirement)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Save to database
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  // 4. Create a Token (So they are logged in immediately)
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  // 1. Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  // 2. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  // 3. Generate Token
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });

  return { user, token };
};