import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux'

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from './../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags} = useSelector((state) => state.post);
  const [value, setValue] = React.useState(0);

  const isPostLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch])
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const sortedPosts = [...posts.items].sort((a, b) => {
    if (value === 0) {
      return b.viewsCount - a.viewsCount;
    } else {
      return 0;
    }
  });


  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="New" value={0} />
        <Tab label="Popular" value={1} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : sortedPosts).map((obj, index) => isPostLoading ? <Post key={index} isLoading={true} /> : (
            <Post
              _id={obj._id}
              lol={console.log(obj._id)}
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
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          {/* <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'John White',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Test Commennt',
              },
            ]}
            isLoading={false}
          /> */}
        </Grid>
      </Grid>
    </>
  );
};
