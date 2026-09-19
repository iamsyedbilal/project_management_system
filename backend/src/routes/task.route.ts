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
  authorizeRoles,
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
    authorizeRoles([UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
    validateProjectPermission(),
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
    authorizeRoles([UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
    validateProjectPermission(),
    updateTask,
  );

router
  .route('/:projectId/t/:taskId')
  .delete(
    verifyJWT,
    authorizeRoles([UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
    validateProjectPermission(),
    deleteTask,
  );

router
  .route('/:projectId/t/:taskId/subtasks')
  .post(
    verifyJWT,
    authorizeRoles([UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
    validateProjectPermission(),
    createSubTask,
  );

router
  .route('/:projectId/st/:subTaskId')
  .put(verifyJWT, validateProjectPermission(), updateSubTask);

router
  .route('/:projectId/st/:subTaskId')
  .delete(
    verifyJWT,
    authorizeRoles([UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
    validateProjectPermission(),
    deleteSubTask,
  );

export default router;
