import CommentForm from '../../components/CommentForm/CommentForm';
import CommentsList from '../../components/CommentsList/CommentsList';
import styles from './MainPage.module.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectWS, subscribeToMessages } from '../../utils/ws';
import { addCommentFromWS } from '../../redux/messages/slice';


export default function MainPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    connectWS();

    subscribeToMessages((newComment) => {
      dispatch(addCommentFromWS(newComment));
    });
  }, [dispatch]);

  return (
    <div className="container">
      <div className={styles.content}>
      <h1>CascadeTalk</h1>
      <CommentForm />
      <CommentsList />
      </div>
    </div>
  );
}
