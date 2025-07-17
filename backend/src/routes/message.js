import express from 'express';
import { createMessageCtrl, getMessagesCtrl } from '../controllers/message.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { validateUploadedFile } from '../middlewares/validateUploadedFile.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createMessageSchema } from '../validationSchemes/message.js';
const router = express.Router();

router.get('/', ctrlWrapper(getMessagesCtrl));
router.post('/', auth, upload.single('file'), validateUploadedFile, validateBody(createMessageSchema), ctrlWrapper(createMessageCtrl));

export default router;