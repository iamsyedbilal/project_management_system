import express from 'express';
import {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
} from '../controllers/task.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  validateProjectPermission,
} from '../middlewares/role.middleware.js';
import { uploadTaskAttachments } from '../middlewares/upload.middleware.js';
import { UserRole } from '../utils/constants.js';

const router = express.Router();

router.route('/:projectId').get(verifyJWT, validateProjectPermission(), getTasks);

router
  .route('/:projectId')
  .post(
    verifyJWT,
    validateProjectPermission([UserRole.PROJECT_ADMIN]),
    uploadTaskAttachments,
    createTask,
  );

router
  .route('/:projectId/t/:taskId')
  .get(verifyJWT, validateProjectPermission(), getTaskById);

router
  .route('/:projectId/t/:taskId')
  .put(
    verifyJWT,
    validateProjectPermission([UserRole.PROJECT_ADMIN]),
    updateTask,
  );

router
  .route('/:projectId/t/:taskId')
  .delete(
    verifyJWT,
    validateProjectPermission([UserRole.PROJECT_ADMIN]),
    deleteTask,
  );

router
  .route('/:projectId/t/:taskId/subtasks')
  .post(
    verifyJWT,
    validateProjectPermission([UserRole.PROJECT_ADMIN]),
    createSubTask,
  );

router
  .route('/:projectId/st/:subTaskId')
  .put(verifyJWT, validateProjectPermission(), updateSubTask);

router
  .route('/:projectId/st/:subTaskId')
  .delete(
    verifyJWT,
    validateProjectPermission([UserRole.PROJECT_ADMIN]),
    deleteSubTask,
  );

export default router;
