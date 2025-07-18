import express from 'express';
import { generateCaptcha } from '../utils/captchaCreate.js'

const router = express.Router();

router.get('/', generateCaptcha);

export default router;