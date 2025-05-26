import express from 'express';
import auth from '../middleware/auth.js';
import { addComment, deleteComment, getComments } from '../controllers/comments.js';

const router = express.Router();

router.post("/", auth, addComment);
router.delete("/:id", auth, deleteComment);
router.get("/:videoId", getComments);

export default router;