# Member 1 Testing — Logic & Truth Dungeon

| Test | Input/Action | Expected Output | Actual Output | Status |
|---|---|---|---|---|
| 1 | Select correct answer | Score increases by 10 | Score increases by 10 | Pass |
| 2 | Select wrong answer | One life is lost | One life is lost | Pass |
| 3 | Timer reaches 0 | Answer is treated as incorrect | Answer is treated as incorrect | Pass |
| 4 | Complete all questions | Result page appears | Result page appears | Pass |
| 5 | Click Play Again | Logic game starts again | Logic game starts again | Pass |
| 6 | Click Exit | Return to game selection | Return to game selection | Pass |
| 7 | Select correct option after lock | No second submission | Button remains disabled | Pass |
| 8 | Last question | Final score is calculated | Result page shows final score | Pass |

## Edge cases
- Timer expires before an answer is selected.
- Player loses all lives before completing all questions.
- Player attempts to click an option after the question is locked.
- Result page is reached after the final question.
