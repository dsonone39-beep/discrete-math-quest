// Graph Theory Pathfinder questions. Path questions are checked by graphAlgorithms.js.
const graph = (nodes, edges) => ({ nodes: nodes.map(([id, x, y]) => ({ id, x, y })), edges });

// Small graph used in several easy questions.
const G1 = graph([["A", 60, 140], ["B", 170, 50], ["C", 170, 230], ["D", 290, 140], ["E", 380, 140]],
  [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"], ["D", "E"]]);
// A small tree.
const G6 = graph([["A", 210, 40], ["B", 110, 130], ["C", 310, 130], ["D", 110, 230], ["E", 310, 230]],
  [["A", "B"], ["A", "C"], ["B", "D"], ["C", "E"]]);
// Traversal graph.
const G2 = graph([["A", 50, 140], ["B", 150, 60], ["C", 150, 230], ["D", 260, 40], ["E", 260, 140], ["F", 370, 230]],
  [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["E", "F"]]);
// Bow-tie: every vertex has even degree, so an Eulerian circuit exists.
const G3 = graph([["A", 60, 60], ["B", 60, 220], ["C", 210, 140], ["D", 360, 60], ["E", 360, 220]],
  [["A", "B"], ["B", "C"], ["A", "C"], ["C", "D"], ["D", "E"], ["C", "E"]]);
// Hexagon with two chords.
const G4 = graph([["A", 210, 30], ["B", 330, 100], ["C", 330, 200], ["D", 210, 260], ["E", 90, 200], ["F", 90, 100]],
  [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], ["E", "F"], ["A", "F"], ["B", "E"], ["C", "F"]]);
// K(2,3): has a Hamiltonian path but no Hamiltonian cycle.
const G5 = graph([["A", 130, 60], ["B", 290, 60], ["C", 60, 220], ["D", 210, 220], ["E", 360, 220]],
  [["A", "C"], ["A", "D"], ["A", "E"], ["B", "C"], ["B", "D"], ["B", "E"]]);

export const graphQuestions = [
  // ---- Easy ----
  { id: "g01", type: "choice", difficulty: "easy", topic: "Basics", graph: G1,
    text: "How many edges does this graph have?",
    options: ["4", "5", "6", "10"], answer: 1,
    hint: "Count the lines between vertices.",
    explanation: "The edges are AB, AC, BD, CD and DE: 5 in total." },
  { id: "g02", type: "choice", difficulty: "easy", topic: "Degree", graph: G1,
    text: "What is the degree of vertex D?",
    options: ["1", "2", "3", "4"], answer: 2,
    hint: "Degree = number of edges that meet at the vertex.",
    explanation: "D is joined to B, C and E, so deg(D) = 3." },
  { id: "g03", type: "choice", difficulty: "easy", topic: "Degree",
    text: "A graph has 7 edges. What is the sum of all its vertex degrees?",
    options: ["7", "14", "21", "49"], answer: 1,
    hint: "Every edge has two ends (Handshaking Lemma).",
    explanation: "Sum of degrees = 2 × (number of edges) = 14." },
  { id: "g04", type: "path", mode: "shortest", difficulty: "easy", topic: "Shortest path", graph: G1, start: "A", end: "E",
    text: "Click the vertices of a shortest path from A to E, in order.",
    hint: "Fewest edges wins. Try going through B or C, then D.",
    explanation: "A → B → D → E (or A → C → D → E) uses 3 edges, and no shorter route exists." },
  { id: "g05", type: "choice", difficulty: "easy", topic: "Basics",
    text: "A closed path that repeats no vertex except its start and end is called a…",
    options: ["Cycle", "Tree", "Euler trail", "Forest"], answer: 0,
    hint: "It comes back to where it began.",
    explanation: "A cycle is a closed path with no repeated vertices other than the first and last." },
  { id: "g06", type: "path", mode: "bfs", difficulty: "easy", topic: "BFS", graph: G6, start: "A",
    text: "Click the vertices in the order Breadth-First Search visits them, starting at A (take neighbours in alphabetical order).",
    hint: "BFS visits all neighbours of a vertex before going deeper.",
    explanation: "BFS goes level by level: A, then B and C, then D and E." },

  // ---- Medium ----
  { id: "g07", type: "path", mode: "bfs", difficulty: "medium", topic: "BFS", graph: G2, start: "A",
    text: "Click the vertices in Breadth-First Search order from A (alphabetical neighbours).",
    hint: "Use a queue: visit A, then A's neighbours, then their new neighbours.",
    explanation: "Levels: {A}, {B, C}, {D, E, F}. So the order is A, B, C, D, E, F." },
  { id: "g08", type: "path", mode: "dfs", difficulty: "medium", topic: "DFS", graph: G2, start: "A",
    text: "Click the vertices in Depth-First Search order from A (alphabetical neighbours).",
    hint: "Go as deep as possible first; backtrack only at a dead end.",
    explanation: "A → B → D (dead end) → back to B → E → F → C. Order: A, B, D, E, F, C." },
  { id: "g09", type: "choice", difficulty: "medium", topic: "Eulerian",
    text: "A connected graph has an Eulerian circuit exactly when…",
    options: ["every vertex has even degree", "exactly two vertices have odd degree", "every vertex has degree at least n/2", "it contains no cycles"], answer: 0,
    hint: "Each time the circuit enters a vertex it must leave again.",
    explanation: "Euler's theorem: a connected graph has an Eulerian circuit iff every vertex has even degree." },
  { id: "g10", type: "path", mode: "euler", circuit: true, difficulty: "medium", topic: "Eulerian", graph: G3, start: "A",
    solution: ["A", "B", "C", "D", "E", "C", "A"],
    text: "Find an Eulerian circuit: start at A, use every edge exactly once, and return to A.",
    hint: "C has degree 4, so you will pass through it twice.",
    explanation: "For example A → B → C → D → E → C → A uses all 6 edges once." },
  { id: "g11", type: "choice", difficulty: "medium", topic: "Eulerian",
    text: "A connected graph has an Euler trail that is NOT a circuit exactly when it has how many vertices of odd degree?",
    options: ["0", "1", "2", "4"], answer: 2,
    hint: "The trail must start at one odd vertex and end at another.",
    explanation: "Exactly two odd-degree vertices: the trail starts at one and ends at the other." },

  // ---- Hard ----
  { id: "g12", type: "path", mode: "hamilton", cycle: true, difficulty: "hard", topic: "Hamiltonian", graph: G4, start: "A",
    solution: ["A", "B", "C", "D", "E", "F", "A"],
    text: "Find a Hamiltonian cycle: start at A, visit every vertex exactly once, and return to A.",
    hint: "The outer ring is one option, but the chords also allow other cycles.",
    explanation: "A → B → C → D → E → F → A visits all six vertices once (other cycles exist too)." },
  { id: "g13", type: "path", mode: "hamilton", cycle: false, difficulty: "hard", topic: "Hamiltonian", graph: G5,
    solution: ["C", "A", "D", "B", "E"],
    text: "Find a Hamiltonian path: visit every vertex exactly once (any start, no need to return).",
    hint: "Edges only join the top row to the bottom row, so alternate between them.",
    explanation: "C → A → D → B → E alternates sides and visits all five vertices." },
  { id: "g14", type: "choice", difficulty: "hard", topic: "Hamiltonian", graph: G5,
    text: "Does this graph have a Hamiltonian cycle?",
    options: ["Yes: A–C–B–D–E–A", "Yes, several", "No: a cycle must alternate sides, but one side has 3 vertices and the other only 2", "No: the graph is not connected"], answer: 2,
    hint: "Every edge joins the top row to the bottom row.",
    explanation: "A cycle alternates between the two sides, so both sides need the same number of vertices. Here 2 ≠ 3." },
  { id: "g15", type: "choice", difficulty: "hard", topic: "Hamiltonian",
    text: "Dirac's theorem: a simple graph with n ≥ 3 vertices in which every vertex has degree at least n/2 must be…",
    options: ["Hamiltonian", "Eulerian", "a tree", "bipartite"], answer: 0,
    hint: "It is a sufficient condition for a cycle through every vertex.",
    explanation: "Dirac (1952): minimum degree ≥ n/2 guarantees a Hamiltonian cycle." }
];
