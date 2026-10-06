# Software Architecture — Member 1

```text
App
 |
 +-- Navbar
 |
 +-- Pages
 |    +-- Home
 |    +-- Game Selection
 |    +-- Instructions
 |    +-- Result
 |
 +-- Common Components
 |    +-- Score
 |    +-- Timer
 |    +-- Lives
 |    +-- Progress
 |
 +-- Logic & Truth Dungeon
      +-- LogicGame
      +-- logicQuestions
```

The React UI calls the LogicGame component. LogicGame reads the question data, checks answers, updates score/lives/timer and sends the final result to the Result page. The other team modules can be connected through Game Selection during final integration.
