import React, { useState } from "react";
import "../../../App.css";

const RateCalculator = () => {
  const [renewalValue, setRenewalValue] = useState("");
  const [expiringValue, setExpiringValue] = useState("");
  const [premChange, setPremChange] = useState("");
  const [premChangeOver, setPremChangeOver] = useState(false);
  const [percentageChange, setPercentageChange] = useState("");
  const [message, setMessage] = useState("");

  // Handles form submission, validates input and calls renewalCalc
  const handleSubmit = (event) => {
    event.preventDefault();

    if (isNaN(renewalValue) || isNaN(expiringValue)) {
      alert("Please enter a number");
      resetValues();
    } else if (renewalValue === "" || expiringValue === "") {
      alert("Please enter a number");
      resetValues();
    } else {
      renewalCalc(renewalValue, expiringValue);
    }
  };

  // resetValues: Resets the state values for the form
  const resetValues = () => {
    setRenewalValue("");
    setExpiringValue("");
    setPremChange("");
    setPercentageChange("");
  };

  // Calculates premium and percentage change and updates state
  const renewalCalc = (renewal, expiring) => {
    let renewalValue = parseFloat(renewal);
    let expiringValue = parseFloat(expiring);
    let percentageChange = (renewalValue - expiringValue) / expiringValue;
    let premChange = renewalValue - expiringValue;

    setPremChange(premChange);
    setPercentageChange(percentageChange);

    generateMessage(premChange, percentageChange, renewalValue, expiringValue);
  };

  // Generates the message to be displayed based on the calculated values
  // Generates the message to be displayed based on the calculated values
  const generateMessage = (
    premChange,
    percentageChange,
    renewalValue,
    expiringValue
  ) => {
    let message = "";
    let absPercentageChange = Math.abs(percentageChange);
    let percentChange = (percentageChange * 100).toFixed(
      percentageChange >= 0.095 && percentageChange < 0.1 ? 1 : 0
    );

    if (parseFloat(renewalValue) === parseFloat(expiringValue)) {
      message = `Per DL FT$${renewalValue.toLocaleString()} (was same)`;
      setPremChangeOver(false);
    } else if (absPercentageChange < 0.01) {
      message = `Per DL FT$${renewalValue.toLocaleString()} (was $${expiringValue.toLocaleString()}) <1% ${
        premChange > 0 ? "increase" : "decrease"
      }`;
      setPremChangeOver(false);
    } else if (percentageChange < 0.1) {
      message = `Per DL FT$${renewalValue.toLocaleString()} (was $${expiringValue.toLocaleString()}) approx ${Math.abs(
        percentChange
      )}% ${premChange > 0 ? "increase" : "decrease"}`;
      setPremChangeOver(false);
    } else {
      if (premChange < 100) {
        message = `Per DL FT$${renewalValue.toLocaleString()} (was $${expiringValue.toLocaleString()}) approx ${percentChange}% increase. Within our $100 threshold`;
        setPremChangeOver(false);
      } else {
        message = "ren.prem.over.threshold";
        setPremChangeOver(true);
      }
    }

    setMessage(message);
    copyToClipboard(message);
  };

  // Copies the generated message to the clipboard
  const copyToClipboard = (message) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(
        function () {
          console.log("Copied to clipboard");
        },
        function () {
          console.error("Unable to copy to clipboard");
        }
      );
    } else {
      console.error("Clipboard API not supported");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="container text-center">
          <div className="row">
            <div className="col input-group mb-3 renewing">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                placeholder="Renewing premium"
                aria-label="Amount (to the nearest dollar)"
                value={renewalValue}
                onChange={(e) => setRenewalValue(e.target.value)}
                step="0.01"
              />
            </div>
            <div className="col input-group mb-3 expiring">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                placeholder="Expiring premium"
                aria-label="Amount (to the nearest dollar)"
                value={expiringValue}
                onChange={(e) => setExpiringValue(e.target.value)}
                step="0.01"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mx-auto d-block">
          Generate and copy
        </button>
      </form>
      <div className="container text-center">
        <div className="row">
          <div className={`col prem-change ${premChangeOver ? "over" : ""}`}>
            {premChange !== "" && `$${premChange.toLocaleString()}`}
          </div>
          <div className="col percentage-change">
            {percentageChange !== "" &&
              `${(percentageChange * 100).toFixed(2)}%`}
          </div>
        </div>
      </div>
      <div className="container text-center message">{message}</div>
    </div>
  );
};

export default RateCalculator;
