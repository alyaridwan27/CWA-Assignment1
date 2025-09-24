'use client';

import styles from './ThemeToggle.module.css';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensures the component only renders on the client to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to prevent layout shifts
    return <div className={styles.placeholder} />;
  }

  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      className={`${styles.switch} ${isDarkMode ? styles.dark : ''}`}
      role="switch"
      aria-checked={isDarkMode}
    >
      <span className={styles.srOnly}>Toggle theme</span> {/* Accessible label */}
      <span className={styles.thumb} />
    </button>
  );
}

