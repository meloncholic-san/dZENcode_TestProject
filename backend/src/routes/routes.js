import { Router } from "express";
import authRoutes from "./auth.js"
import messageRoutes from "./message.js"
import captchaRoutes from './captcha.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/message', messageRoutes);
router.use('/captcha', captchaRoutes);

export default router;










// import { Reaction } from "../db/models/Reaction.js";
// import { Message } from "../db/models/Message.js";

// router.delete('/test/clear-messages', async (req, res, next) => {
//   try {
//     await Reaction.destroy({ where: {} });
//     const deletedCount = await Message.destroy({ where: {} }); 
//     res.json({ message: 'All messages deleted', count: deletedCount });
//   } catch (err) {
//     next(err);
//   }
// });