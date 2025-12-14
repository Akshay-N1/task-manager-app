import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Trash2, CheckCircle, Circle, Plus } from 'lucide-react'; 
import api from '../api/axios';
import Spinner from '../components/Spinner';

// 1. Define what a Task looks like
interface Task {
  id: string;
  title: string;
  status: 'TODO' | 'DONE';
}

// 2. Define the Form inputs
interface NewTaskForm {
  title: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const [user, setUser] = useState<{ name: string } | null>(null);
  
  // Setup the form for adding tasks
  const { register, handleSubmit, reset } = useForm<NewTaskForm>();

  // 3. Load Data on Startup
  useEffect(() => {
    fetchTasks();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    // We can just use the token to get user info if we had a /me endpoint
    // For now, we will just grab the name from local storage if you saved it, 
    // or just show "User"
    setUser({ name: "User" }); 
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true); // Start loading
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false); // Stop loading (whether success or fail)
    }
  };

  // 4. Create a Task
  const onCreateTask = async (data: NewTaskForm) => {
    try {
      await api.post('/tasks', { title: data.title });
      reset(); // Clear the form
      fetchTasks(); // Reload the list
    } catch (err) {
      alert("Failed to create task");
    }
  };

  // 5. Delete a Task
  const onDeleteTask = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id)); // Remove from screen instantly
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // 6. Toggle Status (Todo <-> Done)
  const onToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'TODO' ? 'DONE' : 'TODO';
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      fetchTasks(); // Reload to see changes
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
   <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
             <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
             {/* We use the 'user' variable here, so TypeScript is happy! */}
             <p className="text-sm text-gray-500">Welcome, {user?.name || 'User'}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl p-6">
        {/* Input Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add New Task</h2>
          <form onSubmit={handleSubmit(onCreateTask)} className="flex gap-2">
            <input 
              {...register('title', { required: true })}
              placeholder="What needs to be done?"
              className="flex-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
            <button type="submit" className="flex items-center gap-2 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
              <Plus size={18} /> Add
            </button>
          </form>
        </div>

        {/* Task List Section */}
        <div className="space-y-3">

          {/* 1. If Loading, show Spinner */}
          {isLoading ? (
            <div className="py-10">
              <Spinner />
              <p className="mt-2 text-center text-gray-500">Loading your tasks...</p>
            </div>
          ) : (
            /* 2. If Not Loading, show Tasks */
            <>
              {tasks.map(task => (
                <div key={task.id} className={`flex items-center justify-between rounded-lg border p-4 shadow-sm transition hover:shadow-md ${task.status === 'DONE' ? 'bg-gray-50' : 'bg-white'}`}>

                  {/* Left Side: Checkbox & Title */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onToggleStatus(task)} 
                      className={`transition-colors ${task.status === 'DONE' ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
                    >
                      {task.status === 'DONE' ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                    </button>
                    <span className={`text-lg transition-all ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </span>
                  </div>

                  {/* Right Side: Delete Button */}
                  <button 
                    onClick={() => onDeleteTask(task.id)} 
                    className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                    title="Delete Task"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              {/* 3. Empty State (Only if not loading and no tasks) */}
              {!isLoading && tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <div className="rounded-full bg-gray-100 p-4">
                    <CheckCircle size={40} />
                  </div>
                  <p className="mt-4 text-lg font-medium">All caught up!</p>
                  <p className="text-sm">No tasks pending. Add one above.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}