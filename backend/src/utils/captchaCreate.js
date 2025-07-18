import svgCaptcha from 'svg-captcha';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';

export function generateCaptcha(req, res) {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 3,
    ignoreChars: '0o1iIlL',
    color: true,
    background: '#ccf'
  });

  const token = jwt.sign(
    { captchaText: captcha.text },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' }
  );

  res.json({
    svg: captcha.data,
    captchaToken: token
  });
}
