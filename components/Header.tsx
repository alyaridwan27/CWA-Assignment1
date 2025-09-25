'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Left Group - Title */}
        <div className={styles.leftGroup}>
          <Link href="/" className={styles.titleLink}>
            <h1 className={styles.title}>LTU Code Generator</h1>
          </Link>
        </div>

        {/* Right Group - Nav, Student No, etc. */}
        <div className={styles.rightGroup}>
          <nav className={styles.desktopNav}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/pre-lab-questions">Pre-lab Questions</Link>
            <Link href="/escape-room">Escape Room</Link>
            <Link href="/coding-races">Coding Races</Link>
          </nav>
          <div className={styles.studentNumber}>
            <span>22586609</span>
          </div>
          <ThemeToggle />
          <button
            className={styles.menuButton}
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className={styles.srOnly}>Open main menu</span>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`${styles.mobileMenu} ${
          isOpen ? styles.open : styles.closed
        }`}
        id="mobile-menu"
      >
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link href="/pre-lab-questions" onClick={() => setIsOpen(false)}>
            Pre-lab Questions
          </Link>
          <Link href="/escape-room" onClick={() => setIsOpen(false)}>
            Escape Room
          </Link>
          <Link href="/coding-races" onClick={() => setIsOpen(false)}>
            Coding Races
          </Link>
        </nav>
      </div>
    </header>
  );
}

