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

  // Fetch all saved tab sets from the API when the component mounts
  useEffect(() => {
    async function fetchTabSets() {
      try {
        setIsLoading(true);
        setError(null); // Clear previous errors
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

  // --- NEW: Function to handle deleting a tab set ---
  const handleDelete = async (idToDelete: string) => {
    // 1. Confirm with the user
    const confirmed = window.confirm(
      'Are you sure you want to delete this tab set? This action cannot be undone.'
    );

    if (!confirmed) {
      return; // Stop if the user clicks "Cancel"
    }

    // 2. Call the DELETE API endpoint
    try {
      const response = await fetch(`/api/tabs/${idToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tab set');
      }

      // 3. Update the state to remove the item from the list immediately
      setTabSets((prevTabSets) =>
        prevTabSets.filter((tabSet) => tabSet.id !== idToDelete)
      );
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Loading saved tabs...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Saved Tab Sets</h1>
      
      {/* --- NEW: Display global error messages --- */}
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
                {/* --- NEW: Added onClick handler to the button --- */}
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
    </div>
  );
}