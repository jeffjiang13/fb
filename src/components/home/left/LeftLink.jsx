import styles from "./HomeLeft.module.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom or any other routing library you're using

export default function LeftLink({ img, text, notification, link }) {
  const renderContent = () => {
    if (notification !== undefined) {
      return (
        <div className={styles.col}>
          <div className={styles.col_1}>{text}</div>
          <div className={styles.col_2}>{notification}</div>
        </div>
      );
    } else {
      return <span>{text}</span>;
    }
  };

  return (
    <Link to={link} className={`${styles.left_link} hover2`}>
      <img secure src={`../../../left/${img}.png`} alt="" />
      {renderContent()}
    </Link>
  );
}
