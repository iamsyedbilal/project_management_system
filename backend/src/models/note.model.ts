import mongoose from 'mongoose';

export interface INote extends mongoose.Document {
  project: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Note title is required'],
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Note content is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Note creator is required'],
    },
  },
  { timestamps: true },
);

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;
