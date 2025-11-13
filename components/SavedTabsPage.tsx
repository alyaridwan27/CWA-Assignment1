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

  if (isLoading) {
    return <div className={styles.container}><p>Loading saved tabs...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Saved Tab Sets</h1>
      {tabSets.length === 0 ? (
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
                {/* We will add the Delete button logic here */}
                <button className={styles.deleteButton}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}