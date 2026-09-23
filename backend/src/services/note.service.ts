import mongoose from 'mongoose';
import Note from '../models/note.model.js';
import Project from '../models/project.model.js';
import ApiError from '../utils/apiError.js';
import type {
  CreateNoteInput,
  UpdateNoteInput,
} from '../validators/note.validator.js';

const getObjectId = (id: string, fieldName: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }

  return new mongoose.Types.ObjectId(id);
};

const ensureProjectExists = async (projectId: string) => {
  const projectObjectId = getObjectId(projectId, 'project ID');

  const projectExists = await Project.exists({ _id: projectObjectId });

  if (!projectExists) {
    throw new ApiError(404, 'Project not found');
  }

  return projectObjectId;
};

export const listProjectNotesService = async (projectId: string) => {
  const projectObjectId = await ensureProjectExists(projectId);

  return Note.find({ project: projectObjectId })
    .select('-_id project title content createdBy createdAt updatedAt')
    .populate('createdBy', 'username email fullName avatar')
    .sort({ createdAt: -1 })
    .lean();
};

export const createNoteService = async (
  projectId: string,
  createdBy: string,
  data: CreateNoteInput,
) => {
  const projectObjectId = await ensureProjectExists(projectId);
  const userObjectId = getObjectId(createdBy, 'user ID');

  const note = await Note.create({
    project: projectObjectId,
    title: data.title,
    content: data.content,
    createdBy: userObjectId,
  });

  return Note.findById(note._id)
    .select('-_id project title content createdBy createdAt updatedAt')
    .populate('createdBy', 'username email fullName avatar')
    .lean();
};

export const getNoteByIdService = async (
  projectId: string,
  noteId: string,
) => {
  const projectObjectId = await ensureProjectExists(projectId);
  const noteObjectId = getObjectId(noteId, 'note ID');

  const note = await Note.findOne({
    _id: noteObjectId,
    project: projectObjectId,
  })
    .select('-_id project title content createdBy createdAt updatedAt')
    .populate('createdBy', 'username email fullName avatar')
    .lean();

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  return note;
};

export const updateNoteService = async (
  projectId: string,
  noteId: string,
  data: UpdateNoteInput,
) => {
  const projectObjectId = await ensureProjectExists(projectId);
  const noteObjectId = getObjectId(noteId, 'note ID');

  const updatedNote = await Note.findOneAndUpdate(
    {
      _id: noteObjectId,
      project: projectObjectId,
    },
    { $set: data },
    { new: true, runValidators: true },
  )
    .select('-_id project title content createdBy createdAt updatedAt')
    .populate('createdBy', 'username email fullName avatar')
    .lean();

  if (!updatedNote) {
    throw new ApiError(404, 'Note not found');
  }

  return updatedNote;
};

export const deleteNoteService = async (
  projectId: string,
  noteId: string,
) => {
  const projectObjectId = await ensureProjectExists(projectId);
  const noteObjectId = getObjectId(noteId, 'note ID');

  const deletedNote = await Note.findOneAndDelete({
    _id: noteObjectId,
    project: projectObjectId,
  });

  if (!deletedNote) {
    throw new ApiError(404, 'Note not found');
  }
};
