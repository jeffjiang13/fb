import { NavLink, Link } from "react-router-dom";
import { Dots } from "../../svg";
import classes from "./style.module.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProfileMenu() {
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const { username } = useParams();
  const usernameID = username ? username : user.username;
  const isVisitor = !(usernameID === user.username);
  return (
    <div className={classes.profile_menu_wrap}>
      <div className={classes.profile_menu}>
        <NavLink
          to={`/profile/${usernameID}`}
          className={({ isActive }) =>
            isActive
              ? `${classes.active} ${classes.middle_icon}`
              : `${classes.middle_icon} hover2`
          }
        >
          Posts
        </NavLink>
        <NavLink
          to={`/about/${usernameID}`}
          className={({ isActive }) =>
            isActive
              ? `${classes.active} ${classes.middle_icon}`
              : `${classes.middle_icon} hover2`
          }
        >
          About
        </NavLink>
        <NavLink
          to={`/friendslist/${usernameID}`}
          className={({ isActive }) =>
            isActive
              ? `${classes.active} ${classes.middle_icon}`
              : `${classes.middle_icon} hover2`
          }
        >
          Friends
        </NavLink>
        <NavLink
          to={`/allphotos/${usernameID}`}
          className={({ isActive }) =>
            isActive
              ? `${classes.active} ${classes.middle_icon}`
              : `${classes.middle_icon} hover2`
          }
        >
          Photos
        </NavLink>
      </div>
      <div className={classes.more}>
        <button className="gray_btn">
          <Dots />
        </button>{" "}
      </div>
    </div>
  );
}
