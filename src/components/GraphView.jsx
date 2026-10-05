import React from "react";
import { edgeKey } from "../games/graph/graphAlgorithms.js";

/** SVG drawing of a graph. With onNodeClick the vertices become buttons; `path` highlights the chosen walk. */
export default function GraphView({ graph, path = [], start = null, onNodeClick = null, disabled = false }) {
  const pos = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));
  const onEdges = new Set();
  for (let i = 0; i < path.length - 1; i++) onEdges.add(edgeKey(path[i], path[i + 1]));
  const visits = {};
  path.forEach((id, i) => { (visits[id] = visits[id] || []).push(i + 1); });
  const interactive = !!onNodeClick && !disabled;

  return (
    <div className="graph-box">
      <svg className="graph-svg" viewBox="0 0 440 280" role="img" aria-label="Graph diagram">
        {graph.edges.map(([a, b]) => (
          <line key={edgeKey(a, b)} className={`g-edge${onEdges.has(edgeKey(a, b)) ? " on" : ""}`}
            x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} />
        ))}
        {graph.nodes.map((n) => (
          <g key={n.id}
            className={`g-node${interactive ? " clickable" : ""}${visits[n.id] ? " on" : ""}${start === n.id ? " start" : ""}`}
            transform={`translate(${n.x} ${n.y})`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={`Vertex ${n.id}`}
            onClick={interactive ? () => onNodeClick(n.id) : undefined}
            onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNodeClick(n.id); } } : undefined}>
            <circle r="20" />
            <text>{n.id}</text>
            {visits[n.id] && <text className="g-step" x="22" y="-18">{visits[n.id].join(",")}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}
