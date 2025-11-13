'use client';

import { useState, useEffect } from 'react';
import styles from './SavedTabsPage.module.css';

// Define the type for a TabSet, based on your Prisma schema
type TabSet = {
  id: string;
  createdAt: string;
  name: string;
  htmlCode: string;
  jsCode: string;
};

export default function SavedTabsPage() {
  const [tabSets, setTabSets] = useState<TabSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: State for the Edit Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTabSet, setSelectedTabSet] = useState<TabSet | null>(null);
  const [newName, setNewName] = useState('');

  // Fetch all saved tab sets from the API
  useEffect(() => {
    async function fetchTabSets() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/tabs');
        if (!response.ok) {
          throw new Error('Failed to fetch saved tabs');
        }
        const data: TabSet[] = await response.json();
        setTabSets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTabSets();
  }, []);

  // Function to handle deleting a tab set
  const handleDelete = async (idToDelete: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this tab set? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/tabs/${idToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tab set');
      }

      setTabSets((prevTabSets) =>
        prevTabSets.filter((tabSet) => tabSet.id !== idToDelete)
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // --- NEW: Function to open the edit modal ---
  const handleOpenModal = (tabSet: TabSet) => {
    setSelectedTabSet(tabSet);
    setNewName(tabSet.name); // Pre-fill the input with the current name
    setIsModalOpen(true);
    setError(null);
  };

  // --- NEW: Function to close the edit modal ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTabSet(null);
    setNewName('');
  };

  // --- NEW: Function to handle the update (save) action ---
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTabSet || !newName.trim()) return;

    try {
      const response = await fetch(`/api/tabs/${selectedTabSet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tab set');
      }

      const updatedTabSet: TabSet = await response.json();

      // Update the name in the local state to refresh the UI
      setTabSets((prevTabSets) =>
        prevTabSets.map((tabSet) =>
          tabSet.id === updatedTabSet.id ? updatedTabSet : tabSet
        )
      );
      
      handleCloseModal(); // Close the modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };


  if (isLoading) {
    return <div className={styles.container}><p>Loading saved tabs...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Saved Tab Sets</h1>
      
      {error && <p className={styles.error}>{error}</p>}

      {tabSets.length === 0 && !error ? (
        <p>You have not saved any tab sets to the database yet.</p>
      ) : (
        <div className={styles.list}>
          {tabSets.map((tabSet) => (
            <div key={tabSet.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{tabSet.name}</h2>
                <span className={styles.cardDate}>
                  Saved on: {new Date(tabSet.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.cardActions}>
                {/* --- NEW: Edit Button --- */}
                <button
                  onClick={() => handleOpenModal(tabSet)}
                  className={styles.editButton}
                >
                  Edit Name
                </button>
                <button
                  onClick={() => handleDelete(tabSet.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- NEW: Edit Modal --- */}
      {isModalOpen && selectedTabSet && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Edit Tab Set Name</h2>
            <form onSubmit={handleUpdateName}>
              <label htmlFor="tabName" className={styles.modalLabel}>
                New Name
              </label>
              <input
                id="tabName"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={styles.modalInput}
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.modalButtonCancel}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalButtonSave}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}