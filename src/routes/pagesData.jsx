import React from "react";

const Home = React.lazy(() => import("../pages/home"));
const Login = React.lazy(() => import("../pages/login"));
const Forgot = React.lazy(() => import("../pages/forgot"));
const Profile = React.lazy(() => import("../pages/profile"));
const FriendsPage = React.lazy(() => import("../pages/friends"));
const PostPage = React.lazy(() => import("../pages/post/PostPage"));
const Messages = React.lazy(() => import("../pages/messages"));
const AllPhotos = React.lazy(() => import("../pages/profile/AllPhotos"));
const FriendsList = React.lazy(() => import("../pages/profile/FriendsList"));
const About = React.lazy(() => import("../pages/profile/About"));
const pagesData = [
  {
    path: "",
    element: <Home />,
    title: "home",
    priv: true,
  },
  {
    path: "/activate/:token",
    element: <Home />,
    title: "home",
    priv: true,
  },
  {
    path: "/profile",
    element: <Profile />,
    title: "profile",
    priv: true,
  },
  {
    path: "/messages",
    element: <Messages />,
    title: "messages",
    priv: true,
  },
  {
    path: "/messages/:chatId",
    element: <Messages />,
    title: "messages",
    priv: true,
  },
  {
    path: "/friends",
    element: <FriendsPage />,
    title: "profile",
    priv: true,
  },
  {
    path: "/friends/:type",
    element: <FriendsPage />,
    title: "profile",
    priv: true,
  },
  {
    path: "/profile/:username",
    element: <Profile />,
    title: "profile",
    priv: true,
  },
  {
    path: "/:username/posts/:post",
    element: <PostPage />,
    title: "profile",
    priv: true,
  },
  {
    path: "forgot",
    element: <Forgot />,
    title: "home",
    priv: false,
  },
  {
    path: "login",
    element: <Login />,
    title: "login",
    priv: false,
  },
  {
    path: "allPhotos",
    element: <AllPhotos />,
    title: "photos",
    priv: true,
  },
  {
    path: "allPhotos/:username",
    element: <AllPhotos />,
    title: "photos",
    priv: true,
  },
  {
    path: "about/:username",
    element: <About />,
    title: "about",
    priv: true,
  },
  {
    path: "friendslist/:username",
    element: <FriendsList />,
    title: "friendslist",
    priv: true,
  },
];

export default pagesData;
