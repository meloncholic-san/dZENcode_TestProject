import express from 'express'

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema} from '../validationSchemes/auth.js';
import { registerUserCtrl, loginUserCtrl, logoutUserCtrl } from '../controllers/auth.js';
import { upload } from '../middlewares/upload.js';


const router = express.Router();
const jsonParser = express.json();


router.post('/register', upload.single('avatar'), jsonParser, validateBody(registerUserSchema), ctrlWrapper(registerUserCtrl));
router.post('/login', jsonParser, validateBody(loginUserSchema), ctrlWrapper(loginUserCtrl));
router.post('/logout', ctrlWrapper(logoutUserCtrl));

export default router;