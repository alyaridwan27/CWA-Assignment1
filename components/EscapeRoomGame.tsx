'use client';

import { useState, useEffect } from 'react';
import { X, Lock, Unlock, CheckCircle, Play, RotateCcw, ArrowLeft, Loader2 } from 'lucide-react';
import styles from './EscapeRoomGame.module.css';

// Define the Puzzle type to match what we save in the database
type Puzzle = {
  id: number;
  x: number;
  y: number;
  name: string;
  instruction: string;
  type: 'format' | 'write' | 'text';
  code: string;
  solution: string;
};

// Define the Room type
type EscapeRoom = {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  timerSeconds: number;
  puzzles: Puzzle[];
};

export default function EscapeRoomGame() {
  // Game State
  const [rooms, setRooms] = useState<EscapeRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<EscapeRoom | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'start' | 'playing' | 'won' | 'lost'>('menu');
  const [isLoading, setIsLoading] = useState(true);
  
  // Gameplay State
  const [timeLeft, setTimeLeft] = useState(300);
  const [solvedPuzzles, setSolvedPuzzles] = useState<number[]>([]); // Array of solved puzzle IDs
  const [activePuzzleId, setActivePuzzleId] = useState<number | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  // Fetch available rooms on mount
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('/api/escape-rooms');
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (error) {
        console.error("Failed to load rooms", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRooms();
  }, []);

  // Timer Logic
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    if (timeLeft <= 0) {
      setGameState('lost');
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const selectRoom = (room: EscapeRoom) => {
    setSelectedRoom(room);
    setGameState('start');
    setTimeLeft(room.timerSeconds);
    setSolvedPuzzles([]);
  };

  const handleStart = () => {
    setGameState('playing');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setSelectedRoom(null);
    setSolvedPuzzles([]);
  };

  const openPuzzle = (puzzle: Puzzle) => {
    // If already solved, do nothing (or maybe show success)
    if (solvedPuzzles.includes(puzzle.id)) return;

    setActivePuzzleId(puzzle.id);
    setUserInput('');
    setFeedback('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePuzzleId === null || !selectedRoom) return;

    const currentPuzzle = selectedRoom.puzzles.find((p) => p.id === activePuzzleId);
    if (!currentPuzzle) return;

    // Normalize strings for comparison
    const normalize = (str: string) => str.replace(/\s/g, '').replace(/;/g, '');
    
    if (normalize(userInput) === normalize(currentPuzzle.solution)) {
      // Correct!
      const newSolved = [...solvedPuzzles, activePuzzleId];
      setSolvedPuzzles(newSolved);
      setActivePuzzleId(null); // Close modal

      // Check win condition: Are all puzzles solved?
      if (newSolved.length === selectedRoom.puzzles.length) {
        setGameState('won');
      }
    } else {
      setFeedback('Incorrect answer. Try again.');
    }
  };

  const activePuzzle = selectedRoom?.puzzles.find((p) => p.id === activePuzzleId);

  // --- RENDER: LOADING ---
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
        <p>Loading Escape Rooms...</p>
      </div>
    );
  }

  // --- RENDER: ROOM SELECTION MENU ---
  if (gameState === 'menu') {
    return (
      <div className={styles.menuContainer}>
        <h1 className={styles.menuTitle}>Choose Your Adventure</h1>
        <div className={styles.roomGrid}>
          {rooms.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No escape rooms found.</p>
              <a href="/escape-room/create" className={styles.createButton}>Create One Now</a>
            </div>
          ) : (
            rooms.map(room => (
              <div key={room.id} className={styles.roomCard} onClick={() => selectRoom(room)}>
                <div 
                  className={styles.roomCardImage} 
                  style={{ backgroundImage: `url(${room.backgroundImage})` }}
                />
                <div className={styles.roomCardContent}>
                  <h3>{room.title}</h3>
                  <p>{room.description}</p>
                  <span className={styles.roomMeta}>{room.puzzles.length} Puzzles • {Math.floor(room.timerSeconds / 60)} Mins</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.menuFooter}>
           <a href="/escape-room/create" className={styles.createLink}>+ Build a New Room</a>
        </div>
      </div>
    );
  }

  // --- RENDER: GAMEPLAY ---
  if (!selectedRoom) return null;

  return (
    <div className={styles.gameContainer} style={{ 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${selectedRoom.backgroundImage})`,
      backgroundColor: '#1f2937' // Fallback
    }}>
      {/* HUD */}
      <div className={styles.hud}>
        <button onClick={handleBackToMenu} className={styles.backButton}>
          <ArrowLeft size={20} /> Exit
        </button>
        <div className={styles.title}>{selectedRoom.title}</div>
        <div className={styles.timer}>Time: {formatTime(timeLeft)}</div>
      </div>

      {/* Game Scene - Only visible when playing */}
      {gameState === 'playing' && (
        <>
          {selectedRoom.puzzles.map((puzzle) => {
            const isSolved = solvedPuzzles.includes(puzzle.id);
            return (
              <div 
                key={puzzle.id}
                className={`${styles.hotspot} ${isSolved ? styles.solved : ''}`}
                style={{ left: `${puzzle.x}%`, top: `${puzzle.y}%` }}
                onClick={() => openPuzzle(puzzle)}
                title={puzzle.name}
              >
                {isSolved ? <CheckCircle size={24} /> : <Lock size={24} />}
              </div>
            );
          })}
        </>
      )}

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className={styles.startScreen}>
          <h1>{selectedRoom.title}</h1>
          <p>{selectedRoom.description}</p>
          <button onClick={handleStart} className={styles.bigButton}>
            <Play size={24} style={{marginRight: '8px'}}/> Start Game
          </button>
        </div>
      )}

      {/* Win Screen */}
      {gameState === 'won' && (
        <div className={styles.winScreen}>
          <h1>ESCAPE SUCCESSFUL!</h1>
          <p>You solved all puzzles with {formatTime(timeLeft)} remaining.</p>
          <button onClick={handleBackToMenu} className={styles.bigButton}>
            Back to Menu
          </button>
        </div>
      )}

      {/* Lose Screen */}
      {gameState === 'lost' && (
        <div className={styles.winScreen}>
          <h1>TIME UP</h1>
          <p>You failed to escape in time.</p>
          <button onClick={() => setGameState('start')} className={styles.bigButton}>
             <RotateCcw size={24} style={{marginRight: '8px'}}/> Try Again
          </button>
          <button onClick={handleBackToMenu} style={{marginTop: '1rem', background: 'transparent', border: '1px solid white', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer'}}>
             Give Up
          </button>
        </div>
      )}

      {/* Puzzle Modal */}
      {activePuzzleId !== null && activePuzzle && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setActivePuzzleId(null)}><X /></button>
            <h2 className={styles.puzzleTitle}>{activePuzzle.name}</h2>
            <p style={{marginBottom: '1rem'}}>{activePuzzle.instruction}</p>
            
            {activePuzzle.code && (
              <pre className={styles.codeBlock}>{activePuzzle.code}</pre>
            )}

            <form onSubmit={handleSubmit}>
              {activePuzzle.type === 'format' || activePuzzle.type === 'write' ? (
                <textarea 
                  className={styles.textarea} 
                  rows={8} 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your code here..."
                />
              ) : (
                <input 
                  className={styles.input} 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Your answer..."
                />
              )}
              {feedback && <p style={{color: '#ef4444', marginBottom: '1rem'}}>{feedback}</p>}
              <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}