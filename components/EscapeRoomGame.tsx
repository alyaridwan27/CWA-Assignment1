'use client';

import { useState, useEffect } from 'react';
import {
  X, Lock, CheckCircle, Play, RotateCcw, ArrowLeft,
  Loader2, Pencil, Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './EscapeRoomGame.module.css';

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

type EscapeRoom = {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  timerSeconds: number;
  puzzles: Puzzle[];
};

export default function EscapeRoomGame() {
  const router = useRouter();

  const [rooms, setRooms] = useState<EscapeRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<EscapeRoom | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'start' | 'playing' | 'won' | 'lost'>('menu');
  const [isLoading, setIsLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(300);
  const [solvedPuzzles, setSolvedPuzzles] = useState<number[]>([]);
  const [activePuzzleId, setActivePuzzleId] = useState<number | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadRooms = async () => {
    try {
      const res = await fetch('/api/escape-rooms');
      if (res.ok) {
        setRooms(await res.json());
      }
    } catch {
      console.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadRooms(); }, []);

  // ---------------- TIMER ----------------
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('lost');
      return;
    }

    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ---------------- MENU ACTIONS ----------------
  const selectRoom = (room: EscapeRoom) => {
    setSelectedRoom(room);
    setGameState('start');
    setSolvedPuzzles([]);
    setTimeLeft(room.timerSeconds);
  };

  const deleteRoom = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this room?')) return;

    const res = await fetch(`/api/escape-rooms/${id}`, { method: 'DELETE' });

    if (res.ok) {
      alert('Room deleted');
      loadRooms();
    } else {
      alert('Failed to delete');
    }
  };

  const editRoom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/escape-room/create?id=${id}`);
  };

  // ---------------- GAME ACTIONS ----------------
  const handleStart = () => setGameState('playing');
  const handleBackToMenu = () => {
    setGameState('menu');
    setSelectedRoom(null);
    setSolvedPuzzles([]);
  };

  const openPuzzle = (p: Puzzle) => {
    if (solvedPuzzles.includes(p.id)) return;
    setFeedback('');
    setUserInput('');
    setActivePuzzleId(p.id);
  };

  const activePuzzle = selectedRoom?.puzzles.find(p => p.id === activePuzzleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activePuzzle) return;

    const normalize = (s: string) => s.replace(/\s/g, '').replace(/;/g, '');

    if (normalize(userInput) === normalize(activePuzzle.solution)) {
      const solved = [...solvedPuzzles, activePuzzle.id];
      setSolvedPuzzles(solved);
      setActivePuzzleId(null);

      if (solved.length === selectedRoom!.puzzles.length) {
        setGameState('won');
      }
    } else {
      setFeedback('Incorrect answer. Try again.');
    }
  };

  // ---------------- LOADING ----------------
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
        <p>Loading Escape Rooms...</p>
      </div>
    );
  }

  // ---------------- MENU ----------------
  if (gameState === 'menu') {
    return (
      <div className={styles.menuContainer}>
        <h1 className={styles.menuTitle}>Choose Your Adventure</h1>

        <div className={styles.roomGrid}>
          {rooms.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No rooms yet.</p>
              <a href="/escape-room/create" className={styles.createButton}>Create One</a>
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
                  <span className={styles.roomMeta}>
                    {room.puzzles.length} puzzles · {Math.floor(room.timerSeconds / 60)} mins
                  </span>

                  <div className={styles.roomActions}>
                    <button
                      className={styles.editButton}
                      onClick={(e) => editRoom(room.id, e)}
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      className={styles.deleteButton}
                      onClick={(e) => deleteRoom(room.id, e)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
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

  // ---------------- GAMEPLAY ----------------
  if (!selectedRoom) return null;

  return (
    <div
      className={styles.gameContainer}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3),
                           rgba(0,0,0,0.3)),
                           url(${selectedRoom.backgroundImage})`
      }}
    >
      {/* HUD */}
      <div className={styles.hud}>
        <button onClick={handleBackToMenu} className={styles.backButton}>
          <ArrowLeft size={20} /> Exit
        </button>

        <div className={styles.title}>{selectedRoom.title}</div>

        <div className={styles.timer}>
          Time: {formatTime(timeLeft)}
        </div>
      </div>

      {/* HOTSPOTS */}
      {gameState === 'playing' && (
        <>
          {selectedRoom.puzzles.map(p => {
            const solved = solvedPuzzles.includes(p.id);
            return (
              <div
                key={p.id}
                className={`${styles.hotspot} ${solved ? styles.solved : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onClick={() => openPuzzle(p)}
              >
                {solved ? <CheckCircle size={24} /> : <Lock size={24} />}
              </div>
            );
          })}
        </>
      )}

      {/* START SCREEN */}
      {gameState === 'start' && (
        <div className={styles.startScreen}>
          <h1>{selectedRoom.title}</h1>
          <p>{selectedRoom.description}</p>
          <button onClick={handleStart} className={styles.bigButton}>
            <Play size={24} /> Start Game
          </button>
        </div>
      )}

      {/* WIN SCREEN */}
      {gameState === 'won' && (
        <div className={styles.winScreen}>
          <h1>ESCAPE SUCCESSFUL!</h1>
          <p>You finished with {formatTime(timeLeft)} remaining.</p>
          <button onClick={handleBackToMenu} className={styles.bigButton}>
            Back to Menu
          </button>
        </div>
      )}

      {/* LOSE SCREEN */}
      {gameState === 'lost' && (
        <div className={styles.winScreen}>
          <h1>TIME UP</h1>
          <p>You failed to escape in time.</p>

          <button
            onClick={() => setGameState('start')}
            className={styles.bigButton}
          >
            <RotateCcw size={24} /> Try Again
          </button>

          <button
            onClick={handleBackToMenu}
            style={{
              marginTop: '1rem',
              background: 'transparent',
              border: '1px solid white',
              padding: '0.5rem 1rem',
            }}
          >
            Give Up
          </button>
        </div>
      )}

      {/* PUZZLE MODAL */}
      {activePuzzle && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setActivePuzzleId(null)}
            >
              <X />
            </button>

            <h2 className={styles.puzzleTitle}>{activePuzzle.name}</h2>
            <p>{activePuzzle.instruction}</p>

            {activePuzzle.code && (
              <pre className={styles.codeBlock}>
                {activePuzzle.code}
              </pre>
            )}

            <form onSubmit={handleSubmit}>
              {activePuzzle.type !== 'text' ? (
                <textarea
                  className={styles.textarea}
                  rows={8}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your answer..."
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

              {feedback && (
                <p style={{ color: '#ef4444' }}>{feedback}</p>
              )}

              <button className={styles.submitButton}>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
