import React, { useCallback, useMemo } from "react";
import ReactFlow, { Background, ConnectionMode, Controls, Handle, Position, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { buildPoset, layoutPoset, pairKey } from "../../games/hasse/hasseUtils.js";

const NODE_W = 64;
const NODE_H = 40;

function HasseNode({ data }) {
  return (
    <div className="hasse-node">
      <Handle id="t" type="source" position={Position.Top} />
      <span>{data.label}</span>
      <Handle id="b" type="source" position={Position.Bottom} />
    </div>
  );
}
const nodeTypes = { hasse: HasseNode }; // defined once, outside the component

/** Hasse questions: drag from a dot on one element to a dot on another to draw a cover edge (React Flow). */
export default function HasseAnswer({ question, locked, onSubmit }) {
  const { nodes, pos, height } = useMemo(() => {
    const poset = buildPoset(question.poset);
    const layout = layoutPoset(poset, { gapX: 100, gapY: 90, pad: 50 });
    return {
      pos: layout.pos,
      height: layout.height + 30,
      nodes: poset.items.map((item) => ({
        id: item.id, type: "hasse", data: { label: item.label }, draggable: false,
        position: { x: layout.pos[item.id].x - NODE_W / 2, y: layout.pos[item.id].y - NODE_H / 2 }
      }))
    };
  }, [question]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((c) => {
    if (locked || !c.source || !c.target || c.source === c.target) return;
    const [lower, upper] = pos[c.source].y >= pos[c.target].y ? [c.source, c.target] : [c.target, c.source];
    const key = pairKey(lower, upper);
    setEdges((eds) => (eds.some((e) => pairKey(e.source, e.target) === key)
      ? eds
      : [...eds, { id: `e-${key}`, source: lower, target: upper, sourceHandle: "t", targetHandle: "b", type: "straight" }]));
  }, [locked, pos, setEdges]);

  return (
    <>
      <p className="meta-line">
        Drag from a dot on one element to a dot on another to draw an edge. Draw only <b>cover</b> edges: leave out any edge that
        follows from transitivity. Select an edge and press Backspace to delete it.
      </p>
      <div className="flow-box" style={{ height: Math.max(260, height) }}>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          onEdgesChange={onEdgesChange} onConnect={onConnect}
          connectionMode={ConnectionMode.Loose}
          nodesDraggable={false} nodesConnectable={!locked} elementsSelectable={!locked}
          deleteKeyCode={locked ? null : ["Backspace", "Delete"]}
          zoomOnScroll={false} preventScrolling={false} fitView fitViewOptions={{ padding: 0.25 }}>
          <Background gap={20} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <p className="meta-line" aria-live="polite">{edges.length} edge{edges.length === 1 ? "" : "s"} drawn</p>
      <div className="button-row">
        <button className="secondary-btn" disabled={locked || !edges.length} onClick={() => setEdges((e) => e.slice(0, -1))}>Remove last edge</button>
        <button className="secondary-btn" disabled={locked || !edges.length} onClick={() => setEdges([])}>Clear</button>
        <button className="primary-btn" disabled={locked || !edges.length} onClick={() => onSubmit(edges.map((e) => [e.source, e.target]))}>Check answer</button>
      </div>
    </>
  );
}
