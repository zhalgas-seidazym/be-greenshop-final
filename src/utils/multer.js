import multer from 'multer'
import path from "path";
import {MediaDir} from "../main/config.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, MediaDir);
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = Date.now() + '-' + path.basename(file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, ''));
        cb(null, sanitizedFilename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

export default upload