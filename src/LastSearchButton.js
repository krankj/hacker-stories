import React from "react";
import styles from "./App.module.css";
import { ReactComponent as BackArrow } from "./left-turn-arrow.svg";

const LastSearchButton = ({ enabled, onBackButtonClick }) => (
  <button
    type="buttton"
    disabled={!enabled}
    className={styles.sortButton}
    onClick={onBackButtonClick}
  >
    <div className={styles.backArrowButtonLayout}>
      <div className={styles.backArrowIcon}>
        <BackArrow />
      </div>
      <div className={styles.backArrowText}>Previous Search</div>
    </div>
  </button>
);

export default LastSearchButton;
