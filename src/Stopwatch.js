import React from "react";

function Stopwatch() {
  const [isOn, setIsOn] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [reset, setReset] = React.useState(true);

  React.useEffect(() => {
    let interval;
    console.log("Running the useEffect");
    if (isOn) {
      setReset(false);
      interval = setInterval(() => {
        setCounter((counter) => counter + 0.1);
      }, 100);
    }
    return () => {
      console.log("Clearing the interval");
      clearInterval(interval);
    };
  }, [isOn]);

  function onReset() {
    setReset(true);
    setIsOn(false);
    setCounter(0);
  }
  return (
    <>
      <h1>{counter.toFixed(1)}</h1>
      {!isOn && (
        <button type="button" onClick={() => setIsOn(true)}>
          {reset && `Start`}
          {!reset && `Resume`}
        </button>
      )}
      {isOn && (
        <button type="button" onClick={() => setIsOn(false)}>
          Pause
        </button>
      )}
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </>
  );
}

export default Stopwatch;
