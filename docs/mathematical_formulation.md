# Mathematical Formulation — Logic & Truth Dungeon

## Symbols
- ∧ : AND
- ∨ : OR
- ¬ : NOT
- → : implication

## Rules used
1. AND (P ∧ Q) is true when both P and Q are true.
2. OR (P ∨ Q) is true when at least one of P and Q is true.
3. NOT (¬P) reverses the truth value of P.
4. Implication P → Q is false when P is true and Q is false.
5. Modus Ponens: P → Q, P ⟹ Q.
6. Modus Tollens: P → Q, ¬Q ⟹ ¬P.
7. Resolution can derive a clause from two clauses containing complementary literals.

## Algorithm
1. Display the current question and its options.
2. Accept one answer from the player.
3. Compare the selected option with the stored correct answer.
4. If correct, add 10 points; otherwise remove one life.
5. Move to the next question and reset the timer.
6. After the final question or when lives reach zero, display the result.
