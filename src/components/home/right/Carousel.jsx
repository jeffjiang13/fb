import React, { useState, useEffect } from "react";
import styles from "./HomeRight.module.css";

function Carousel({ items }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [items.length]);

  return (
    <div>
      <a href={items[index].url} target="_blank" rel="noopener noreferrer">
        <img secure
          className={styles.carouselImage}
          src={items[index].image}
          alt={items[index].text}
        />
      </a>
      <div>{items[index].text}</div>
    </div>
  );
}

export default Carousel;
