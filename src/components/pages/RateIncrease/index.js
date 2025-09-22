import React, { useState } from "react";
import "../../../App.css";

// Format money as $1234.56 (always 2 decimal places, no currency code)
const fmtMoney = (n) =>
  `$${Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtPercent = (fraction) =>
  `${Number.isFinite(fraction) ? (fraction * 100).toFixed(2) : "0.00"}%`;

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

const RateIncrease = () => {
  const [renewalValue, setRenewalValue] = useState("");
  const [expiringValue, setExpiringValue] = useState("");
  const [covARenewal, setCovARenewal] = useState("");
  const [covAExpiring, setCovAExpiring] = useState("");
  const [deductible, setDeductible] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [rateCompany, setRateCompany] = useState("");
  const [rateEffDate, setRateEffDate] = useState("");
  const [emailedWho, setEmailedWho] = useState("");
  const [message, setMessage] = useState("");

  const resetValues = () => {
    setRenewalValue("");
    setExpiringValue("");
    setCovARenewal("");
    setCovAExpiring("");
    setDeductible("");
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
    const ded = parseFloat(deductible);
    const sqft = parseFloat(squareFeet);
    const yr = parseInt(yearBuilt, 10);

    const segments = [];

    // Per DL FT
    if (Number.isFinite(ren) && Number.isFinite(exp)) {
      const perPct = pctChange(ren, exp);
      segments.push(
        `Per DL FT ${fmtMoney(ren)} (was ${fmtMoney(exp)}) approx ${fmtPercent(
          perPct
        )} ${incDecWord(ren, exp)}.`
      );
    }

    // Coverage A
    let covPct = NaN;
    if (Number.isFinite(covRen) && Number.isFinite(covExp)) {
      covPct = pctChange(covRen, covExp);
      segments.push(
        `Cov.A at ${fmtMoney(covRen)} (was ${fmtMoney(covExp)}) ${fmtPercent(
          covPct
        )} ${incDecWord(covRen, covExp)}.`
      );
    }

    // Deductible
    if (Number.isFinite(ded)) {
      segments.push(`${fmtMoney(ded)} deductible.`);
    }

    // Home built
    if (Number.isFinite(yr)) segments.push(`Home built in ${yr}.`);

    // Square feet
    if (Number.isFinite(sqft))
      segments.push(`${sqft.toLocaleString()} square ft.`);

    // Rate company + effective date
    const haveRateMeta = rateCompany.trim() || rateEffDate;
    if (haveRateMeta) {
      let ratePct = Number.isFinite(covPct) ? covPct : pctChange(ren, exp);
      const word = Number.isFinite(ratePct)
        ? ratePct >= 0
          ? "rate increase"
          : "rate decrease"
        : "Rate change";
      const companyPart = rateCompany.trim() ? `${rateCompany.trim()} ` : "";
      const eff = rateEffDate ? ` eff:${fmtMMDDYY(rateEffDate)}` : "";
      segments.push(`${companyPart}${word}${eff}.`);
    }

    // Emailed
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
          {/* Renewing / Expiring premiums */}
          <div className="row">
            <div className="col input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                type="number"
                step="0.01"
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
                step="0.01"
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
                step="0.01"
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
                step="0.01"
                className="form-control"
                placeholder="Coverage A (expiring)"
                value={covAExpiring}
                onChange={(e) => setCovAExpiring(e.target.value)}
              />
            </div>
          </div>

          {/* Deductible */}
          <div className="row">
            <div className="col input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Deductible"
                value={deductible}
                onChange={(e) => setDeductible(e.target.value)}
              />
            </div>
          </div>

          {/* Year built and Square feet */}
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

          {/* Rate company */}
          <div className="row">
            <div className="col mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Rate company (e.g., MIC, SAI)"
                value={rateCompany}
                onChange={(e) => setRateCompany(e.target.value)}
              />
            </div>
          </div>

          {/* Effective date */}
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

export default RateIncrease;
