import { Router } from "express";
import authRoutes from "./auth.js"
import messageRoutes from "./message.js"

const router = Router();

router.use('/auth', authRoutes);
router.use('/message', messageRoutes);
export default router;

