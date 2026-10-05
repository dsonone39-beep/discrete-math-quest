export const logicQuestions = [
  {
    id: 1,
    level: 1,
    topic: "AND",
    question: "If P is True and Q is False, what is P ∧ Q?",
    options: ["True", "False", "Both True and False", "Cannot determine"],
    answer: 1,
    explanation: "AND is true only when both statements are true."
  },
  {
    id: 2,
    level: 1,
    topic: "OR",
    question: "If P is False and Q is True, what is P ∨ Q?",
    options: ["True", "False", "Both", "Cannot determine"],
    answer: 0,
    explanation: "OR is true when at least one statement is true."
  },
  {
    id: 3,
    level: 1,
    topic: "NOT",
    question: "If P is True, what is ¬P?",
    options: ["True", "False", "Both", "Cannot determine"],
    answer: 1,
    explanation: "NOT reverses the truth value."
  },
  {
    id: 4,
    level: 2,
    topic: "Implication",
    question: "For P → Q, when is the implication false?",
    options: [
      "P is True and Q is False",
      "P is False and Q is True",
      "Both are True",
      "Both are False"
    ],
    answer: 0,
    explanation: "An implication is false only when the hypothesis is true and the conclusion is false."
  },
  {
    id: 5,
    level: 2,
    topic: "Truth Table",
    question: "How many rows are needed for a truth table with two propositions P and Q?",
    options: ["2", "3", "4", "8"],
    answer: 2,
    explanation: "Two propositions give 2² = 4 possible truth assignments."
  },
  {
    id: 6,
    level: 2,
    topic: "Truth Table",
    question: "Which connective is represented by ∧?",
    options: ["OR", "AND", "NOT", "Implication"],
    answer: 1,
    explanation: "The symbol ∧ represents logical AND."
  },
  {
    id: 7,
    level: 3,
    topic: "Modus Ponens",
    question: "If P → Q is true and P is true, what follows?",
    options: ["Q is true", "Q is false", "P is false", "Nothing follows"],
    answer: 0,
    explanation: "Modus Ponens has the form P → Q, P, therefore Q."
  },
  {
    id: 8,
    level: 3,
    topic: "Modus Ponens",
    question: "Which argument has the form of Modus Ponens?",
    options: [
      "P → Q, P, therefore Q",
      "P → Q, ¬Q, therefore ¬P",
      "P → Q, Q, therefore P",
      "P → Q, ¬P, therefore ¬Q"
    ],
    answer: 0,
    explanation: "Modus Ponens uses an implication and confirms its antecedent."
  },
  {
    id: 9,
    level: 4,
    topic: "Modus Tollens",
    question: "If P → Q and ¬Q are true, what follows by Modus Tollens?",
    options: ["P", "¬P", "Q", "Nothing"],
    answer: 1,
    explanation: "Modus Tollens has the form P → Q, ¬Q, therefore ¬P."
  },
  {
    id: 10,
    level: 4,
    topic: "Modus Tollens",
    question: "Which argument is Modus Tollens?",
    options: [
      "P → Q, P, therefore Q",
      "P → Q, ¬Q, therefore ¬P",
      "P → Q, Q, therefore P",
      "P ∧ Q, therefore P"
    ],
    answer: 1,
    explanation: "Modus Tollens rejects the consequent and therefore rejects the antecedent."
  },
  {
    id: 11,
    level: 5,
    topic: "Resolution",
    question: "What is the main idea of the resolution rule?",
    options: [
      "Combine clauses containing complementary literals",
      "Negate every proposition",
      "Make every proposition true",
      "Create a truth table"
    ],
    answer: 0,
    explanation: "Resolution derives a new clause by resolving complementary literals."
  },
  {
    id: 12,
    level: 5,
    topic: "Resolution",
    question: "From (P ∨ Q) and (¬P ∨ R), what clause can resolution derive?",
    options: ["Q ∨ R", "P ∨ R", "¬Q ∨ R", "P ∧ Q"],
    answer: 0,
    explanation: "Resolving P and ¬P gives Q ∨ R."
  },
  {
    id: 13,
    level: 6,
    topic: "Mixed Logic",
    question: "If P = False and Q = False, what is P ∨ Q?",
    options: ["True", "False", "Both", "Cannot determine"],
    answer: 1,
    explanation: "OR is false when both inputs are false."
  },
  {
    id: 14,
    level: 6,
    topic: "Mixed Logic",
    question: "If P = True and Q = True, what is P ∧ Q?",
    options: ["True", "False", "Both", "Cannot determine"],
    answer: 0,
    explanation: "AND is true when both inputs are true."
  },
  {
    id: 15,
    level: 6,
    topic: "Mixed Logic",
    question: "If P → Q is true and P is true, which statement is necessarily true?",
    options: ["Q is true", "Q is false", "P is false", "¬Q is true"],
    answer: 0,
    explanation: "By Modus Ponens, Q must be true."
  },
  {
    id: 16,
    level: 6,
    topic: "Mixed Logic",
    question: "If P → Q is true and Q is false, which conclusion follows?",
    options: ["P is true", "P is false", "Q is true", "No conclusion"],
    answer: 1,
    explanation: "By Modus Tollens, ¬P follows."
  },
  {
    id: 17,
    level: 6,
    topic: "Mixed Logic",
    question: "Which symbol means logical NOT?",
    options: ["∨", "∧", "¬", "→"],
    answer: 2,
    explanation: "The symbol ¬ represents logical NOT."
  },
  {
    id: 18,
    level: 6,
    topic: "Mixed Logic",
    question: "Which symbol means implication?",
    options: ["∧", "∨", "¬", "→"],
    answer: 3,
    explanation: "The symbol → represents implication."
  },
  {
    id: 19,
    level: 6,
    topic: "Mixed Logic",
    question: "For three propositions, how many rows are required in a complete truth table?",
    options: ["3", "6", "8", "9"],
    answer: 2,
    explanation: "Three propositions give 2³ = 8 possible truth assignments."
  },
  {
    id: 20,
    level: 6,
    topic: "Mixed Logic",
    question: "Which rule concludes Q from P → Q and P?",
    options: ["Modus Tollens", "Modus Ponens", "Resolution", "Negation"],
    answer: 1,
    explanation: "This is the standard Modus Ponens form."
  }
];