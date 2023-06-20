import React, { useState, useCallback,  useEffect,  } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/UI/Card/Card";
import classes from "./style.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import Skeleton from "react-loading-skeleton";
import ImageViewer from "react-simple-image-viewer";
import Portal from "../../utils/Portal";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Photos({ photosData, photosSkelton }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { userId } = useParams();
  const [photos, setPhotos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const { username } = useParams();
  const usernameID = username ? username : user.username;
  const isVisitor = !(usernameID === user.username);

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const filterImages = (resources) => {
    return resources.filter((resource) => resource.url.includes(".webp"));
  };

  const images = photosData.resources
    ? filterImages(photosData.resources).map((img) => img.url)
    : [];

  return (
    <Card className={classes.photos}>
      <div className={classes.card_header}>
        Photos
        <Link className={classes.link} to={`/allphotos/${usernameID}`}>
          See all photos
        </Link>
      </div>
      <div className={classes.content}>
        <div className={classes.info}>
          {photosSkelton ? (
            <Skeleton width={80} height={10} />
          ) : (
            `${photosData.total_count} photos`
          )}
        </div>

        {photosSkelton ? (
          <div className={classes.loading}>
            <PuffLoader color="#1876f2" loading={photosSkelton} size={40} />
          </div>
        ) : (
          <div className={classes.photo_grid}>
            {photosData.resources &&
              filterImages(photosData.resources)
                .slice(0, 9)
                .map((img, index) => (
                  <div
                    onClick={() => openImageViewer(index)}
                    className={classes.photo_card}
                    key={img.id}
                    style={{ backgroundImage: `url(${img.url})` }}
                  ></div>
                ))}
          </div>
        )}
        {isViewerOpen && (
          <Portal>
            <ImageViewer
              src={images}
              currentIndex={currentImage}
              disableScroll={false}
              closeOnClickOutside={true}
              onClose={closeImageViewer}
            />
          </Portal>
        )}

      </div>
    </Card>
  );
}

export default Photos;
