import express from "express";
import auth from '../middleware/auth.js';
import { uploadSign } from "../controllers/upload.js";

const router = express.Router();

router.post('/sign', auth, uploadSign);

export default router;