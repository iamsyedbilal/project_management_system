import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, filename);
  },
});

export const uploadTaskAttachments = multer({
  storage,
}).array('attachments');
