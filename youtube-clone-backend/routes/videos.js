import express from 'express';
import { addVideo, updateVideo, deleteVideo, getVideo } from '../controllers/videos.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/", auth, addVideo);
router.put("/:id", auth, updateVideo);
router.delete("/:id", auth, deleteVideo);
router.get("/find/:id", getVideo);

export default router;