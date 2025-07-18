


import { useState } from 'react';
import CommentForm from '../CommentForm/CommentForm';
import styles from './CommentsItem.module.css';
import DOMPurify from 'dompurify';
import ImageWithLightbox from '../ImageWithLightBox/ImageWithLightBox';


export default function CommentsItem({ message }) {
  const [isReplying, setIsReplying] = useState(false);

  const author = message.author || {};
  const avatarUrl = author.avatarUrl || '/img/anonim_avatar.jpg';
  const displayName = author.name || message.name;

  const allowedTags = ['a', 'strong', 'i', 'code'];
  const cleanText = DOMPurify.sanitize(message.text, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ['href', 'title', 'target'],
  });

  return (
    <div className={styles.message} style={{ marginLeft: message.parentId ? 20 : 0 }}>
      <div className={styles.header}>
        <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
        <div>
          <span className={styles.name}>{displayName}</span>{' '}
          (<span className={styles.email}>{message.email}</span>)
        </div>
      </div>

      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: cleanText }}
      />

      {message.fileUrl && (
        <div className={styles.attachment}>
          {message.fileType === 'image' ? (
            <ImageWithLightbox src={message.fileUrl} alt="Attachment" />
          ) : (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fileLink}
            >
              View attached file
            </a>
          )}
        </div>
      )}

      <div className={styles.replyButton}>
        <button onClick={() => setIsReplying(!isReplying)}>
          {isReplying ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {isReplying && (
        <div className={styles.replyForm}>
          <CommentForm parentId={message.id} />
        </div>
      )}

      {message.replies && message.replies.length > 0 && (
        <div className={styles.replies}>
          {message.replies.map((reply) => (
            <CommentsItem key={reply.id} message={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
