import { Plus } from "../../../svg";
import styles from "./Stories.module.css";
import { stories } from "../../../data/home";
import Story from "./Story";
import Card from "../../UI/Card/Card";
import { ScrollContainer } from "react-indiana-drag-scroll";
import { useSelector } from "react-redux";
import React, { useState, useRef } from 'react';
import VideoModal from './VideoModal';

function Stories() {
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const scrollContainerRef = useRef();

  const handleStoryClick = (video) => {
    setCurrentVideo(video);
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const scrollStories = (direction) => {
    if (direction === 'right') {
      scrollContainerRef.current.scrollLeft += 100;
    } else {
      scrollContainerRef.current.scrollLeft -= 100;
    }
  }

  return (
    <Card className={styles.wrap}>
      <div style={{ position: 'relative' }}>
        <ScrollContainer ref={scrollContainerRef} className={styles.stories}>
          <div className={styles.create_story_card}>
            <img secure
              src={user?.photo ? user.photo : "../../../images/default_pic.png"}
              alt=""
              className={styles.create_story_img}
            />
            <div className={styles.plus_story}>
              <Plus color="#fff" />
            </div>
            <div className={styles.story_create_text}><strong>Create Story</strong></div>
          </div>
          {stories.map((story, i) => (
            <div key={i} onClick={() => handleStoryClick(story.video)}>
              <Story story={story} />
            </div>
          ))}
        </ScrollContainer>
        <button
          style={{
            position: 'absolute',
            right: '10px',
            top: 'calc(50% - 15px)',
            width: '30px',
            height: '30px',
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2em',
            zIndex: '1'
          }}
          onClick={() => scrollStories('right')}
        >
          ➡
        </button>
      </div>
      <VideoModal isOpen={modalOpen} close={closeModal} videoURL={currentVideo} />
    </Card>
  );
}

export default Stories;
