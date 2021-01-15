# TicTacToe Minimax-AI-Player
A simple TicTacToe Game between human and ai-player. It was written in HTML, CSS and JavaScript/TypeScript.
The ai-player is based on the MiniMax-algorithm which is usually used in these kinds of games.

## Getting started
#### How to play a game
* Clone the repository
* open the `index.html` file
* Choose your difficulty (beginner, medium, difficult, invincible)
* Choose your preferred mode (dark, light)
* Click on 'Start game'
* Have fun!

## Minimax-algorithm
![Minimax-algorithm](https://static.javatpoint.com/tutorial/ai/images/mini-max-algorithm-in-ai-step1.png)
#### Algorithm
The minimax algorithm is commonly used in those games. The idea is to generate all possible turns based on the actual state until the specified depth is raeched.
If the depth is reached, the leafs are evaluated by an evaluation function. Depending on being the maximizing (you) or minimizing (enemy) node, the maximum/minimum of the children is taken.

#### Evaluation function
The evaluation function is quite simple. If you win, the board gets a value of 100. If you lose, it gets -100 and if nobody has won, it gets 0.
As we want to take the turn that brings us the fastest win, the board value is added/substrated by the actual depth of the node

