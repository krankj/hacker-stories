import React from "react";
import styles from "./App.module.css";
const InputWithLabel = ({
  id,
  children,
  type = "text",
  value,
  isFocused,
  onInputChange,
}) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id} className={styles.label}>
        {children}
      </label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className={styles.input}
      />
    </>
  );
};

export default InputWithLabel;
