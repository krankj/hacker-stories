import React, { useRef } from "react";

function Example() {
  const [count, setCount] = React.useState(0);

  let currentCount = useRef();
  React.useEffect(() => {
    currentCount.current = count;
  });
  function handleAlertClick() {
    setTimeout(() => {
      alert("You clicked on: " + currentCount.current);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={handleAlertClick}>Show alert</button>
    </div>
  );
}

export default Example;
