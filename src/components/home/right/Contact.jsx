import styles from "./HomeRight.module.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

async function getAllUsers() {
  const { data } = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users`,
    {
      withCredentials: true,
    }
  );
  return data;
}

export default function Contact() {
  const { data, isLoading, isError } = useQuery(["getAllUsers"], getAllUsers, {
    refetchOnWindowFocus: false,
  });
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const userId = user?._id;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching users</div>;
  }
  return (
    <div>
      {data.data.users
        .filter((user) => user._id !== userId)
        .map((user) => (
          <Link to={`/messages/${user._id}`} key={user._id}>
            <div className={`${styles.contact} hover3`}>
              <div className={styles.contact_img}>
                <img secure src={user.photo} alt="" />
              </div>
              <span>
                {user.first_name} {user.last_name}
              </span>
            </div>
          </Link>
        ))}
    </div>
  );
}
