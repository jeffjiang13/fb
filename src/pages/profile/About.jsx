import React, { useEffect, useState, useRef } from "react";
import classes from "./style.module.css";
import { useParams } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import ProfileMenu from "./ProfileMenu";
import Post from "../../components/posts/post";
import Card from "../../components/UI/Card/Card";
import Photos from "./Photos";
import Friends from "./Friends";
import ProfilePhoto from "../../components/profile/profilePhoto/ProfilePhoto";
import Cover from "../../components/profile/cover/Cover";
import CoverClasses from "../../components/profile/cover/Cover.module.css";
import AboutComponent from "../../components/profile/intro/about";
import useWindowDimensions from "../../hooks/useWindowDimensions ";
import Friendship from "./Friendship";
import { useInView } from "react-intersection-observer";
import CreatePost from "../../components/home/posts/CreatePost/CreatePost";
import Skeleton from "react-loading-skeleton";
import PostSkeleton from "../../components/skeleton/PostSkeleton";
import { useNavigate } from "react-router-dom";
import classe from "./About.module.css";
import styles from "./FriendsList.module.css";
import { NavLink, Link } from "react-router-dom";
import { Dots } from "../../svg";
import { Search } from "../../svg";
import ImageViewer from "react-simple-image-viewer";
import Portal from "../../utils/Portal";

function About(color) {
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const navigate = useNavigate();

  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [detailsHeight, setDetailsHeight] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const { username } = useParams();
  const pRef = useRef(null);
  const detailsRef = useRef(null);
  const { height } = useWindowDimensions();
  const { ref, inView } = useInView();
  const [searchTerm, setSearchTerm] = useState("");

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

  const fetchPosts = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getProfile/${usernameID}/posts?sort=-createdAt&limit=10&page=${pageParam}`,
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

  const {
    isLoading: postsLoading,
    isSuccess: postsIsSuccess,
    data: postsData,
    isError: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching: postsIsFetching,
  } = useInfiniteQuery({
    queryKey: ["getProfilePosts", usernameID],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) {
        return undefined;
      } else {
        return pages.length + 1;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
  const userData = profileData?.data?.user;
  const userFriends = profileData?.data?.friends;
  const friendshipData = profileData?.data?.friendship;

  const profileSkelton = profileLoading || profileIsFetching;
  const photosSkelton = photosLoading || photosIsFetching;
  const postsSkelton = postsLoading || postsIsFetching;

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
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    setDetailsHeight(detailsRef.current?.clientHeight);
  }, [detailsRef.current?.clientHeight, profileData, photosData]);

  useEffect(() => {
    if (profileError || photosError || postsError) {
      navigate("/404");
    }
  }, [profileError, photosError, postsError]);
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
  const filteredFriends = profileData?.data.friends.filter((friend) =>
    `${friend?.first_name} ${friend?.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const excludedUsers = ["6476534f9606e76435aa18b4", "64764ecb0fcd85b0440c46a5"];

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
        <div>
          <Card className={styles.friends}>
            <h2>About</h2>
            <AboutComponent
              userData={userData}
              isVisitor={isVisitor}
              showEdit={showEdit}
              setShowEdit={setShowEdit}
              profileSkelton={profileSkelton}
            />
          </Card>
        </div>
      </div>
      <br />
      <div className={classe.wrapper}>
        <Card className={styles.friends}>
          <div style={{ position: "relative" }}>
            {profileData && profileData?.data && <h2>Friends</h2>}
            <div
              className={classe.more}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              {/* <div className={styles.search}>
                <Search color={color} />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div> */}
              <div className={styles.buttons}>
                {!isVisitor && (
                  <>
                    <Link
                      to={`/friends/requests`}
                      className={`${styles.requestButton} hover2`}
                    >
                      Friend Requests
                    </Link>
                    <Link
                      to={`/friends`}
                      className={`${styles.findButton} hover2`}
                    >
                      Find Friends
                    </Link>
                    <button className="gray_btn">
                      <Dots />
                    </button>{" "}
                  </>
                )}{" "}
              </div>{" "}
            </div>
            <div className={classes.profile_menu}>
              <NavLink
                to={`#`}
                className={({ isActive }) =>
                  isActive
                    ? `${classes.active} ${classes.middle_icon}`
                    : `${classes.middle_icon} hover2`
                }
              >
                All friends
              </NavLink>

              {!isVisitor ? (
                <NavLink
                  to={`#`}
                  className={({ isActive }) =>
                    isActive
                      ? `${classes.activ} ${classes.middle_icon}`
                      : `${classes.middle_icon} hover2`
                  }
                >
                  Following
                </NavLink>
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
                    Mutual Friends
                  </NavLink>
                  <NavLink
                    to={`#`}
                    className={({ isActive }) =>
                      isActive
                        ? `${classes.activ} ${classes.middle_icon}`
                        : `${classes.middle_icon} hover2`
                    }
                  >
                    Current city
                  </NavLink>
                  <NavLink
                    to={`#`}
                    className={({ isActive }) =>
                      isActive
                        ? `${classes.activ} ${classes.middle_icon}`
                        : `${classes.middle_icon} hover2`
                    }
                  >
                    Hometown
                  </NavLink>
                  <NavLink
                    to={`#`}
                    className={({ isActive }) =>
                      isActive
                        ? `${classes.activ} ${classes.middle_icon}`
                        : `${classes.middle_icon} hover2`
                    }
                  >
                    Following
                  </NavLink>
                </>
              )}
            </div>
          </div>
          <div className={styles.friends_grid}>
            {filteredFriends?.length > 0 ? (
              filteredFriends
              .filter(user => user && !excludedUsers.includes(user._id))
              .slice(0, 4)
              .map((friend, index) => (
                <div key={index} className={styles.friend}>
                  <Link to={`/profile/${friend?.username}`}>
                    <img secure src={friend?.photo} alt={friend?.name} />
                  </Link>
                  <h4 className={styles.name}>
                    <Link className={styles.link} to={`/profile/${friend?.username}`}>
                      {`${friend?.first_name} ${friend?.last_name}`}
                    </Link>{" "}
                    <Dots />
                  </h4>
                </div>
              ))
            ) : (
              <p className={styles.result}>No results for: {searchTerm}</p>
            )}
          </div>
          <br />
          {profileData?.data.friends.length > 4 && (
            <button
              className={classes.seeAllButton}
              onClick={() => navigate(`/friendslist/${usernameID}`)}
            >
              See All
            </button>
          )}
        </Card>
      </div>
      <br />
      <div className={classe.wrapper}>
        <Card className={styles.friends}>
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
            {images.slice(0, 10).map((src, index) => (
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
          <br />
          {images.length > 10 && (
            <button
              className={classes.seeAllButton}
              onClick={() => navigate(`/allphotos/${usernameID}`)}
            >
              See All
            </button>
          )}
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
      <br />
    </div>
  );
}

export default About;
