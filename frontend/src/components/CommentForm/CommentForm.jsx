import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addComment, fetchComments } from '../../redux/messages/operations';
import { selectUser, selectIsLoggedIn } from '../../redux/auth/selectors';
import { Captcha } from '../Captcha/Captcha';
import styles from './CommentForm.module.css';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';


export default function CommentForm({ parentId = null }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const [captchaToken, setCaptchaToken] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [filePreview, setFilePreview] = useState(null);

  const allowedTags = ['a', 'code', 'i', 'strong'];

  const initialValues = {
    userName: isLoggedIn ? user.name : 'anonymous',
    email: isLoggedIn ? user.email : 'anonymous@mail.com',
    homepage: '',
    captcha: '',
    text: '',
  
  };


  const isHtmlValid = (value) => {
    if (!value) return false;

    const tagPattern = /<\/?([a-z]+)(\s[^>]*)?>/gi;
    const stack = [];
    let match;

    while ((match = tagPattern.exec(value))) {
      const tag = match[1].toLowerCase();

      if (!allowedTags.includes(tag)) {
        return false;
      }
      if (match[0][1] === '/') {
        if (stack.length === 0 || stack.pop() !== tag) {
          return false;
        }
      } else {
        stack.push(tag);
      }
    }
    return stack.length === 0;
  };

  const validationSchema = Yup.object({
    userName: Yup.string()
      .matches(/^[a-zA-Z0-9 ]+$/, 'Only latin letters and digits allowed')
      .required('User Name is required'),
    email: Yup.string()
      .email('Valid email is required')
      .required('Email is required'),
    homepage: Yup.string().url('Homepage must be a valid URL').nullable(),
    captcha: Yup.string().required('CAPTCHA is required'),
    text: Yup.string()
      .required('Message is required')
      .test('valid-html', 'Only allowed HTML tags (<strong>, <i>, <a>, <code>) are allowed and must be properly closed.', isHtmlValid),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        parentId: typeof parentId === 'number' && parentId > 0 ? parentId : null,
        userName: values.userName,
        email: values.email,
        homepage: values.homepage || '',
        text: values.text,
        captchaText: values.captcha,
        captchaToken: captchaToken,
        file,
      };

      try {
        await dispatch(addComment(payload)).unwrap();
        toast.success('Comment sent successfully!');
        setCaptchaRefreshKey((prev) => prev + 1);
        setCaptchaToken('');
        setFile(null);
        fileInputRef.current.value = '';
        resetForm();
      } catch (error) {
        if (error?.status === 403) {
          toast.error('Invalid CAPTCHA. Please try again.');
        } else if (error?.status === 400) {
          toast.warn('Validation error. Please check the fields.');
        }
      }
    },
  });

  


const wrapTextWithTag = (tag, attrs = '') => {
  const textarea = document.getElementById('text');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.substring(start, end);
  const before = value.substring(0, start);
  const after = value.substring(end);
  const tagOpen = attrs ? `<${tag} ${attrs}>` : `<${tag}>`;
  const tagClose = `</${tag}>`;

  const newValue = `${before}${tagOpen}${selected}${tagClose}${after}`;
  formik.setFieldValue('text', newValue);
};


  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      {/* User Name */}
      <div className={styles.field}>
        <label htmlFor="userName" className={styles.label}>User Name</label>
        <input
          id="userName"
          name="userName"
          type="text"
          className={styles.input}
          value={formik.values.userName}
          disabled
        />
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className={styles.input}
          value={formik.values.email}
          disabled
        />
      </div>

      {/* Homepage */}
      <div className={styles.field}>
        <label htmlFor="homepage" className={styles.label}>Homepage</label>
        <input
          id="homepage"
          name="homepage"
          type="url"
          className={styles.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.homepage}
        />
        {formik.touched.homepage && formik.errors.homepage && (
          <div className={styles.error}>{formik.errors.homepage}</div>
        )}
      </div>
        

      {/* Text */}
      <div className={styles.field}>
        <label htmlFor="text" className={styles.label}>Comment</label>
        
        <div className={styles.formatting}>
            <button type="button" onClick={() => wrapTextWithTag('strong')}>[strong]</button>
            <button type="button" onClick={() => wrapTextWithTag('i')}>[i]</button>
            <button type="button" onClick={() => wrapTextWithTag('code')}>[code]</button>
            <button type="button" onClick={() => wrapTextWithTag('a', 'href="" title=""')}>[a]</button>
        </div>
        <textarea
          id="text"
          name="text"
          className={styles.textarea}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.text}
        />
        {formik.touched.text && formik.errors.text && (
          <div className={styles.error}>{formik.errors.text}</div>
        )}
      </div>

      {formik.values.text&&<div className={styles.preview}>
      <div
        className={styles.htmlPreview}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(formik.values.text, { ALLOWED_TAGS: allowedTags }),
        }}
      />

    </div>}

      {/* File */}
      <div className={styles.field}>
        <label htmlFor="file" className={styles.label}>Attach file</label>
        <input
          id="file"
          name="file"
          type="file"
          className={styles.input}
          accept=".jpg,.jpeg,.png,.pdf,.txt"
          ref={fileInputRef}
          onChange={(e) => {
            const selectedFile = e.currentTarget.files[0];
            formik.setFieldValue('file', selectedFile);
            setFile(selectedFile);

            if (selectedFile) {
              if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => setFilePreview({ type: 'image', content: reader.result });
                reader.readAsDataURL(selectedFile);
              } 
            } else {
              setFilePreview(null);
            }
          }}
        />
      </div>
      
      {filePreview && (
        <div className={styles.preview}>
          {filePreview.type === 'image' && (
            <img src={filePreview.content} alt="Preview" className={styles.imagePreview} />
            )}
            {filePreview.type === 'text' && (
            <pre className={styles.textPreview}>{filePreview.content}</pre>
            )}
            {filePreview.type === 'other' && (
            <p className={styles.fileName}>Attached: {filePreview.name}</p>
          )}
        </div>
      )}

      {/* CAPTCHA */}
      <div className={`${styles.field} ${styles.captcha}`}>
        <label htmlFor="captcha" className={styles.label}>CAPTCHA</label>
        <Captcha
          refreshKey={captchaRefreshKey}
          value={formik.values.captcha}
          onChange={(token, inputValue) => {
            setCaptchaToken(token);
            formik.setFieldValue('captcha', inputValue);
          }}
        />
        {formik.touched.captcha && formik.errors.captcha && (
          <div className={styles.error}>{formik.errors.captcha}</div>
        )}
      </div>

      {/* Submit */}
      <button type="submit" className={styles.button}>
        Send Comment
      </button>
    </form>
  );
}
