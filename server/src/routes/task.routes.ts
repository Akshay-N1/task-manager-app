import { Router } from 'express';
import { create, getAll, update, remove } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect all these routes with "authenticate"
router.use(authenticate);

router.post('/', create);       // Create Task
router.get('/', getAll);        // Get All Tasks
router.put('/:id', update);     // Update Task
router.delete('/:id', remove);  // Delete Task

export default router;
