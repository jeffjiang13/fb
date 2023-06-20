import React, { useState, useEffect } from "react";
import isRTL from "../../../utils/isRTL";
import Card from "../../UI/Card/Card";
import EditArea from "./EditArea";
import classes from "./about.module.css";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import EditDetails from "./EditDetails";
import { queryClient } from "./../../../App";
import Skeleton from "react-loading-skeleton";
import Detail from "./Detail";
function AboutComponent({
  userData,
  isVisitor,
  showEdit,
  setShowEdit,
  profileSkelton,
}) {
  console.log("userData", userData);
  const dData = userData?.details;
  const [details, setDetails] = useState(dData);
  const [infos, setInfos] = useState(dData);
  const [showBio, setShowBio] = useState(false);
  const [max, setMax] = useState(infos?.bio ? 100 - infos?.bio.length : 100);
  const [currentDetail, setCurrentDetail] = useState(null);

  const handleBioChange = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value.replace(/(^[ \t]*\n)/gm, "") });
    setMax(100 - e.target.value.length);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value });
  };

  const sendPost = () => {
    return axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/update/profile/details`,
      { infos },
      {
        withCredentials: true,
      }
    );
  };

  const { data, isSuccess, mutate } = useMutation({
    mutationKey: "updateDetails",
    mutationFn: sendPost,
    onSuccess: (data) => {
      queryClient.setQueryData(["getProfile", userData.username], (oldData) => {
        let newData = oldData;

        newData.data.user.details = data.data.data.details;
        return oldData
          ? {
              ...oldData,
              newData,
            }
          : oldData;
      });
    },
  });

  const updateDetails = () => {
    mutate();
  };

  useEffect(() => {
    setDetails(dData);
    setInfos(dData);
    setMax(dData?.bio ? 100 - dData?.bio.length : 100);
  }, [dData]);

  useEffect(() => {
    if (isSuccess && data?.data?.status === "success") {
      setDetails(data.data.data.details);
      setInfos(data.data.data.details);
      setTimeout(() => {
        setShowBio(false);
      }, 500);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (showEdit) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [showEdit]);

  return (
    <div className={classes.container}>
      {/* <div className={classes.card_header}>Intro</div> */}
      {profileSkelton ? (
        <Skeleton count={3} height={20} width="100%" />
      ) : (
        <div className={classes.content}>
          {details?.bio && !showBio && (
            <>
              <div
                className={classes.bio}
                style={{
                  direction: `${isRTL(details?.bio) ? "rtl" : "ltr"}`,
                }}
              >
                {details?.bio}
              </div>

              {isVisitor && <div className="line-spliter" />}
            </>
          )}
          {showBio && (
            <EditArea
              remain={max}
              infos={infos}
              details={details}
              handleChange={handleBioChange}
              setShow={setShowBio}
              updateDetails={updateDetails}
              name="bio"
              placeholder="Describe who you are"
              max={100}
            />
          )}
          {!isVisitor && !showBio && (
            <button
              className={`gray_btn ${classes.edit_btn}`}
              onClick={() => setShowBio((perv) => !perv)}
            >
              {details?.bio ? `Edit` : `Add`} Bio
            </button>
          )}
          {(details?.job || details?.workplace) && (
            <div className={classes.info_profile}>
              <img src="../../../icons/job.png" alt="" />
              <span>
                works{details?.job && <span> as {details?.job}</span>}
                {details?.workplace && (
                  <span>
                    {" "}
                    at <b>{details?.workplace}</b>
                  </span>
                )}
              </span>
            </div>
          )}
          {details?.relationship && (
            <div className={classes.info_profile}>
              <img src="../../../icons/relationship.png" alt="" />
              {details?.relationship}
            </div>
          )}
          {details?.college && (
            <div className={classes.info_profile}>
              <img src="../../../icons/studies.png" alt="" />
              studied at {details?.college}
            </div>
          )}
          {details?.highSchool && (
            <div className={classes.info_profile}>
              <img src="../../../icons/studies.png" alt="" />
              studied at {details?.highSchool}
            </div>
          )}
          {details?.currentCity && (
            <div className={classes.info_profile}>
              <img src="../../../icons/home.png" alt="" />
              Lives in {details?.currentCity}
            </div>
          )}
          {details?.homeTown && (
            <div className={classes.info_profile}>
              <img src="../../../icons/from.png" alt="" />
              From {details?.homeTown}
            </div>
          )}
          {details?.instagram && (
            <div className={classes.info_profile}>
              <img src="../../../icons/instagram.png" alt="" />
              <a
                href={`https://www.instagram.com/${details?.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                {details?.instagram}
              </a>
            </div>
          )}
          {userData?.createdAt && (
            <div className={classes.info_profile}>
              <img width={20} src="../../../icons/join.png" alt="joindAT" />
              Joined{" "}
              {new Date(userData?.createdAt).toLocaleString("default", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}
            </div>
          )}
          {!isVisitor && (
            <button
              className={`gray_btn ${classes.edit_btn}`}
              onClick={() => setShowEdit((perv) => !perv)}
            >
              Edit Details
            </button>
          )}
          {showEdit && (
            <EditDetails
              showEdit={showEdit}
              setShowEdit={setShowEdit}
              infos={infos}
              handleChange={handleChange}
              updateDetails={updateDetails}
              details={details}
            />
          )}
        </div>
      )}
      <div className={classes.content}>
        <div className={classes.section}>
          <h4
            onClick={() => setCurrentDetail("overview")}
            className={currentDetail === "overview" ? classes.active : ""}
          >
            Overview
          </h4>
          {currentDetail === "overview" && (
            <>
              <div>
                <Detail
                  value={details?.workplace}
                  img="job"
                  placeholder="Add a workplace"
                  name="workplace"
                  text="a workplace"
                  handleChange={handleChange}
                  updateDetails={updateDetails}
                  infos={infos}
                  details={details}
                  max={20}
                  isVisitor={isVisitor}
                />

                <Detail
                  value={details?.highSchool}
                  img="studies"
                  placeholder="Add a high School"
                  name="highSchool"
                  text="high school"
                  handleChange={handleChange}
                  updateDetails={updateDetails}
                  infos={infos}
                  details={details}
                  max={20}
                  isVisitor={isVisitor}
                />
                <Detail
                  value={details?.college}
                  img="studies"
                  placeholder="Add a college"
                  name="college"
                  text="college"
                  handleChange={handleChange}
                  updateDetails={updateDetails}
                  infos={infos}
                  details={details}
                  max={20}
                  isVisitor={isVisitor}
                />
                <Detail
                  value={details?.currentCity}
                  img="home"
                  placeholder="Add a current city"
                  name="currentCity"
                  text="current city"
                  handleChange={handleChange}
                  updateDetails={updateDetails}
                  infos={infos}
                  details={details}
                  max={20}
                  isVisitor={isVisitor}
                />
                <Detail
                  value={details?.homeTown}
                  img="from"
                  placeholder="Add a hometown"
                  name="homeTown"
                  text="hometown"
                  handleChange={handleChange}
                  updateDetails={updateDetails}
                  infos={infos}
                  details={details}
                  max={20}
                  isVisitor={isVisitor}
                />
              </div>
              <hr className={classes.divider} />
            </>
          )}
        </div>
        <div className={classes.section}>
          <h4
            onClick={() => setCurrentDetail("workplace")}
            className={currentDetail === "workplace" ? classes.active : ""}
          >
            Work and education
          </h4>
          {currentDetail === "workplace" && (
            <>
              <h3>Work</h3>
              <Detail
                value={details?.job}
                img="job"
                placeholder="Add a job"
                name="job"
                text="a job"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <Detail
                value={details?.workplace}
                img="job"
                placeholder="Add a workplace"
                name="workplace"
                text="a workplace"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <h3>College</h3>

              <Detail
                value={details?.college}
                img="studies"
                placeholder="Add a college"
                name="college"
                text="college"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <h3>High school</h3>
              <Detail
                value={details?.highSchool}
                img="studies"
                placeholder="Add a high School"
                name="highSchool"
                text="high school"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <hr className={classes.divider} />
            </>
          )}
        </div>

        <div className={classes.section}>
          <h4
            onClick={() => setCurrentDetail("places")}
            className={currentDetail === "places" ? classes.active : ""}
          >
            Places lived
          </h4>
          {currentDetail === "places" && (
            <>
              <Detail
                value={details?.currentCity}
                img="home"
                placeholder="Add a current city"
                name="currentCity"
                text="current city"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <Detail
                value={details?.homeTown}
                img="from"
                placeholder="Add a hometown"
                name="homeTown"
                text="hometown"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <Detail
                value={details?.city}
                img="from"
                placeholder="Add a city"
                name="city"
                text="city"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <hr className={classes.divider} />
            </>
          )}
        </div>

        <div className={classes.section}>
          <h4
            onClick={() => setCurrentDetail("contacts")}
            className={currentDetail === "contacts" ? classes.active : ""}
          >
            {" "}
            Contact and basic info
          </h4>
          {currentDetail === "contacts" && (
            <>
              {" "}
              <Detail
                value={details?.instagram}
                img="instagram"
                placeholder="Add a instagram"
                name="instagram"
                text="instagram"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <hr className={classes.divider} />
            </>
          )}
        </div>

        <div className={classes.section}>
          <h4
            onClick={() => setCurrentDetail("family")}
            className={currentDetail === "family" ? classes.active : ""}
          >
            Family and relationships
          </h4>
          {currentDetail === "family" && (
            <>
              <h3>relationship</h3>{" "}
              <Detail
                value={details?.relationship}
                img="relationship"
                placeholder="Add a relationship"
                name="relationship"
                text="relationship"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                rel={true}
                isVisitor={isVisitor}
              />
              <h3>Family</h3>{" "}
              <Detail
                value={details?.familyMembers}
                img="person"
                placeholder="Add family member"
                name="familyMembers"
                text="family members"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <hr className={classes.divider} />
            </>
          )}
        </div>

        <div className={classes.section}>
          <h4
            onClick={() => setCurrentDetail("bio")}
            className={currentDetail === "bio" ? classes.active : ""}
          >
            {isVisitor
              ? `Details about ${userData?.first_name}`
              : "Details about you"}{" "}
          </h4>
          {currentDetail === "bio" && (
            <>
              {" "}
              <h3>
                {isVisitor ? `About ${userData?.first_name}` : "About you"}
              </h3>
              <Detail
                img="person"
                value={details?.bio}
                placeholder="Write some details about yourself"
                name="bio"
                text="some details about yourself"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={200}
                isVisitor={isVisitor}
              />
              <h3>Name pronunciation</h3>
              <Detail
                img="other"
                value={details?.pronunciation}
                placeholder="Add a name pronunciation"
                name="pronunciation"
                text="a name pronunciation"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={50}
                isVisitor={isVisitor}
              />
              <h3>Other names</h3>
              <Detail
                img="person"
                // isURL={true}

                value={details?.otherName}
                placeholder="Add a nickname, a birth name..."
                name="otherName"
                text="a nickname, a birth name..."
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={20}
                isVisitor={isVisitor}
              />
              <h3>Favorite quotes</h3>
              <Detail
                img="videography"
                value={details?.favoriteQuotes}
                placeholder="Add your favorite quotations"
                name="favoriteQuotes"
                text="your favorite quotations"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={200}
                isVisitor={isVisitor}
              />
              <h3>Blood donations</h3>
              <Detail
                value={details?.bloodGroup}
                img="blood-drop"
                placeholder="Add a blood group"
                name="bloodGroup"
                text="blood group"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={3}
                isVisitor={isVisitor}
              />
              <hr className={classes.divider} />
            </>
          )}
        </div>

        <div className={classes.section}>
          <h4
            onClick={() => setCurrentDetail("events")}
            className={currentDetail === "events" ? classes.active : ""}
          >
            Life events
          </h4>
          {currentDetail === "events" && (
            <>
              {" "}
              <Detail
                value={details?.lifeEvent}
                img="calendar"
                placeholder="Add a life event"
                name="lifeEvent"
                text="a life event"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                details={details}
                max={50}
                isVisitor={isVisitor}
              />
              <hr className={classes.divider} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutComponent;
