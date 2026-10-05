import React from "react";
import GraphView from "./GraphView.jsx";
import HasseDiagram from "./HasseDiagram.jsx";

/** Picture shown above multiple-choice questions that refer to a graph or poset. */
export default function QuestionVisual({ question }) {
  if (question.type !== "choice") return null;
  if (question.graph) return <GraphView graph={question.graph} />;
  if (question.poset) return <HasseDiagram spec={question.poset} />;
  return null;
}
