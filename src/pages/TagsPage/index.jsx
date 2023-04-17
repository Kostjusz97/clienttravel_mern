import React from 'react';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { Post } from '../../components/Post';
import { fetchPosts } from '../../redux/slices/posts';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

const userDataSelector = state => state.auth.data;
const postSelector = state => state.post;

export const TagsPage = () => {
  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);
  const { name } = useParams(); 
  const { posts }= useSelector(postSelector);
  const isPostLoading = posts.status === 'loading';
  
  React.useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const filteredPosts = posts?.items?.filter(el => el.tags.includes(name));
  const sortedPosts = filteredPosts.sort((a, b) => b.viewsCount - a.viewsCount);

  return (
    <Grid container spacing={2}>
    <Grid item xs={12}>
        <Typography variant="h4" component="h1">
          #{name} 
        </Typography>
      </Grid>
    <Grid xs={8} item>
      {(isPostLoading ? [...Array(5)] : sortedPosts).map((obj, index) => isPostLoading ? <Post key={index} isLoading={true} /> : (
        <Post
          key={obj._id}
          _id={obj._id}
          title={obj.title}
          imageUrl={obj.imageUrl ? `process.env.REACT_APP_API_URL${obj.imageUrl}`: ''}
          user={obj.user}
          createdAt={moment(obj.createdAt).format('YYYY-MM-DD HH:mm')}
          viewsCount={obj.viewsCount}
          commentsCount={3}
          tags={obj.tags}
          isEditable={userData?._id === obj.user._id} 
        />
      ))}
    </Grid>
    </Grid>
  );
};
