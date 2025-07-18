import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../../redux/messages/operations';
import {
  selectComments,
  selectCommentsLoading,
  selectCommentsError,
} from '../../redux/messages/selectors';
import CommentsItem from '../CommentsItem/CommentsItem.jsx';
import styles from './CommentsList.module.css';

const PAGE_SIZE = 25;

export default function CommentsList() {
  const dispatch = useDispatch();
  const comments = useSelector(selectComments);
  const isLoading = useSelector(selectCommentsLoading);
  const error = useSelector(selectCommentsError);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  const buildTree = (messages) => {
    const map = new Map();
    const roots = [];

    messages.forEach((msg) => {
      map.set(msg.id, { ...msg, replies: [] });
    });

    map.forEach((msg) => {
      if (msg.parentId) {
        const parent = map.get(msg.parentId);
        if (parent) {
          parent.replies.push(msg);
        } else {
          roots.push(msg);
        }
      } else {
        roots.push(msg);
      }
    });

    return roots;
  };

  const rootComments = useMemo(() => {
    return comments.filter((c) => !c.parentId);
  }, [comments]);

  const sortedComments = useMemo(() => {
    const sorted = [...rootComments].sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (sortBy === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(fieldA) - new Date(fieldB)
          : new Date(fieldB) - new Date(fieldA);
      }

      return sortOrder === 'asc'
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

    return sorted;
  }, [rootComments, sortBy, sortOrder]);

  const paginatedComments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedComments.slice(start, start + PAGE_SIZE);
  }, [sortedComments, page]);

  const tree = useMemo(() => buildTree(comments), [comments]);

  const getTreeItemById = (id) => tree.find((m) => m.id === id);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const totalPages = Math.ceil(rootComments.length / PAGE_SIZE);

  if (isLoading) return <p>Loading comments...</p>;
  if (!comments.length) return <p>No comments yet.</p>;

  return (

      <div className={styles.commentsList}>
        <h2 className={styles.header}>Comment section</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                <span className={styles.header}>
                  User Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </span>
              </th>
              <th onClick={() => handleSort('email')}>
                <span className={styles.header}>
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
                </span>
              </th>
              <th onClick={() => handleSort('createdAt')}>
                <span className={styles.header}>
                  Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedComments.map((root) => (
              <tr key={root.id}>
                <td colSpan={3}>
                  <CommentsItem message={getTreeItemById(root.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            ← Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      </div>

  );
}
