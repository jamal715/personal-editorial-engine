"use client";

import { useState } from "react";

const data: Record<string, {label:string; value:number}[]> = {
  Pakistan: [
    {label:"2019", value:44},{label:"2020", value:49},{label:"2021", value:57},{label:"2022", value:61},{label:"2023", value:68}
  ],
  India: [
    {label:"2019", value:55},{label:"2020", value:60},{label:"2021", value:65},{label:"2022", value:72},{label:"2023", value:78}
  ],
  Vietnam: [
    {label:"2019", value:48},{label:"2020", value:54},{label:"2021", value:63},{label:"2022", value:75},{label:"2023", value:84}
  ]
};

export default function InteractiveCountryChart() {
  const [country, setCountry] = useState("Pakistan");
  const values = data[country];
  const max = Math.max(...values.map(d => d.value));

  return (
    <figure className="chart-card">
      <div className="chart-head">
        <div>
          <h3>Example interactive indicator</h3>
          <div className="source-note">Illustrative data only — the chart component is wired for reader selection.</div>
        </div>
        <label>
          <span className="source-note">Country</span><br/>
          <select value={country} onChange={e => setCountry(e.target.value)}>
            {Object.keys(data).map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      {values.map(row => (
        <div className="bar-row" key={row.label}>
          <span>{row.label}</span>
          <div className="bar-track"><div className="bar-fill" style={{width: `${(row.value / max) * 100}%`}} /></div>
          <strong>{row.value}</strong>
        </div>
      ))}
      <figcaption className="source-note">Source label will be suggested by the editor and remain editable before publication.</figcaption>
    </figure>
  );
}
