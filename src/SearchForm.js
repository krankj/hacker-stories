import React from "react";
import styles from "./App.module.css";
import InputWithLabel from "./InputWithLabel";

const SearchForm = ({ searchTerm, onSearchInput, onSubmit }) => (
  <form onSubmit={onSubmit} className={styles.searchForm}>
    <InputWithLabel
      id="search"
      onInputChange={onSearchInput}
      isFocused
      value={searchTerm}
    >
      Search:
    </InputWithLabel>
    <button
      className={`${styles.button} ${styles.buttonSmall}`}
      type="submit"
      disabled={!searchTerm}
    >
      Submit
    </button>
  </form>
);
export default SearchForm;
