import styles from "./UserMenu.module.css";
import { user_menu1 } from "../../..//data/allMenu";

export default function SettingsPrivacy({ setVisible }) {
  return (
    <div className={styles.absolute_wrap}>
      <div className={styles.absolute_wrap_header}>
        <div
          className={`${styles.circle} hover1`}
          onClick={() => {
            setVisible(0);
          }}
        >
          <i className="arrow_back_icon"></i>
        </div>
        Settings & privacy
      </div>
      {user_menu1.map(({ name, icon }, i) => (
        <div className={`${styles.mmenu_item} hover1`} key={i}>
          <div className={styles.small_circle}>
            <i className={icon}></i>
          </div>
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}
