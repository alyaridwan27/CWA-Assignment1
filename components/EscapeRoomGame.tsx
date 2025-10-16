'use client';

import { useState, useEffect } from 'react';
import styles from './EscapeRoomGame.module.css';

const gameStages = [
  {
    id: 1,
    puzzleType: 'code-format',
    title: 'Stage 1: The Messy Function',
    instruction:
      'To unlock the next clue, you must properly format this JavaScript function. Pay close attention to indentation, spacing, and line breaks.',
    code: `function messy(a,b){
if(a>b){return a;
}else{
return b;
}
}`,
    solution: `function messy(a, b) {
  if (a > b) {
    return a;
  } else {
    return b;
  }
}`,
  },
  {
    id: 2,
    puzzleType: 'code-write',
    title: 'Stage 2: The Number Generator',
    instruction:
      'The next lock requires a specific sequence of numbers. Write a JavaScript for-loop that logs all numbers from 0 to 1000, inclusive, to the console.',
    solution: `for (let i = 0; i <= 1000; i++) {
  console.log(i);
}`,
  },
  {
    id: 3,
    puzzleType: 'code-write',
    title: 'Stage 3: The Data Scrambler',
    instruction:
      "The final password is encrypted. Write a JavaScript function named 'reverseString' that takes a string 'str' as an argument and returns the reversed string.",
    solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
  },
];

export default function EscapeRoomGame() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasEscaped, setHasEscaped] = useState(false); // State for the win screen

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setMessage('Time is up! You failed to escape.');
      }
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [isTimerRunning, timeLeft]);

  const handleStartGame = () => {
    setIsTimerRunning(true);
    setHasEscaped(false);
    setTimeLeft(300);
    setCurrentStageIndex(0);
    setMessage('');
    setUserInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStage = gameStages[currentStageIndex];
    const formattedUserInput = userInput.replace(/\s/g, '').replace(/;/g, '');
    const formattedSolution = currentStage.solution.replace(/\s/g, '').replace(/;/g, '');

    if (formattedUserInput === formattedSolution) {
      if (currentStageIndex < gameStages.length - 1) {
        setCurrentStageIndex(currentStageIndex + 1);
        setMessage('Correct! Moving to the next stage.');
        setUserInput('');
      } else {
        setMessage('Congratulations! You have escaped!');
        setIsTimerRunning(false);
        setHasEscaped(true);
      }
    } else {
      setMessage('Incorrect answer. Try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderStage = () => {
    if (hasEscaped) return null;

    const stage = gameStages[currentStageIndex];
    const isCodePuzzle =
      stage.puzzleType === 'code-format' || stage.puzzleType === 'code-write';

    return (
      <>
        <h2 className={styles.stageTitle}>{stage.title}</h2>
        <p className={styles.instruction}>{stage.instruction}</p>
        {stage.puzzleType === 'code-format' && (
          <pre className={styles.codeBlock}>
            <code>{stage.code}</code>
          </pre>
        )}
        {isCodePuzzle ? (
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={styles.textarea}
            placeholder="Enter your code solution here"
            disabled={!isTimerRunning}
            rows={10}
          />
        ) : (
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={styles.input}
            placeholder="Enter your answer"
            disabled={!isTimerRunning}
          />
        )}
      </>
    );
  };

  if (hasEscaped) {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.startScreen}>
          <h1 className={styles.title}>You Escaped!</h1>
          <p>Congratulations, you solved all the puzzles with time to spare.</p>
          <button onClick={handleStartGame} className={styles.button}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Escape the Room</h1>
        <div className={styles.timer}>Time Left: {formatTime(timeLeft)}</div>
      </div>

      {!isTimerRunning && currentStageIndex === 0 ? (
        <div className={styles.startScreen}>
          <p>You have 5 minutes to solve the puzzles and escape. Good luck!</p>
          <button onClick={handleStartGame} className={styles.button}>
            Start Timer
          </button>
        </div>
      ) : (
        <div className={styles.stage}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {renderStage()}
            <button
              type="submit"
              className={styles.button}
              disabled={!isTimerRunning || hasEscaped}
            >
              Submit Answer
            </button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      )}
    </div>
  );
}

