import { Dots, NewRoom, Search } from "../../../svg";
import Contact from "./Contact";
import styles from "./HomeRight.module.css";
import Carousel from "./Carousel";
function HomeRight({ user }) {
  const color = "#65676b";
  const ads = [
    {
      image:
        "https://res.cloudinary.com/dw8k3b8h7/image/upload/v1685505941/facebook/users/647656a2738e4dd3b6162c69/public/posts/n65e9ugn5l0s9rndxl8q.webp",
      text: "Buy our product now!",
      url: 'https://chiquechick-frontend.vercel.app/'
    },
    {
      image:
        "https://res.cloudinary.com/dw8k3b8h7/image/upload/v1685503657/facebook/users/647656a2738e4dd3b6162c69/public/posts/y2bnxdtvmqvwwrkayubo.webp",
      text: "Special discount for you!",
      url: 'https://jj-ecommerce-store.vercel.app/'

    },
    {
      image:
        "https://res.cloudinary.com/dw8k3b8h7/image/upload/v1685504156/facebook/users/647656a2738e4dd3b6162c69/public/posts/cwzojs2zmt7tur9xvkvs.webp",
      text: "Don't miss this opportunity!",
      url: 'https://jj-ecommerce-3.vercel.app/'

    },
  ];
  return (
    <div className={styles.right_home}>
      <div className={styles.heading}>Sponsored</div>
      <Carousel items={ads} />
      <div className={styles.splitter}></div>
      <div className="contacts_wrap">
        <div className={styles.contacts_header}>
          <div className={styles.contacts_header_left}>Contacts</div>
          <div className={styles.contacts_header_right}>
            <div className={`${styles.contact_circle} hover2`}>
              <NewRoom color={color} />
            </div>
            <div className={`${styles.contact_circle} hover2`}>
              <Search color={color} />
            </div>
            <div className={`${styles.contact_circle} hover2`}>
              <Dots color={color} />
            </div>
          </div>
        </div>
        <div className={`${styles.contacts_list}`}>
          <Contact user={user} />
        </div>
      </div>
    </div>
  );
}

export default HomeRight;
