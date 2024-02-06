import React, { useState } from "react";
import "../../../App.css";

const Mercury = () => {
  const [renewalValue, setRenewalValue] = useState("");
  const [expiringValue, setExpiringValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !isNaN(renewalValue) &&
      !isNaN(expiringValue) &&
      renewalValue !== "" &&
      expiringValue !== ""
    ) {
      renewalCalc(renewalValue, expiringValue);
    } else {
      alert("Please enter valid numbers for both fields.");
      resetValues();
    }
  };

  const resetValues = () => {
    setRenewalValue("");
    setExpiringValue("");
    setMessage("");
  };

  const renewalCalc = (renewal, expiring) => {
    let renewalNum = parseFloat(renewal);
    let expiringNum = parseFloat(expiring);
    let change = renewalNum - expiringNum;
    let percentChange = (change / expiringNum) * 100;

    generateMessage(renewalNum, expiringNum, percentChange);
  };

  // Simplified to directly set the message as specified
  const generateMessage = (renewalNum, expiringNum, percentChange) => {
    let message = `Per DL FT$${renewalNum.toLocaleString()} (was $${expiringNum.toLocaleString()}) approx ${Math.abs(
      percentChange.toFixed(2)
    )}%. MIC rate increase eff:02/25/24. Emailed and diaried`;
    setMessage(message);
    copyToClipboard(message);
  };

  const copyToClipboard = (message) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(
        () => console.log("Copied to clipboard"),
        () => console.error("Unable to copy to clipboard")
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
          Submit
        </button>
      </form>
      <div className="container text-center">
        <div className="row">
          <div className="col">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default Mercury;
