import React from "react";
import { buildPoset, coverPairs, layoutPoset } from "../games/hasse/hasseUtils.js";

/** Static Hasse diagram (SVG) used to illustrate multiple-choice questions. */
export default function HasseDiagram({ spec }) {
  const poset = buildPoset(spec);
  const { pos, width, height } = layoutPoset(poset, { gapX: 80, gapY: 70, pad: 34 });
  return (
    <div className="graph-box">
      <svg className="graph-svg" viewBox={`0 0 ${width} ${height}`} style={{ maxHeight: 300 }} role="img" aria-label="Hasse diagram">
        {coverPairs(poset).map(([a, b]) => (
          <line key={`${a}-${b}`} className="g-edge" x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} />
        ))}
        {poset.items.map((item) => (
          <g key={item.id} className="g-node" transform={`translate(${pos[item.id].x} ${pos[item.id].y})`}>
            <circle r="19" />
            <text style={{ fontSize: item.label.length > 3 ? 11 : 15 }}>{item.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
