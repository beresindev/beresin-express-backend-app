import express from "express";
import { authenticateToken } from "../../../middlewares/authMiddleware";
import { addLike, getUserLikesWithService, removeLike } from "../../../controllers/user/likeController";

const router = express.Router();

// Tambahkan like
router.post("/", authenticateToken, addLike);

// Hapus like
router.delete("/", authenticateToken, removeLike);

// Dapatkan semua like user beserta detail service
router.get("/", authenticateToken, getUserLikesWithService);

export default router;
