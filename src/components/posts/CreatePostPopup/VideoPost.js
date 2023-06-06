import React from 'react';
import ReactPlayer from 'react-player';

const VideoPost = ({ src }) => {
  return (
    <ReactPlayer url={src} controls={true} width='100%' height='100%' />
  );
}

export default VideoPost;
