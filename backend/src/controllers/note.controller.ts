import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import type { Request, Response } from 'express';
import {
  createNoteService,
  deleteNoteService,
  getNoteByIdService,
  listProjectNotesService,
  updateNoteService,
} from '../services/note.service.js';
import {
  createNoteValidator,
  updateNoteValidator,
} from '../validators/note.validator.js';

export const listProjectNotes = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (typeof projectId !== 'string' || !projectId) {
      throw new ApiError(400, 'Invalid project ID');
    }

    const notes = await listProjectNotesService(projectId);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Notes fetched successfully', notes));
  },
);

export const createNote = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (typeof projectId !== 'string' || !projectId) {
      throw new ApiError(400, 'Invalid project ID');
    }

    if (!req.user?._id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const result = createNoteValidator.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        result.error.issues[0]?.message ?? 'Invalid request data',
      );
    }

    const note = await createNoteService(
      projectId,
      req.user._id.toString(),
      result.data,
    );

    return res
      .status(201)
      .json(new ApiResponse(201, 'Note created successfully', note));
  },
);

export const getNoteById = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId, noteId } = req.params;

    if (typeof projectId !== 'string' || !projectId) {
      throw new ApiError(400, 'Invalid project ID');
    }

    if (typeof noteId !== 'string' || !noteId) {
      throw new ApiError(400, 'Invalid note ID');
    }

    const note = await getNoteByIdService(projectId, noteId);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Note fetched successfully', note));
  },
);

export const updateNote = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId, noteId } = req.params;

    if (typeof projectId !== 'string' || !projectId) {
      throw new ApiError(400, 'Invalid project ID');
    }

    if (typeof noteId !== 'string' || !noteId) {
      throw new ApiError(400, 'Invalid note ID');
    }

    const result = updateNoteValidator.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        result.error.issues[0]?.message ?? 'Invalid request data',
      );
    }

    const note = await updateNoteService(projectId, noteId, result.data);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Note updated successfully', note));
  },
);

export const deleteNote = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId, noteId } = req.params;

    if (typeof projectId !== 'string' || !projectId) {
      throw new ApiError(400, 'Invalid project ID');
    }

    if (typeof noteId !== 'string' || !noteId) {
      throw new ApiError(400, 'Invalid note ID');
    }

    await deleteNoteService(projectId, noteId);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Note deleted successfully', null));
  },
);
