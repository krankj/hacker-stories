import React from "react";
import styles from "./App.module.css";
import { ReactComponent as UpArrow } from "./up-chevron.svg";
import { ReactComponent as DownArrow } from "./down-arrow.svg";

const SortButton = ({ sortAsc, visible, onSortHandler, children }) => {
  return (
    <>
      <button
        className={styles.sortButton}
        type="button"
        onClick={() => onSortHandler(children.toUpperCase())}
      >
        <div className={styles.sortButtonLayout}>
          <div className={styles.sortIcon}>
            {visible &&
              ((!sortAsc && <DownArrow />) || (sortAsc && <UpArrow />))}
          </div>
          <div className={styles.sortText}>{children}</div>
        </div>
      </button>
    </>
  );
};

export default SortButton;
