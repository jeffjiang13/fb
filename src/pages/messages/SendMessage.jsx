import React, { useState, useRef, useEffect } from "react";
import { useSendMessage } from "../../hooks/useSendMessage";
import { Like, Photo, Send, Smile } from "../../svg";
import isRTL from "../../utils/isRTL";
import styles from "./messages.module.css";
import { socket } from "../../routes/IsLoggedIn";
import EmojiPicker from "emoji-picker-react";
import classes from "../../components/posts/post/comments/CreateComment.module.css";
function SendMessage({
  chat,
  chatId,
  setIsTyping,
  isTyping,
  chatTheme,
  scrollToBottom,
}) {
  const messageRef = useRef();
  const imgInput = useRef(null);
  const [messageImage, setMessageImage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [delayHandler, setDelayHandler] = useState(null);
  const isSend = messageText.length > 0 || messageImage;
  const [cursorPosition, setCursorPosition] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onEmojiClick = ({ event, emoji }) => {
    const ref = messageRef.current;
    ref.focus();
    const start = messageText.substring(0, ref.selectionStart);
    const end = messageText.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setMessageText(newText);
    setCursorPosition(start.length + emoji.length);
  };

  const handleImage = (e) => {
    let file = e.target.files[0];

    if (!file) {
      return;
    }

    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setMessageImage(event.target.result);
    };
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendHandler();
    }
  };

  const { mutate: sendMessage, isSuccess: isMessageSuccess } =
    useSendMessage(chat);

  const sendHandler = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (isSend) {
      let form = new FormData();
      if (messageImage) {
        setIsLoading(true); // Set loading state to true when form is being sent
        let response = await fetch(messageImage);
        let blob = await response.blob();
        form.append("image", blob);
        setIsLoading(false); // Set loading state to false when the image has been fully processed
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

      sendMessage({
        form,
        content: messageText || "",
        type: messageImage ? "image" : "text",
        chatId,
      });
      socket.emit("typing", { room: chatId, status: false });
      setIsTyping(false);
      setMessageText("");
      setMessageImage("");
    } else {
      sendMessage({ content: "like", type: "like", chatId });
    }
  };

  const typingHandler = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { room: chatId, status: true });
    }
    clearTimeout(delayHandler);
    setDelayHandler(
      setTimeout(() => {
        socket.emit("typing", { room: chatId, status: false });
        setIsTyping(false);
      }, 3000)
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [isMessageSuccess]);
  const handleRemoveImage = () => {
    setMessageImage("");
  };

  return (
    <div className={styles.send}>
      <form onSubmit={sendHandler} onClick={() => imgInput.current.click()}>
        <Photo
          color={
            chatTheme?.type === "gradient"
              ? chatTheme?.downColor
              : chatTheme?.color
          }
        />
        <input
          type="file"
          hidden
          ref={imgInput}
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImage}
        />
      </form>
      <div
        className={styles.send_message_button}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <Smile
          color={
            chatTheme?.type === "gradient"
              ? chatTheme?.downColor
              : chatTheme?.color
          }
        />
      </div>
      {showEmojiPicker ? (
        <div className={styles.emoji_picker}>
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            native
          />
        </div>
      ) : null}
      {messageImage && !isLoading && (
        <div
          className={classes.exit}
          style={{
            position: "relative",
            width: "100px",
            display: "inline-block",
          }}
        >
          <button
            onClick={handleRemoveImage}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            {" "}
            <i className="exit_icon"></i>
          </button>
          <img
            src={messageImage}
            alt="Preview"
            style={{ maxWidth: "100px", height: "auto" }}
          />
        </div>
      )}
      <div className={styles.send_message_wrap}>
        <textarea
          style={{
            direction: `${isRTL(messageText) ? "rtl" : "ltr"}`,
          }}
          value={messageText}
          ref={messageRef}
          onChange={(e) => {
            typingHandler();
            setMessageText(e.target.value);
          }}
          className={styles.send_message}
          type="text"
          placeholder="Aa"
          onKeyDown={handleEnter}
        />
      </div>
      <div className={styles.send_message_button} onClick={sendHandler}>
        {isSend ? (
          <Send
            color={
              chatTheme?.type === "gradient"
                ? chatTheme?.downColor
                : chatTheme?.color
            }
          />
        ) : (
          <Like
            color={
              chatTheme?.type === "gradient"
                ? chatTheme?.downColor
                : chatTheme?.color
            }
          />
        )}
      </div>
    </div>
  );
}

export default SendMessage;
