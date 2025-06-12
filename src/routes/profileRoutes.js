import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// Protected routes for user profile management
router.route("/me").get(protect, getMyProfile).put(protect, updateMyProfile);

// Profile picture placeholder route
// router.post('/me/avatar', protect, upload.single('avatar'), uploadAvatarController);

export default router;
