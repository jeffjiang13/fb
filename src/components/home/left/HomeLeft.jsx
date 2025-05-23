import LeftLink from "./LeftLink";
import { left } from "../../../data/home";
import { Link } from "react-router-dom";
import { ArrowDown1 } from "../../../svg";
import { useState } from "react";
import Shortcut from "./Shortcut";
import styles from "./HomeLeft.module.css";

export default function HomeLeft({ user }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`${styles.left_home} scrollbar`}>
      <Link to="/profile" className={`${styles.left_link} hover2`}>
        <img secure src={user?.photo} alt="" />
        <span>
          {user?.first_name} {user.last_name}
        </span>
      </Link>
      {left
        .slice(0, 8)
        .map((link, i) =>
          link.link ? (
            <LeftLink
              key={i}
              img={link.img}
              text={link.text}
              notification={link.notification}
              link={link.link}
            />
          ) : (
            <LeftLink
              key={i}
              img={link.img}
              text={link.text}
              notification={link.notification}
            />
          )
        )}
      {!visible && (
        <div
          className={`${styles.left_link} hover2`}
          onClick={() => {
            setVisible(true);
          }}
        >
          <div className={`${styles.small_circle} small_circle`}>
            <ArrowDown1 />
          </div>
          <span>See more</span>
        </div>
      )}
      {visible && (
        <div className={styles.more_left}>
          {left.slice(8, left.length).map((link, i) => (
            <LeftLink
              key={i}
              img={link.img}
              text={link.text}
              notification={link.notification}
            />
          ))}
          <div
            className={`${styles.left_link} hover2`}
            onClick={() => {
              setVisible(false);
            }}
          >
            <div
              className={`${styles.small_circle} small_circle ${styles.rotate360}`}
            >
              <ArrowDown1 />
            </div>
            <span>Show less</span>
          </div>
        </div>
      )}
      <div className={styles.splitter}></div>
      <div className={styles.shortcut}>
        <div className={styles.heading}>Shortcuts</div>
        <div className={styles.edit_shortcut}>Edit</div>
      </div>
      <div className={styles.shortcut_list}>
        <div className="hover2">
          <Shortcut
            link="https://github.com/jeffjiang13"
            img="../../images/github.png"
            name="Github"
          />
        </div>
        <div className="hover2">
          <Shortcut
            link="https://www.linkedin.com/in/jeffjiang13/"
            img="../../images/linkedin.png"
            name="Linkedin"
          />
        </div>
        <div className="hover2">
          <Shortcut
            link="https://www.jeff-jiang.com"
            img="../../images/icon.png"
            name="Portfolio"
          />
        </div>
      </div>
      <div
        className={`${styles.fb_copyright} ${
          visible && styles.relative_fb_copyright
        }`}
      >
        <Link to="/">Privacy </Link>
        <span>• </span>
        <Link to="/">Terms </Link>
        <span>• </span>
        <Link to="/">Advertising </Link>
        <span>• </span>
        <Link to="/">
          Ad Choices <i className="adChoices_icon"></i>{" "}
        </Link>
        <span>• </span>
        <Link to="/">Cookies</Link> <span>• </span> <br />
        <Link to="/">More </Link>
        <span>• </span>
        connect © 2025 by JJ, All Rights Reserved
      </div>
    </div>
  );
}
