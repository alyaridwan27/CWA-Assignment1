'use client';

import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './EscapeRoomBuilder.module.css';

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
  const params = useSearchParams();
  const roomId = params.get("id");

  const [title, setTitle] = useState('');
  const [bgImage, setBgImage] = useState('https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg');
  const [timer, setTimer] = useState(300);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPoint, setTempPoint] = useState<{ x: number; y: number } | null>(null);
  const [newPuzzle, setNewPuzzle] = useState<Partial<Puzzle>>({
    type: 'text',
    name: '',
    instruction: '',
    code: '',
    solution: ''
  });

  // ---------------------------------------------------------------
  // 🟦 1. If editing → fetch room and populate fields
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!roomId) {
      setLoadingRoom(false);
      return;
    }

    async function loadRoom() {
      try {
        const res = await fetch(`/api/escape-rooms/${roomId}`);
        if (!res.ok) throw new Error("Failed to load room");

        const data = await res.json();

        setTitle(data.title);
        setBgImage(data.backgroundImage);
        setTimer(data.timerSeconds);

        // Convert stored JSON puzzles to builder format
        setPuzzles(
          data.puzzles.map((p: any) => ({
            id: p.id,
            x: p.x,
            y: p.y,
            name: p.name,
            instruction: p.instruction,
            type: p.type,
            code: p.code,
            solution: p.solution
          }))
        );
      } catch (err) {
        console.error(err);
        alert("Failed to load room.");
      } finally {
        setLoadingRoom(false);
      }
    }

    loadRoom();
  }, [roomId]);

  // ---------------------------------------------------------------
  // 🟦 2. Adding puzzle via clicking image
  // ---------------------------------------------------------------
  const handleImageClick = (e: any) => {
    if (isModalOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTempPoint({ x, y });

    setNewPuzzle({
      type: 'text',
      name: `Puzzle ${puzzles.length + 1}`,
      instruction: '',
      code: '',
      solution: ''
    });

    setIsModalOpen(true);
  };

  const savePuzzle = () => {
    if (!tempPoint || !newPuzzle.name || !newPuzzle.solution) {
      alert("Please fill in puzzle name and solution.");
      return;
    }

    const puzzleToAdd: Puzzle = {
      id: Date.now(),
      x: tempPoint.x,
      y: tempPoint.y,
      name: newPuzzle.name!,
      instruction: newPuzzle.instruction || '',
      type: newPuzzle.type as any,
      code: newPuzzle.code || '',
      solution: newPuzzle.solution!
    };

    setPuzzles([...puzzles, puzzleToAdd]);
    setIsModalOpen(false);
    setTempPoint(null);
  };

  const removePuzzle = (id: number, e: any) => {
    e.stopPropagation();
    setPuzzles(puzzles.filter((p) => p.id !== id));
  };

  // ---------------------------------------------------------------
  // 🟦 3. Save (Create or Update)
  // ---------------------------------------------------------------
  const handleSaveRoom = async () => {
    if (!title) return alert("Please enter a room title");
    if (puzzles.length === 0) return alert("Add at least one puzzle.");

    setIsSaving(true);

    const payload = {
      title,
      description: `Custom room with ${puzzles.length} puzzles.`,
      backgroundImage: bgImage,
      timerSeconds: timer,
      puzzles
    };

    try {
      if (roomId) {
        // UPDATE
        await fetch(`/api/escape-rooms/${roomId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        alert("Room updated!");
      } else {
        // CREATE
        await fetch(`/api/escape-rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        alert("Room created!");
      }

      router.push("/escape-room");
    } catch (err) {
      console.error(err);
      alert("Failed to save room.");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------
  // 🟦 4. DELETE ROOM
  // ---------------------------------------------------------------
  const handleDeleteRoom = async () => {
    if (!roomId) return;
    if (!confirm("Are you sure you want to DELETE this room?")) return;

    await fetch(`/api/escape-rooms/${roomId}`, { method: "DELETE" });
    alert("Room deleted.");
    router.push("/escape-room");
  };

  if (loadingRoom) {
    return <p style={{ padding: "2rem" }}>Loading room...</p>;
  }

  // ---------------------------------------------------------------
  //  🟦 Render UI
  // ---------------------------------------------------------------
  return (
    <div className={styles.builderContainer}>
      <h1 className={styles.header}>Create Your Escape Room</h1>

      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <label>Room Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Haunted Server Room"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Time Limit (Seconds)</label>
          <input
            type="number"
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
            className={styles.input}
          />
        </div>
      </div>

      <p className={styles.hint}>Click anywhere on the image below to add a puzzle hotspot.</p>

      <div
        className={styles.previewStage}
        style={{ backgroundImage: `url(${bgImage})` }}
        onClick={handleImageClick}
      >
        {puzzles.map((p) => (
          <div
            key={p.id}
            className={styles.hotspotMarker}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            title={p.name}
          >
            <MapPin size={24} />
            <span className={styles.hotspotLabel}>{p.id}</span>

            <button className={styles.deleteHotspot} onClick={(e) => removePuzzle(p.id, e)}>
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        {roomId && (
          <button onClick={handleDeleteRoom} className={styles.deleteButton}>
            <Trash2 size={18} /> Delete Room
          </button>
        )}

        <button onClick={handleSaveRoom} disabled={isSaving} className={styles.saveButton}>
          {isSaving ? "Saving..." : <><Save size={20} /> Save Room</>}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add Puzzle</h2>

            <div className={styles.formGroup}>
              <label>Puzzle Name</label>
              <input
                value={newPuzzle.name}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, name: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Type</label>
              <select
                value={newPuzzle.type}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, type: e.target.value as any })}
              >
                <option value="text">Simple Q&A</option>
                <option value="format">Fix Code Formatting</option>
                <option value="write">Write Code</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Instructions</label>
              <textarea
                value={newPuzzle.instruction}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, instruction: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Correct Solution</label>
              <textarea
                value={newPuzzle.solution}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, solution: e.target.value })}
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
