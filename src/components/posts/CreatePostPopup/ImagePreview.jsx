import React, { useRef } from "react";
import styles from "./ImagePreview.module.css";
import { useDispatch } from "react-redux";
import {
  addimages,
  addvideo,
  removeImage,
  removeVideo,
  type,
} from "../../../app/slices/createPostSlice";

function ImagePreview({ images, video }) {
  const dispatch = useDispatch();
  const imgNum = images.length;
  const media = [...images, ...video];
  const isUploadingVideo = video.length > 0; // This will be true if a video is being uploaded

  const imageInputRef = useRef(null);
  const handleImages = (e) => {
    let files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("You can only upload five images");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (readerEvent) => {
        if (file.type.startsWith("image")) {
          dispatch(addimages(readerEvent.target.result));
        } else if (file.type.startsWith("video")) {
          dispatch(addvideo(readerEvent.target.result));
        }
      };
    });
  };

  const handleRemove = (mediaItem) => {
    if (images.includes(mediaItem)) {
      dispatch(removeImage(mediaItem));
    } else if (video.includes(mediaItem)) {
      dispatch(removeVideo(mediaItem));
    }
  };
  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/*"
        multiple
        hidden
        ref={imageInputRef}
        onChange={handleImages}
      />
      <div className={styles.wrap}>
        {media.length > 0 ? (
          <div className={`${styles.add} ${styles.images}`}>
            <div
              className={`${styles.exit} small_white_circle`}
              onClick={() => dispatch(type("normal"))}
            >
              <i className="exit_icon"></i>
            </div>
            <div className={styles.preview_actions}>
              {images.length > 0 && (
                <button
                  className="hover1"
                  onClick={() => {
                    imageInputRef.current.click();
                  }}
                >
                  <i className="addPhoto_icon"></i>
                  Add more photos
                </button>
              )}
            </div>

            <div
              className={`${styles.images_wrap} ${
                imgNum === 2
                  ? styles.per2
                  : imgNum === 3
                  ? styles.per3
                  : imgNum === 4
                  ? styles.per4
                  : imgNum === 5
                  ? styles.per5
                  : ""
              }`}
            >
              {media.map((mediaItem, i) => {
                if (images.includes(mediaItem)) {
                  return <img secure src={mediaItem} alt={i} key={i} />;
                } else if (video.includes(mediaItem)) {
                  return (
                    <div key={i}>
                      <video
                        secure
                        src={mediaItem}
                        alt={i}
                        key={i}
                        controls
                        width="100%"
                        height="auto"
                      />
                      <button
                        className={`${styles.exit} small_white_circle`}
                        onClick={() => handleRemove(mediaItem)}
                      >
                        {" "}
                        <i className="exit_icon"></i>
                      </button>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ) : (
          <div className={styles.add}>
            <div
              className={`${styles.exit} small_white_circle`}
              onClick={() => dispatch(type("normal"))}
            >
              <i className="exit_icon"></i>
            </div>
            <div
              className={styles.add_col}
              onClick={() => {
                imageInputRef.current.click();
              }}
            >
              <div className="small_circle hover1">
                <i className="addPhoto_icon"></i>
              </div>
              <span>Add Photos/Videos</span>
              <span>or drag and drop</span>
            </div>
          </div>
        )}
        {!isUploadingVideo && ( // Conditionally render the mobile upload section based on whether a video is being uploaded
          <div className={styles.add_bottom}>
            <div className={styles.left}>
              <div className="small_circle">
                <i className="phone_icon"></i>
              </div>
              <span>Add photos from your mobile device</span>
            </div>
            <span
              className="gray_btn"
              onClick={() => {
                imageInputRef.current.click();
              }}
            >
              Add
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImagePreview;
