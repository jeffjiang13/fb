import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  isOpen: false,
  type: "normal",
  postText: "",
  background: null,
  images: [],
  video: [],
};

export const createPostSlice = createSlice({
  name: "createPost",
  initialState: initialValue,

  reducers: {
    type: (state, action) => {
      state.type = action.payload;
      if (action.payload === "normal" || action.payload === "background") {
        state.images = [];
      }
    },
    addimages: (state, action) => {
      state.images.push(action.payload);
    },
    removeImage: (state, action) => {
      state.images = state.images.filter(img => img !== action.payload);
    },
    addvideo: (state, action) => {
      state.video.push(action.payload);
      state.type = "video";  // Add this line

    },
    removeVideo: (state, action) => {
      state.video = state.video.filter(video => video !== action.payload);
      state.type = "normal"; // Reset the type when there's no video

    },
    background: (state, action) => {
      state.type = "background";
      state.background = action.payload;
    },
    postText: (state, action) => {
      state.postText = action.payload;
    },
    open: (state, action) => {
      if (state.isOpen) state.type = "normal";
      state.isOpen = !state.isOpen;
      if (action.payload === "photo") state.type = "image";
    },
    success: (state, action) => {
      state.isOpen = initialValue.isOpen;
      state.type = initialValue.type;
      state.postText = initialValue.postText;
      state.background = initialValue.background;
      state.images = initialValue.images;
      state.video = initialValue.video;
    },
  },
});

export const {
  type,
  addimages,
  removeImage, // Export removeImage
  addvideo,
  removeVideo, // Export removeVideo
  background,
  postText,
  open,
  success
} = createPostSlice.actions;

export default createPostSlice.reducer;
