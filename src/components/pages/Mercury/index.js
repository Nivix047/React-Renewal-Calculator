import React, { useState } from "react";
import "../../../App.css";

const fmtMoney0 = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtPercent = (fraction) =>
  `${
    Number.isFinite(fraction) ? Math.abs(fraction * 100).toFixed(2) : "0.00"
  }%`;

const incDecWord = (newVal, oldVal) =>
  newVal >= oldVal ? "increase" : "decrease";

const pctChange = (newVal, oldVal) =>
  Number.isFinite(newVal) && Number.isFinite(oldVal) && oldVal !== 0
    ? (newVal - oldVal) / oldVal
    : NaN;

const fmtMMDDYY = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
};

const Mercury = () => {
  const [renewalValue, setRenewalValue] = useState("");
  const [expiringValue, setExpiringValue] = useState("");
  const [covARenewal, setCovARenewal] = useState("");
  const [covAExpiring, setCovAExpiring] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [squareFeet, setSquareFeet] = useState("");

  // NEW: Insurance company name for the rate line (the "X")
  const [rateCompany, setRateCompany] = useState("");

  // Effective date (kept as a date input; shown as MM/DD/YY)
  const [rateEffDate, setRateEffDate] = useState("");

  const [emailedWho, setEmailedWho] = useState("");
  const [message, setMessage] = useState("");

  const resetValues = () => {
    setRenewalValue("");
    setExpiringValue("");
    setCovARenewal("");
    setCovAExpiring("");
    setYearBuilt("");
    setSquareFeet("");
    setRateCompany("");
    setRateEffDate("");
    setEmailedWho("");
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ren = parseFloat(renewalValue);
    const exp = parseFloat(expiringValue);
    const covRen = parseFloat(covARenewal);
    const covExp = parseFloat(covAExpiring);
    const sqft = parseInt(squareFeet, 10);
    const yr = parseInt(yearBuilt, 10);

    const segments = [];

    // Per DL FT
    if (Number.isFinite(ren) && Number.isFinite(exp)) {
      const perPct = pctChange(ren, exp);
      segments.push(
        `Per DL FT ${fmtMoney0(ren)} (was ${fmtMoney0(
          exp
        )}) approx ${fmtPercent(perPct)} ${incDecWord(ren, exp)}.`
      );
    }

    // Coverage A
    let covPct = NaN;
    if (Number.isFinite(covRen) && Number.isFinite(covExp)) {
      covPct = pctChange(covRen, covExp);
      segments.push(
        `Cov.A at ${fmtMoney0(covRen)} (was ${fmtMoney0(covExp)}) ${fmtPercent(
          covPct
        )} ${incDecWord(covRen, covExp)}.`
      );
    }

    // Home facts
    if (Number.isFinite(yr)) segments.push(`Home built in ${yr}.`);
    if (Number.isFinite(sqft))
      segments.push(`${sqft.toLocaleString()} square ft.`);

    // Auto-calculated rate change (prefers Coverage A %; else Per DL FT)
    let ratePct = Number.isFinite(covPct) ? covPct : pctChange(ren, exp);
    if (Number.isFinite(ratePct) || rateEffDate) {
      const word = Number.isFinite(ratePct)
        ? ratePct >= 0
          ? "rate increase"
          : "rate decrease"
        : "Rate change";
      const companyPart = rateCompany.trim() ? `${rateCompany.trim()} ` : "";
      const pctStr = `${companyPart}${word}`;

      const eff = rateEffDate ? ` eff:${fmtMMDDYY(rateEffDate)}` : "";
      segments.push(`${pctStr}${eff}.`);
    }

    // Emailed who
    if (emailedWho.trim()) segments.push(`Emailed ${emailedWho.trim()}.`);

    if (!segments.length) {
      alert("Enter at least renewing & expiring premiums or other info.");
      return;
    }

    const msg = segments.join(" ");
    setMessage(msg);
    navigator.clipboard?.writeText(msg).catch(() => {});
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="container text-center">
          {/* Per DL FT */}
          <div className="row">
            <div className="col input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                placeholder="Renewing premium"
                value={renewalValue}
                onChange={(e) => setRenewalValue(e.target.value)}
              />
            </div>
            <div className="col input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                placeholder="Expiring premium"
                value={expiringValue}
                onChange={(e) => setExpiringValue(e.target.value)}
              />
            </div>
          </div>

          {/* Coverage A */}
          <div className="row">
            <div className="col input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                placeholder="Coverage A (renewing)"
                value={covARenewal}
                onChange={(e) => setCovARenewal(e.target.value)}
              />
            </div>
            <div className="col input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                placeholder="Coverage A (expiring)"
                value={covAExpiring}
                onChange={(e) => setCovAExpiring(e.target.value)}
              />
            </div>
          </div>

          {/* Home details */}
          <div className="row">
            <div className="col mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Year built"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
              />
            </div>
            <div className="col mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Square feet"
                value={squareFeet}
                onChange={(e) => setSquareFeet(e.target.value)}
              />
            </div>
          </div>

          {/* NEW: Rate company (appears between % and 'rate increase/decrease') */}
          <div className="row">
            <div className="col mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Rate company (e.g., MIC, DHX)"
                value={rateCompany}
                onChange={(e) => setRateCompany(e.target.value)}
              />
            </div>
          </div>

          {/* Effective date (date input; will print as MM/DD/YY) */}
          <div className="row">
            <div className="col mb-3">
              <input
                type="date"
                className="form-control"
                value={rateEffDate}
                onChange={(e) => setRateEffDate(e.target.value)}
              />
            </div>
          </div>

          {/* Emailed who */}
          <div className="row">
            <div className="col mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Emailed who (e.g., John D.)"
                value={emailedWho}
                onChange={(e) => setEmailedWho(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-center">
          <button type="submit" className="btn btn-primary">
            Generate & Copy
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={resetValues}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="container text-center mt-3">
        <div className="row">
          <div className="col">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default Mercury;

// import React, { useState } from "react";
// import "../../../App.css";

// const Mercury = () => {
//   const [renewalValue, setRenewalValue] = useState("");
//   const [expiringValue, setExpiringValue] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (
//       !isNaN(renewalValue) &&
//       !isNaN(expiringValue) &&
//       renewalValue !== "" &&
//       expiringValue !== ""
//     ) {
//       renewalCalc(renewalValue, expiringValue);
//     } else {
//       alert("Please enter valid numbers for both fields.");
//       resetValues();
//     }
//   };

//   const resetValues = () => {
//     setRenewalValue("");
//     setExpiringValue("");
//     setMessage("");
//   };

//   const renewalCalc = (renewal, expiring) => {
//     let renewalNum = parseFloat(renewal);
//     let expiringNum = parseFloat(expiring);
//     let change = renewalNum - expiringNum;
//     let percentChange = (change / expiringNum) * 100;

//     generateMessage(renewalNum, expiringNum, percentChange);
//   };

//   // Simplified to directly set the message as specified
//   const generateMessage = (renewalNum, expiringNum, percentChange) => {
//     let message = `Per DL FT$${renewalNum.toLocaleString()} (was $${expiringNum.toLocaleString()}) approx ${Math.abs(
//       percentChange.toFixed(2)
//     )}%. MIC rate increase eff:02/25/24. Emailed and diaried`;
//     setMessage(message);
//     copyToClipboard(message);
//   };

//   const copyToClipboard = (message) => {
//     if (navigator.clipboard) {
//       navigator.clipboard.writeText(message).then(
//         () => console.log("Copied to clipboard"),
//         () => console.error("Unable to copy to clipboard")
//       );
//     } else {
//       console.error("Clipboard API not supported");
//     }
//   };

//   return (
//     <div className="App">
//       <form onSubmit={handleSubmit}>
//         <div className="container text-center">
//           <div className="row">
//             <div className="col input-group mb-3 renewing">
//               <span className="input-group-text">$</span>
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="Renewing premium"
//                 aria-label="Amount (to the nearest dollar)"
//                 value={renewalValue}
//                 onChange={(e) => setRenewalValue(e.target.value)}
//                 step="0.01"
//               />
//             </div>
//             <div className="col input-group mb-3 expiring">
//               <span className="input-group-text">$</span>
//               <input
//                 type="number"
//                 className="form-control"
//                 placeholder="Expiring premium"
//                 aria-label="Amount (to the nearest dollar)"
//                 value={expiringValue}
//                 onChange={(e) => setExpiringValue(e.target.value)}
//                 step="0.01"
//               />
//             </div>
//           </div>
//         </div>
//         <button type="submit" className="btn btn-primary mx-auto d-block">
//           Submit
//         </button>
//       </form>
//       <div className="container text-center">
//         <div className="row">
//           <div className="col">{message}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Mercury;
