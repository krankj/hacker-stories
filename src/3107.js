import React from "react";

function Counter() {
  const [isOn, setIsOn] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [reset, setReset] = React.useState(true);

  React.useEffect(() => {
    let timeout;
    if (isOn) {
      setReset(false);
      timeout = setInterval(() => setCounter((counter) => counter + 0.1), 100);
    }
    return () => clearInterval(timeout);
  }, [isOn]);

  const handleReset = () => {
    setIsOn(false);
    setCounter(0);
    setReset(true);
  };

  return (
    <>
      <h1>{counter.toFixed(1)}</h1>
      {!isOn && (
        <button type="button" onClick={() => setIsOn(true)}>
          {reset && "Start"}
          {!reset && "Resume"}
        </button>
      )}
      {isOn && (
        <button type="button" onClick={() => setIsOn(false)}>
          Pause
        </button>
      )}
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </>
  );
}

export default Counter;
