import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

// Validation Schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password is too short'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/auth/register', data);
      alert('Registration Successful! Please Login.');
      navigate('/login'); // Send them to login page
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Create Account</h2>
        
        {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...register('name')} className="mt-1 w-full rounded border p-2" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...register('email')} className="mt-1 w-full rounded border p-2" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input {...register('password')} type="password" className="mt-1 w-full rounded border p-2" />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700">
            {isSubmitting ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Login here</Link>
        </p>
      </div>
    </div>
  );
}