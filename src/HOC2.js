import React from "react";
function HOC2() {
  return <ConvertedAmount />;
}

const amountReducer = (state, action) => {
  switch (action.type) {
    case "ENTER_AMOUNT":
      return { ...state, input: action.payload.input, isErrorInput: false };
    case "ERROR_INPUT":
      return { ...state, isErrorInput: true };
    default:
      throw new Error();
  }
};

const withAmount = (components) => {
  return function EnhancedComponent() {
    const [amount, dispatch] = React.useReducer(amountReducer, {
      input: "",
      isErrorInput: false,
    });
    const handleInput = (event) => {
      const value = event.target.value;
      if (value === "" || Number(value)) {
        dispatch({
          type: "ENTER_AMOUNT",
          payload: { input: event.target.value },
        });
      } else {
        dispatch({ type: "ERROR_INPUT" });
      }
    };

    return (
      <div>
        <label htmlFor="amount">
          <strong>Enter Amount: </strong>
          <input
            id="amount"
            autoFocus={true}
            type="text"
            value={amount.input}
            maxLength="6"
            onChange={handleInput}
          />
          {amount.isErrorInput && (
            <h4 style={{ color: "red" }}>Invalid data</h4>
          )}
          <h2> Entered amount: {amount.input}</h2>
          {components.map((CustomComponent) => (
            <CustomComponent amount={amount.input} />
          ))}
        </label>
      </div>
    );
  };
};
const Euros = ({ amount }) => <h2> Euros - Rupees: ₹{amount * 85} </h2>;

const Dollars = ({ amount }) => <h2> Dollars - Rupees: ₹{amount * 76} </h2>;

const ConvertedAmount = withAmount([Euros, Dollars]);

export default HOC2;
