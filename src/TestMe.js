import React from "react";

const App = () => {
  const [count, setCount] = React.useState(0);

  const handleIncrease = () => {
    setTimeout(() => setCount((state) => state + 1), 1000);
  };

  const handleDecrease = () => {
    setTimeout(() => setCount((state) => state - 1), 1000);
  };

  return (
    <div>
      Count: {count}
      <hr />
      <div>
        <button type="button" onClick={handleIncrease}>
          Increase
        </button>
        <button type="button" onClick={handleDecrease}>
          Decrease
        </button>
      </div>
    </div>
  );
};

export default App;
