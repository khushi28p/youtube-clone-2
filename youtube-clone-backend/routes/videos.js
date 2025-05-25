import express from 'express';
import { addVideo, updateVideo, deleteVideo, getVideo, addView, getTrending, getRandom, getSubscribed } from '../controllers/videos.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/", auth, addVideo);
router.put("/:id", auth, updateVideo);
router.delete("/:id", auth, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.get("/trending", getTrending);
router.get("/random", getRandom);
router.get("/sub", auth, getSubscribed);
router.get("/tags", );
router.get("/search",)

export default router;