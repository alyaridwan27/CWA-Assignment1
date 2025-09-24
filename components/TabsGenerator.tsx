'use client';

import { useState } from 'react';
import styles from './TabsGenerator.module.css';

// Defines the structure for a single tab
interface Tab {
  id: number;
  header: string;
  content: string;
}

export default function TabsGenerator() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, header: 'Step 1', content: 'Content for Step 1' },
    { id: 2, header: 'Step 2', content: 'Content for Step 2' },
  ]);
  // State to track the currently selected tab
  const [selectedTabId, setSelectedTabId] = useState<number | null>(
    tabs.length > 0 ? tabs[0].id : null
  );
  const [generatedCode, setGeneratedCode] = useState('');

  // Function to add a new blank tab
  const handleAddTab = () => {
    const newTab: Tab = {
      id: Date.now(), // Use a unique ID
      header: `New Tab ${tabs.length + 1}`,
      content: 'New tab content.',
    };
    setTabs([...tabs, newTab]);
    // Select the new tab automatically
    setSelectedTabId(newTab.id);
  };

  // Function to remove a tab by its ID
  const handleRemoveTab = (id: number) => {
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);

    // If the selected tab was deleted, select the first one
    if (selectedTabId === id) {
      setSelectedTabId(newTabs.length > 0 ? newTabs[0].id : null);
    }
  };

  // Function to update a tab's header or content
  const handleTabChange = (
    id: number,
    field: 'header' | 'content',
    value: string
  ) => {
    setTabs(
      tabs.map((tab) => (tab.id === id ? { ...tab, [field]: value } : tab))
    );
  };

  // Function to generate the final HTML/JS code
  const handleGenerateCode = () => {
    const headersHTML = tabs
      .map(
        (tab, index) =>
          `<button class="tab-button" style="padding: 10px 15px; border: 1px solid #ccc; background-color: ${
            index === 0 ? '#f0f0f0' : '#fff'
          }; cursor: pointer;" onclick="showTab(${index})">${
            tab.header
          }</button>`
      )
      .join('');

    const contentsHTML = tabs
      .map(
        (tab, index) =>
          `<div class="tab-content" style="display: ${
            index === 0 ? 'block' : 'none'
          }; padding: 15px; border: 1px solid #ccc; border-top: none;">${
            tab.content
          }</div>`
      )
      .join('');

    const fullCode = `
<div class="tabs-container">
  <div class="tab-headers" style="display: flex;">
    ${headersHTML}
  </div>
  <div class="tab-contents">
    ${contentsHTML}
  </div>
</div>

<script>
  function showTab(tabIndex) {
    const buttons = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    
    buttons.forEach((button, index) => {
      if (index === tabIndex) {
        button.style.backgroundColor = '#f0f0f0';
      } else {
        button.style.backgroundColor = '#fff';
      }
    });

    contents.forEach((content, index) => {
      if (index === tabIndex) {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });
  }
</script>
    `;
    setGeneratedCode(fullCode.trim());
  };

  // Find the currently selected tab object
  const selectedTab = tabs.find((tab) => tab.id === selectedTabId);

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
                // Set the selected tab on click
                onClick={() => setSelectedTabId(tab.id)}
              >
                <input
                  type="text"
                  value={tab.header}
                  onChange={(e) =>
                    handleTabChange(tab.id, 'header', e.target.value)
                  }
                  className={styles.input}
                  placeholder="Tab Header"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
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
          <div>
            <h3 className={styles.sectionTitle} style={{ fontSize: '1.25rem' }}>
              Content for: {selectedTab ? selectedTab.header : 'None'}
            </h3>
            
            <textarea
              className={styles.textarea}
              placeholder="Select a tab to edit its content."
              value={selectedTab ? selectedTab.content : ''}
              onChange={(e) => {
                if (selectedTab) {
                  handleTabChange(selectedTab.id, 'content', e.target.value);
                }
              }}
              disabled={!selectedTab}
            />
          </div>
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
            <code>{generatedCode || 'Click "Generate Code" to see the output here.'}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

