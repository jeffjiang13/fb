import React from "react";
import styles from "./VideoModal.module.css";
import { Portal } from "@material-ui/core";

function VideoModal({ isOpen, close, videoURL }) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className={`${styles.modal} blur`}>
        <button
          className={`${styles.closeButton} small_circle`}
          onClick={close}
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 9 10"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.35299 0.792837L4.49961 3.93944L7.64545 0.792566C7.8407 0.597249 8.15733 0.597223 8.35262 0.792508L8.70669 1.14658C8.90195 1.34184 8.90195 1.65842 8.70669 1.85368L5.56027 5.0001L8.70672 8.14655C8.90198 8.34181 8.90198 8.65839 8.70672 8.85366L8.35316 9.20721C8.1579 9.40247 7.84132 9.40247 7.64606 9.20721L4.49961 6.06076L1.35319 9.20719C1.15793 9.40245 0.841345 9.40245 0.646083 9.20719L0.292629 8.85373C0.0973708 8.65847 0.0973653 8.3419 0.292617 8.14664L3.43895 5.0001L0.292432 1.85357C0.0972034 1.65834 0.0971656 1.34182 0.292347 1.14655L0.645801 0.792924C0.841049 0.597582 1.1577 0.597543 1.35299 0.792837Z"></path>
          </svg>
        </button>{" "}
        <video className={styles.video} controls autoPlay>
          <source src={videoURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </Portal>
  );
}

export default VideoModal;
