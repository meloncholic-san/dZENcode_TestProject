

import { useEffect, useState } from 'react';
import { api } from '../../redux/index.js'
import styles from './Captcha.module.css';


export function Captcha({ onChange, refreshKey, value }) {
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');

  const fetchCaptcha = async () => {
    try {
      const res = await api.get('/api/captcha');
      setCaptchaSvg(res.data.svg);
      setCaptchaToken(res.data.captchaToken);
      onChange(res.data.captchaToken, '');
    } catch (error) {
      console.error('CAPTCHA fetch error', error);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, [refreshKey]);

    return (
    <div className={styles.container}>
      {captchaSvg ? (
        <div
          className={styles.captchaImage}
          onClick={fetchCaptcha}
          dangerouslySetInnerHTML={{ __html: captchaSvg }}
        />
      ) : (
        <p>Loading CAPTCHA...</p>
      )}

      <input
        type="text"
        className={styles.input}
        placeholder="Enter CAPTCHA"
        value={value}
        onChange={(e) => onChange(captchaToken, e.target.value)}
        required
      />
      <p className={styles.hint}>Click CAPTCHA to refresh</p>
    </div>
  );
}