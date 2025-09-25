'use client';

import { useState, useEffect } from 'react';
import styles from './TabsGenerator.module.css';

// Define a type for our tab structure for better code quality
type Tab = {
  id: number;
  header: string;
  content: string;
};

export default function TabsGenerator() {
  // State to hold the tabs. The initial value is now an empty array.
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true); // To prevent errors during server rendering

  // --- NEW: Load tabs from localStorage when the component mounts ---
  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem('userTabs');
      if (savedTabs) {
        setTabs(JSON.parse(savedTabs));
        // Set the first tab as selected by default if there are saved tabs
        if (JSON.parse(savedTabs).length > 0) {
          setSelectedTabId(JSON.parse(savedTabs)[0].id);
        }
      } else {
        // If no tabs are saved, start with the default ones
        const defaultTabs = [
          { id: 1, header: 'Step 1', content: 'Content for Step 1' },
          { id: 2, header: 'Step 2', content: 'Content for Step 2' },
        ];
        setTabs(defaultTabs);
        setSelectedTabId(1);
      }
    } catch (error) {
      console.error('Failed to load tabs from localStorage', error);
      // Fallback to default tabs in case of any error
      const defaultTabs = [
        { id: 1, header: 'Step 1', content: 'Content for Step 1' },
        { id: 2, header: 'Step 2', content: 'Content for Step 2' },
      ];
      setTabs(defaultTabs);
      setSelectedTabId(1);
    }
    setIsLoading(false); // Finished loading
  }, []); // The empty array [] means this effect runs only once

  // --- NEW: Save tabs to localStorage whenever they change ---
  useEffect(() => {
    // We don't want to save the initial empty array during server rendering
    if (!isLoading) {
      try {
        localStorage.setItem('userTabs', JSON.stringify(tabs));
      } catch (error) {
        console.error('Failed to save tabs to localStorage', error);
      }
    }
  }, [tabs, isLoading]); // This effect runs whenever the 'tabs' or 'isLoading' state changes

  const handleAddTab = () => {
    if (tabs.length >= 15) {
      alert('You can only have a maximum of 15 tabs.');
      return;
    }
    const newTab = {
      id: Date.now(),
      header: `New Tab ${tabs.length + 1}`,
      content: `Content for New Tab ${tabs.length + 1}`,
    };
    setTabs([...tabs, newTab]);
    setSelectedTabId(newTab.id);
  };

  const handleRemoveTab = (idToRemove: number) => {
    const newTabs = tabs.filter((tab) => tab.id !== idToRemove);
    setTabs(newTabs);
    // If the removed tab was the selected one, select the first tab or nothing
    if (selectedTabId === idToRemove) {
      setSelectedTabId(newTabs.length > 0 ? newTabs[0].id : null);
    }
  };

  const handleHeaderChange = (id: number, newHeader: string) => {
    const newTabs = tabs.map((tab) =>
      tab.id === id ? { ...tab, header: newHeader } : tab
    );
    setTabs(newTabs);
  };

  const handleContentChange = (id: number, newContent: string) => {
    const newTabs = tabs.map((tab) =>
      tab.id === id ? { ...tab, content: newContent } : tab
    );
    setTabs(newTabs);
  };

  const handleGenerateCode = () => {
    const headers = tabs
      .map(
        (tab, index) =>
          `<button class="tab-button" style="padding: 10px 15px; border: 1px solid #ccc; background-color: ${
            index === 0 ? '#f0f0f0' : '#fff'
          }; cursor: pointer;" onclick="showTab(${index})">${
            tab.header
          }</button>`
      )
      .join('');

    const contents = tabs
      .map(
        (tab, index) =>
          `<div class="tab-content" style="display: ${
            index === 0 ? 'block' : 'none'
          }; padding: 15px; border: 1px solid #ccc; border-top: none;">${
            tab.content
          }</div>`
      )
      .join('');

    const script = `
<script>
  function showTab(tabIndex) {
    const buttons = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    
    buttons.forEach((button, index) => {
      if (index === tabIndex) {
        button.style.backgroundColor = '#f0f0f0';
        button.style.borderBottomColor = '#f0f0f0';
      } else {
        button.style.backgroundColor = '#fff';
        button.style.borderBottomColor = '#ccc';
      }
    });

    contents.forEach((content, index) => {
      content.style.display = index === tabIndex ? 'block' : 'none';
    });
  }
<\/script>`;

    setGeneratedCode(
      `<div class="tabs-container">\n  <div class="tab-headers">${headers}</div>\n  <div class="tab-contents">${contents}</div>\n</div>\n${script}`
    );
  };

  const selectedTabData = tabs.find((tab) => tab.id === selectedTabId);

  // Don't render anything until the client has loaded the data from localStorage
  if (isLoading) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tabs Component Generator</h1>

      <div className={styles.mainContent}>
        <div className={styles.editor}>
          <h2 className={styles.sectionTitle}>Editor</h2>
          <div className={styles.tabsList}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${styles.tabItem} ${
                  selectedTabId === tab.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedTabId(tab.id)}
              >
                <input
                  type="text"
                  value={tab.header}
                  onChange={(e) => handleHeaderChange(tab.id, e.target.value)}
                  className={styles.input}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the tab from being selected when clicking remove
                    handleRemoveTab(tab.id);
                  }}
                  className={`${styles.button} ${styles.removeButton}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddTab}
            className={`${styles.button} ${styles.addButton}`}
          >
            Add Tab
          </button>

          <h3 className={styles.sectionTitle}>Content for Selected Tab</h3>
          {selectedTabData ? (
            <textarea
              value={selectedTabData.content}
              onChange={(e) =>
                handleContentChange(selectedTabData.id, e.target.value)
              }
              className={styles.textarea}
              placeholder="Enter the content for the selected tab here..."
            />
          ) : (
            <div className={styles.textarea}>
              Please select a tab to edit its content.
            </div>
          )}
        </div>

        <div className={styles.preview}>
          <h2 className={styles.sectionTitle}>Output</h2>
          <button
            onClick={handleGenerateCode}
            className={`${styles.button} ${styles.outputButton}`}
          >
            Generate Code
          </button>
          <pre className={styles.outputCode}>
            <code>{generatedCode || 'Click "Generate Code" to see the output.'}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

