import React from 'react';
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import moment from 'moment';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from '../axios';

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  
  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data)
      setLoading(false)
    })
    .catch(err => {
      console.warn(err);
      alert('Error getting article');
  });
  },[id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  };

  return (
    <>
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ?`process.env.REACT_APP_API_URL${data.imageUrl}` : ''}
        user={data.user}
        createdAt={moment(data.createdAt).format('YYYY-MM-DD HH:mm')}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text}  />
      </Post>
      {/* <CommentsBlock
        items={[
          {
            user: {
              fullName: "John White",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Test Comment",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock> */}
    </>
  );
};
