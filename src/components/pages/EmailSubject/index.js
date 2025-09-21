import React, { useState } from "react";
import "../../../App.css";

// Format YYYY-MM-DD (from <input type="date" />) to MM/DD/YY
const fmtMMDDYY = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
};

const EmailSubject = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [effDate, setEffDate] = useState(""); // YYYY-MM-DD
  const [subject, setSubject] = useState("");

  const reset = () => {
    setLastName("");
    setFirstName("");
    setPolicyNumber("");
    setEffDate("");
    setSubject("");
  };

  const handleGenerate = (e) => {
    e.preventDefault();

    const ln = lastName.trim();
    const fn = firstName.trim();
    const pn = policyNumber.trim();
    const eff = fmtMMDDYY(effDate);

    // Name: "Last, First" (handles missing pieces gracefully)
    const name = ln && fn ? `${ln}, ${fn}` : ln ? ln : fn ? fn : "";

    const policyPart = pn ? ` - ${pn}` : "";
    const tagPart = " (ren.prem.over.threshold)"; // always included
    const effPart = eff ? ` eff:${eff}` : ""; // no space after colon

    const full = `${name}${policyPart}${tagPart}${effPart}`.trim();

    setSubject(full);
    if (full) {
      navigator.clipboard?.writeText(full).catch(() => {});
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleGenerate} noValidate>
        <div className="container text-center">
          <div className="row">
            <div className="col mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="col mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Policy number"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
              />
            </div>
            <div className="col mb-3">
              <input
                type="date"
                className="form-control"
                value={effDate}
                onChange={(e) => setEffDate(e.target.value)}
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
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="container text-center mt-3">
        <div className="row">
          <div className="col">{subject}</div>
        </div>
      </div>
    </div>
  );
};

export default EmailSubject;
