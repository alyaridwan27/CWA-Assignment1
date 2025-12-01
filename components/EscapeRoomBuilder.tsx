'use client';

import { useState } from 'react';
import { Plus, Save, Trash2, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './EscapeRoomBuilder.module.css';

// ... (Types remain the same)
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

export default function EscapeRoomBuilder() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  // FIXED: Hardcoded default image
  const [bgImage] = useState('https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg');
  const [timer, setTimer] = useState(300);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPoint, setTempPoint] = useState<{x: number, y: number} | null>(null);
  const [newPuzzle, setNewPuzzle] = useState<Partial<Puzzle>>({
    type: 'text',
    name: '',
    instruction: '',
    code: '',
    solution: ''
  });

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTempPoint({ x, y });
    setIsModalOpen(true);
    setNewPuzzle({ type: 'text', name: `Puzzle ${puzzles.length + 1}`, instruction: '', code: '', solution: '' });
  };

  const savePuzzle = () => {
    if (!tempPoint || !newPuzzle.name || !newPuzzle.solution) {
      alert("Please fill in the Name and Solution fields.");
      return;
    }
    const puzzleToAdd: Puzzle = {
      id: Date.now(),
      x: tempPoint.x,
      y: tempPoint.y,
      name: newPuzzle.name!,
      instruction: newPuzzle.instruction || '',
      type: newPuzzle.type as 'format' | 'write' | 'text',
      code: newPuzzle.code || '',
      solution: newPuzzle.solution!,
    };
    setPuzzles([...puzzles, puzzleToAdd]);
    setIsModalOpen(false);
    setTempPoint(null);
  };

  const removePuzzle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPuzzles(puzzles.filter(p => p.id !== id));
  };

  const handleSaveRoom = async () => {
    if (!title) {
      alert("Please give your room a title.");
      return;
    }
    if (puzzles.length === 0) {
      alert("Please add at least one puzzle to your room.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/escape-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: `Custom room with ${puzzles.length} puzzles.`,
          backgroundImage: bgImage,
          timerSeconds: timer,
          puzzles,
        }),
      });

      if (response.ok) {
        alert("Escape Room created successfully!");
        router.push('/escape-room');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error(error);
      alert("Error saving room.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.builderContainer}>
      <h1 className={styles.header}>Create Your Escape Room</h1>
      
      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <label>Room Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., The Haunted Server Room"
            className={styles.input}
          />
        </div>
        {/* REMOVED IMAGE INPUT - Using Default */}
        <div className={styles.inputGroup}>
          <label>Time Limit (Seconds)</label>
          <input 
            type="number" 
            value={timer} 
            onChange={e => setTimer(Number(e.target.value))} 
            className={styles.input}
          />
        </div>
      </div>

      <p className={styles.hint}>Click anywhere on the image below to place a puzzle hotspot.</p>

      <div 
        className={styles.previewStage} 
        style={{ backgroundImage: `url(${bgImage})` }}
        onClick={handleImageClick}
      >
        {puzzles.map(puzzle => (
          <div 
            key={puzzle.id}
            className={styles.hotspotMarker}
            style={{ left: `${puzzle.x}%`, top: `${puzzle.y}%` }}
            title={puzzle.name}
          >
            <MapPin size={24} />
            <span className={styles.hotspotLabel}>{puzzle.id}</span>
            <button 
              className={styles.deleteHotspot} 
              onClick={(e) => removePuzzle(puzzle.id, e)}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button onClick={handleSaveRoom} disabled={isSaving} className={styles.saveButton}>
          {isSaving ? 'Saving...' : <><Save size={20} /> Save Room</>}
        </button>
      </div>

      {/* --- ADD PUZZLE MODAL --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add Puzzle</h2>
            <div className={styles.formGroup}>
              <label>Puzzle Name</label>
              <input 
                type="text" 
                value={newPuzzle.name} 
                onChange={e => setNewPuzzle({...newPuzzle, name: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select 
                value={newPuzzle.type} 
                onChange={e => setNewPuzzle({...newPuzzle, type: e.target.value as any})}
              >
                <option value="text">Simple Question & Answer</option>
                <option value="format">Fix Code Formatting</option>
                <option value="write">Write Code</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Instructions</label>
              <textarea 
                value={newPuzzle.instruction} 
                onChange={e => setNewPuzzle({...newPuzzle, instruction: e.target.value})}
              />
            </div>
            {(newPuzzle.type === 'format') && (
              <div className={styles.formGroup}>
                <label>Initial Code (Broken)</label>
                <textarea 
                  className={styles.codeFont}
                  value={newPuzzle.code} 
                  onChange={e => setNewPuzzle({...newPuzzle, code: e.target.value})}
                />
              </div>
            )}
            <div className={styles.formGroup}>
              <label>Correct Solution</label>
              <textarea 
                className={styles.codeFont}
                value={newPuzzle.solution} 
                onChange={e => setNewPuzzle({...newPuzzle, solution: e.target.value})}
              />
            </div>
            <div className={styles.modalButtons}>
              <button onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={savePuzzle} className={styles.confirmBtn}>Add Puzzle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}