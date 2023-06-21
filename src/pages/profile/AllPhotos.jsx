import React, { useEffect, useState, useRef } from "react";
import classes from "./style.module.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ProfileMenu from "./ProfileMenu";
import Card from "../../components/UI/Card/Card";
import ProfilePhoto from "../../components/profile/profilePhoto/ProfilePhoto";
import Cover from "../../components/profile/cover/Cover";
import CoverClasses from "../../components/profile/cover/Cover.module.css";
import useWindowDimensions from "../../hooks/useWindowDimensions ";
import Friendship from "./Friendship";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import ImageViewer from "react-simple-image-viewer";
import Portal from "../../utils/Portal";
import classe from "./AllPhotos.module.css";
import { Dots } from "../../svg";
import { NavLink, Link } from "react-router-dom";
import styles from "./FriendsList.module.css";
import * as createPostSlice from "../../app/slices/createPostSlice";

function AllPhotos({ data }) {
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [detailsHeight, setDetailsHeight] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const { username } = useParams();
  const pRef = useRef(null);
  const detailsRef = useRef(null);
  const { height } = useWindowDimensions();
  const { userId } = useParams();

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  const usernameID = username ? username : user.username;
  const isVisitor = !(usernameID === user.username);

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
    isFetching: profileIsFetching,
  } = useQuery({
    queryKey: ["getProfile", usernameID],
    queryFn: fetchProfile,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const {
    isLoading: photosLoading,
    isError: photosError,
    data: photosData,
    isFetching: photosIsFetching,
  } = useQuery({
    queryKey: ["getPhotos", usernameID],
    queryFn: fetchPhotos,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const userData = profileData?.data?.user;
  const userFriends = profileData?.data?.friends;
  const friendshipData = profileData?.data?.friendship;

  const profileSkelton = profileLoading || profileIsFetching;
  const photosSkelton = photosLoading || photosIsFetching;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [usernameID]);

  useEffect(() => {
    if (showProfilePhoto) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [showProfilePhoto]);

  useEffect(() => {
    setDetailsHeight(detailsRef.current?.clientHeight);
  }, [detailsRef.current?.clientHeight, profileData, photosData]);

  useEffect(() => {
    if (profileError || photosError) {
      navigate("/404");
    }
  }, [profileError, photosError]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const filterImages = (resources) => {
    return resources.filter((resource) => resource.url.includes(".webp"));
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
  return (
    <div className={classes.profile}>
      <div className={classes.top}>
        <div className={classes.wrapper}>
          <div className={classes.header}>
            {profileSkelton ? (
              <Skeleton
                className={CoverClasses.cover}
                style={{
                  transform: "translateY(-15px)",
                }}
              />
            ) : (
              <Cover
                profileSkelton={profileSkelton}
                isVisitor={isVisitor}
                user={userData}
                photosData={photosData?.data}
              />
            )}

            <div className={classes.content}>
              <div className={classes.photo_wrap}>
                <div className={classes.photo}>
                  {profileSkelton ? (
                    <Skeleton
                      width="168px"
                      height="168px"
                      circle
                      containerClassName="avatar-skeleton"
                    />
                  ) : (
                    <img secure
                      src={userData?.photo}
                      alt={userData?.first_name}
                      ref={pRef}
                    />
                  )}

                  {!isVisitor && !profileSkelton && (
                    <>
                      <div
                        className={`${classes.add_photo} small_circle hover1`}
                        onClick={() => setShowProfilePhoto((perv) => !perv)}
                      >
                        <i className="camera_filled_icon"></i>
                      </div>
                      {showProfilePhoto && (
                        <ProfilePhoto
                          setShowProfilePhoto={setShowProfilePhoto}
                          showProfilePhoto={showProfilePhoto}
                          pRef={pRef}
                          photosData={photosData?.data}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={classes.info}>
                {profileSkelton ? (
                  <div className={classes.sk1}>
                    <Skeleton width={220} height={25} />
                    <Skeleton width={80} height={15} />
                  </div>
                ) : (
                  <h1 className={classes.name}>
                    {`${userData?.first_name} ${userData?.last_name}`}
                    {userData?.confirmed && (
                      <i
                        style={{ marginLeft: "10px" }}
                        className="confirmed_icon"
                      />
                    )}
                    {userData?.details?.otherName && (
                      <span>{`(${userData?.details?.otherName})`}</span>
                    )}
                  </h1>
                )}
                {profileSkelton ? (
                  <Skeleton width={80} height={15} />
                ) : (
                  <span className={classes.friends}>
                    {userData?.friendsCount} friends
                  </span>
                )}
              </div>
              {!isVisitor &&
                (profileSkelton ? (
                  <div className={classes.btns}>
                    <Skeleton width="140px" className="gray_btn" />
                    <Skeleton width="140px" className="gray_btn" />
                  </div>
                ) : (
                  <div className={classes.btns}>
                    <button className="btn_blue">
                      <img secure
                        src="../../../icons/plus.png"
                        alt=""
                        className="invert"
                      />
                      <span style={{ color: "#fff" }}>Add to story</span>
                    </button>
                    <button
                      className="gray_btn"
                      onClick={() => setShowEdit(true)}
                    >
                      <i className="edit_icon"></i>
                      <span>Edit profile</span>
                    </button>
                  </div>
                ))}
              {isVisitor &&
                (profileSkelton ? (
                  <div className={classes.btns}>
                    <Skeleton width="140px" className="gray_btn" />
                    <Skeleton width="140px" className="gray_btn" />
                  </div>
                ) : (
                  <Friendship
                    friendship={friendshipData}
                    userID={userData?._id}
                    usernameID={usernameID}
                  />
                ))}
            </div>
          </div>

          <div className="line"></div>

          <ProfileMenu />
        </div>
      </div>
      <div className={classes.bottom}>
        <div className={classes.wrapper}>
          <div className={classes.details}>
            <div
              ref={detailsRef}
              className={classes.details_con}
              style={{
                top: `${
                  detailsHeight < height
                    ? `65px`
                    : `calc(100vh - ${detailsHeight}px - 10px)`
                }`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className={classe.wrapper}>
        <Card className={classe.photos}>
          <div style={{ position: "relative" }}>
            {" "}
            {profileData && profileData.data && <h2>Photos</h2>}
            <div
              className={classe.more}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              {" "}
              {!isVisitor && (
                <>
                  <div
                    onClick={() => {
                      dispatch(createPostSlice.open("photo"));
                    }}
                    className={`${styles.requestButton} hover2`}
                  >
                    Add photos/video
                  </div>
                  <button className="gray_btn">
                    <Dots />
                  </button>
                </>
              )}{" "}
            </div>
          </div>{" "}
          <div
            className={classes.profile_menu}
            style={{ marginBottom: "30px" }}
          >
            {!isVisitor ? (
              <>
                <NavLink
                  to={`#`}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.activ} ${classes.middle_icon}`
                      : `${classes.middle_icon} hover2`
                  }
                >
                  Photos of you
                </NavLink>
                <NavLink
                  to={`#`}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.active} ${classes.middle_icon}`
                      : `${classes.middle_icon} hover2`
                  }
                >
                  Your photos
                </NavLink>
                <NavLink
                  to={`#`}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.activ} ${classes.middle_icon}`
                      : `${classes.middle_icon} hover2`
                  }
                >
                  Albums
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={`#`}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.activ} ${classes.middle_icon}`
                      : `${classes.middle_icon} hover2`
                  }
                >
                  Photos of {userData?.first_name}
                </NavLink>
                <NavLink
                  to={`#`}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.active} ${classes.middle_icon}`
                      : `${classes.middle_icon} hover2`
                  }
                >
                  {userData?.first_name}'s Photos
                </NavLink>
                <NavLink
                  to={`#`}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.activ} ${classes.middle_icon}`
                      : `${classes.middle_icon} hover2`
                  }
                >
                  Albums
                </NavLink>
              </>
            )}
          </div>
          <div className={classe.photo_grid}>
            {images.map((src, index) => (
              <img secure
                src={src}
                className={classe.photo}
                onClick={() => openImageViewer(index)}
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
      </div>
    </div>
  );
}

export default AllPhotos;
