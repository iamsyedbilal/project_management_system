import express from 'express';
import {
  createNote,
  deleteNote,
  getNoteById,
  listProjectNotes,
  updateNote,
} from '../controllers/note.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  authorizeRoles,
  validateProjectPermission,
} from '../middlewares/role.middleware.js';
import { UserRole } from '../utils/constants.js';

const router = express.Router();

router
  .route('/:projectId')
  .get(verifyJWT, validateProjectPermission(), listProjectNotes)
  .post(
    verifyJWT,
    authorizeRoles([UserRole.ADMIN]),
    validateProjectPermission(),
    createNote,
  );

router
  .route('/:projectId/n/:noteId')
  .get(verifyJWT, validateProjectPermission(), getNoteById)
  .put(
    verifyJWT,
    authorizeRoles([UserRole.ADMIN]),
    validateProjectPermission(),
    updateNote,
  )
  .delete(
    verifyJWT,
    authorizeRoles([UserRole.ADMIN]),
    validateProjectPermission(),
    deleteNote,
  );

export default router;
