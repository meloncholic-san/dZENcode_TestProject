import express from 'express';
import { createMessageCtrl, getMessagesCtrl } from '../controllers/message.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { validateUploadedFile } from '../middlewares/validateUploadedFile.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createMessageSchema } from '../validationSchemes/message.js';
import { optionalAuth } from '../middlewares/optionalAuth.js';
import { verifyCaptcha } from '../middlewares/verifyCaptcha.js';
const router = express.Router();
const jsonParser = express.json();


router.get('/', ctrlWrapper(getMessagesCtrl));
router.post('/', optionalAuth, upload.single('file'), jsonParser, validateUploadedFile, verifyCaptcha, validateBody(createMessageSchema), ctrlWrapper(createMessageCtrl));

export default router;