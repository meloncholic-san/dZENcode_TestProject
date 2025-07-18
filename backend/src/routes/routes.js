import { Router } from "express";
import authRoutes from "./auth.js"
import messageRoutes from "./message.js"
import captchaRoutes from './captcha.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/message', messageRoutes);
router.use('/captcha', captchaRoutes);

export default router;

