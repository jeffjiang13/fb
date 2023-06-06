import React, { useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import classes from "./AllPhotos.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Portal from "../../utils/Portal";
import Card from "../../components/UI/Card/Card";

const AllPhotos = () => {
  const user = useSelector((state) => ({ ...state.user.userinfo }));

  const { username } = useParams();
  const usernameID = username ? username : user.username;

  const fetchProfile = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getProfile/${usernameID}?sort=-createdAt&limit=10`,
      {
        withCredentials: true,
      }
    );
    return data;
  };

  const fetchPhotos = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getProfile/${usernameID}/photos`,
      {
        withCredentials: true,
      }
    );
    return data;
  };

  const {
    isLoading: profileLoading,
    isError: profileError,
    data: profileData,
  } = useQuery({
    queryKey: ["getProfile", username],
    queryFn: fetchProfile,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const {
    isLoading: photosLoading,
    isError: photosError,
    data: photosData,
  } = useQuery({
    queryKey: ["getPhotos", username],
    queryFn: fetchPhotos,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const filterImages = (resources) => {
    return resources.filter((resource) => resource.url.includes(".webp")); // Change the extension as per your requirement
  };
  const images =
    photosData && photosData.data && photosData.data.resources
      ? filterImages(photosData.data.resources).map((img) => img.url)
      : [];

  const openImageViewer = (index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  if (profileLoading || photosLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || photosError) {
    return <div>Error occurred!</div>;
  }
console.log(profileData)
  return (
    <Card className={classes.photos}>
              <div className={classes.card_header}>

      <h1>All Photos</h1>
      </div>
      {profileData && profileData.data && (
        <h2>{profileData.data.user.first_name}'s Photos</h2>
      )}
      <div className={classes.photo_grid}>
        {images.map((src, index) => (
          <img
            src={src}
            onClick={() => openImageViewer(index)}
            width="300"
            height= "250px"

            key={index}
            style={{ margin: "2px", backgroundImage: `url(${src.url})` }}
            alt=""
          />
        ))}
      </div>
      {isViewerOpen && (
                  <Portal>

        <ImageViewer
          src={images}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          closeOnClickOutside={true}
          disableScroll={false}

        />
        </Portal>
      )}
    </Card>
  );
};

export default AllPhotos;
