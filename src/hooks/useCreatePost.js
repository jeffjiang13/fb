import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "./../App";

const CreatePost = async ({ data, type }) => {
  let endpoint;
  switch(type) {
    case 'image':
      endpoint = '/createPost/images';
      break;
    case 'video':
      endpoint = '/createPostVideo';
      break;
    default:
      // Assuming 'text' is the default type
      endpoint = '/createPost';
      break;
  }
  const reqdata = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts${endpoint}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  return reqdata;
};

export const useCreatePost = (usernameID) => {
  return useMutation({
    mutationKey: "useCreatePost",
    mutationFn: CreatePost,
    onSuccess: (data) => {
      queryClient.setQueryData(["getProfilePosts", usernameID], (oldData) => {
        if (!oldData) return;

        let newData = oldData;
        const newPost = data.data.data;
        newData.pages[0].data = [newPost, ...newData.pages[0].data];
        return {
          ...oldData,
          newData,
        };
      });

      queryClient.setQueryData(["allPosts"], (oldData) => {
        if (!oldData) return oldData;

        let newData = oldData;
        const newPost = data.data.data;
        newData.pages[0].data = [newPost, ...newData?.pages[0]?.data];
        return {
          ...oldData,
          newData,
        };
      });
    },
    // Conditionally refresh the page for video uploads only.
    onSettled: (data, error, variables) => {
      if (variables.type === "video") {
        window.location.reload();
      }
    }
  });
};
