import express from 'express';
import { deleteUser, dislikeVideo, getSubscribedChannels, getUser, likeVideo, subscribeUser, unsubscribeUser, updateUser } from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.put("/:id", auth, updateUser);  // update user
router.delete("/:id", auth, deleteUser);   // delete user
router.get("/find/:id", auth, getUser);     // get a user
router.put("/sub/:id", auth, subscribeUser);     // subscribe a user
router.put("/unsub/:id", auth, unsubscribeUser);     // unsubscribe a user
router.put("/like/:videoId", auth, likeVideo);     // like a video
router.put("/dislike/:videoId", auth, dislikeVideo);    // dislike a video
router.get("/subscribedChannels", auth, getSubscribedChannels)  // get subscribed channels

export default router;