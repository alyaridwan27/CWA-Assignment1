'use client';

import { useState, useEffect } from 'react';
import styles from './TabsGenerator.module.css';

type Tab = {
  id: number;
  header: string;
  content: string;
};

export default function TabsGenerator() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copyButtonText, setCopyButtonText] = useState('Copy Code');
  const [saveName, setSaveName] = useState(''); // State for the name of the tab set to save
  const [saveStatus, setSaveStatus] = useState(''); // State for showing save success/error

  // Load tabs from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem('userTabs');
      if (savedTabs) {
        const parsedTabs = JSON.parse(savedTabs);
        setTabs(parsedTabs);
        if (parsedTabs.length > 0) {
          setSelectedTabId(parsedTabs[0].id);
        }
      } else {
        const defaultTabs = [
          { id: 1, header: 'Step 1', content: 'Content for Step 1' },
          { id: 2, header: 'Step 2', content: 'Content for Step 2' },
        ];
        setTabs(defaultTabs);
        setSelectedTabId(1);
      }
    } catch (error) {
      console.error('Failed to load tabs from localStorage', error);
      const defaultTabs = [
        { id: 1, header: 'Step 1', content: 'Content for Step 1' },
        { id: 2, header: 'Step 2', content: 'Content for Step 2' },
      ];
      setTabs(defaultTabs);
      setSelectedTabId(1);
    }
    setIsLoading(false);
  }, []);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('userTabs', JSON.stringify(tabs));
      } catch (error) {
        console.error('Failed to save tabs to localStorage', error);
      }
    }
  }, [tabs, isLoading]);

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
          `<button data-tab-button style="padding: 10px 15px; border: 1px solid #ccc; background-color: ${
            index === 0 ? '#f0f0f0' : '#fff'
          }; cursor: pointer; border-bottom-color: ${
            index === 0 ? '#f0f0f0' : '#ccc'
          };" onclick="showTab(this, ${index})">${tab.header}</button>`
      )
      .join('');

    const contents = tabs
      .map(
        (tab, index) =>
          `<div data-tab-content style="display: ${
            index === 0 ? 'block' : 'none'
          }; padding: 15px; border: 1px solid #ccc; border-top: none;">${
            tab.content
          }</div>`
      )
      .join('');

    const script = `
<script>
  function showTab(selectedButton, tabIndex) {
    const container = selectedButton.closest('[data-tabs-container]');
    const buttons = container.querySelectorAll('[data-tab-button]');
    const contents = container.querySelectorAll('[data-tab-content]');
    
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
      `<div data-tabs-container>\n  <div style="display: flex;">${headers}</div>\n  <div>${contents}</div>\n</div>\n${script}`
    );
    setSaveStatus(''); // Clear save status when generating new code
  };

  const handleCopyCode = () => {
    if (!generatedCode) {
      alert('Please generate the code first.');
      return;
    }
    const textArea = document.createElement('textarea');
    textArea.value = generatedCode;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Code'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy code to clipboard.');
    }
    document.body.removeChild(textArea);
  };

  // --- NEW: Function to save the generated code to the database ---
  const handleSaveToDb = async () => {
    if (!generatedCode) {
      alert('Please generate the code first before saving.');
      return;
    }
    if (!saveName.trim()) {
      alert('Please enter a name for this tab set before saving.');
      return;
    }

    setSaveStatus('Saving...'); // Indicate saving is in progress

    // Extract HTML and JS parts (simple split based on <script>)
    const scriptTagIndex = generatedCode.indexOf('<script>');
    const htmlPart = generatedCode.substring(0, scriptTagIndex).trim();
    const jsPart = generatedCode.substring(scriptTagIndex).trim();

    try {
      const response = await fetch('/api/tabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: saveName,
          htmlCode: htmlPart,
          jsCode: jsPart,
        }),
      });

      if (!response.ok) {
        // If the server response is not ok (e.g., status 400, 500)
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      // If successful
      const savedData = await response.json();
      console.log('Saved successfully:', savedData);
      setSaveStatus(`Saved successfully! (ID: ${savedData.id})`);
      setSaveName(''); // Clear the input field after successful save

    } catch (error) {
      console.error('Error saving to DB:', error);
      setSaveStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };


  const selectedTabData = tabs.find((tab) => tab.id === selectedTabId);

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
          <div className={styles.buttonGroup}>
            <button
              onClick={handleGenerateCode}
              className={`${styles.button} ${styles.outputButton}`}
            >
              Generate Code
            </button>
            <button
              onClick={handleCopyCode}
              className={`${styles.button} ${styles.copyButton}`}
            >
              {copyButtonText}
            </button>
          </div>
          <pre className={styles.outputCode}>
            <code>{generatedCode || 'Click "Generate Code" to see the output.'}</code>
          </pre>

          {/* --- NEW: Input field and button for saving --- */}
          <div className={styles.saveSection}>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter a name for this tab set"
              className={styles.input}
            />
            <button
              onClick={handleSaveToDb}
              className={`${styles.button} ${styles.saveButton}`}
            >
              Save to DB
            </button>
          </div>
          {/* Display save status */}
          {saveStatus && <p className={styles.saveStatus}>{saveStatus}</p>}

        </div>
      </div>
    </div>
  );
}

