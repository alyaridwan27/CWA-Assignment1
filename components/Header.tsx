'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

const LAST_VISITED_TAB_COOKIE = 'lastVisitedTab';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    const lastVisited = Cookies.get(LAST_VISITED_TAB_COOKIE);
    if (lastVisited) {
      setActiveTab(lastVisited);
    }
  }, []);

  useEffect(() => {
    setActiveTab(pathname);
    Cookies.set(LAST_VISITED_TAB_COOKIE, pathname, { expires: 7 });
  }, [pathname]);

  const isActive = (href: string) => activeTab === href;

  const handleLinkClick = (href: string) => {
    setActiveTab(href);
    Cookies.set(LAST_VISITED_TAB_COOKIE, href, { expires: 7 });
    setIsOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Left Group - Title and Student Number */}
        <div className={styles.leftGroup}>
          <Link href="/" className={styles.titleLink} onClick={() => handleLinkClick('/')}>
            <h1 className={styles.title}>LTU Code Generator</h1>
          </Link>
          <div className={styles.studentNumber}>
            <span>22586609</span>
          </div>
        </div>

        {/* Right Group - Nav, etc. */}
        <div className={styles.rightGroup}>
          <nav className={styles.desktopNav}>
            <Link href="/" className={isActive('/') ? styles.activeLink : ''} onClick={() => handleLinkClick('/')}>
              Home
            </Link>
            {/* --- NEW LINK ADDED --- */}
            <Link href="/saved-tabs" className={isActive('/saved-tabs') ? styles.activeLink : ''} onClick={() => handleLinkClick('/saved-tabs')}>
              Saved Tabs
            </Link>
            <Link href="/escape-room" className={isActive('/escape-room') ? styles.activeLink : ''} onClick={() => handleLinkClick('/escape-room')}>
              Escape Room
            </Link>
            <Link
              href="/pre-lab-questions"
              className={
                isActive('/pre-lab-questions') ? styles.activeLink : ''
              }
              onClick={() => handleLinkClick('/pre-lab-questions')}
            >
              Pre-lab Questions
            </Link>
            <Link
              href="/coding-races"
              className={isActive('/coding-races') ? styles.activeLink : ''}
              onClick={() => handleLinkClick('/coding-races')}
            >
              Coding Races
            </Link>
            <Link href="/about" className={isActive('/about') ? styles.activeLink : ''} onClick={() => handleLinkClick('/about')}>
              About
            </Link>
          </nav>
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
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : styles.closed}`} id="mobile-menu">
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={() => handleLinkClick('/')}>Home</Link>
          {/* --- NEW LINK ADDED --- */}
          <Link href="/saved-tabs" onClick={() => handleLinkClick('/saved-tabs')}>
            Saved Tabs
          </Link>
          <Link href="/escape-room" onClick={() => handleLinkClick('/escape-room')}>
            Escape Room
          </Link>
          <Link href="/pre-lab-questions" onClick={() => handleLinkClick('/pre-lab-questions')}>
            Pre-lab Questions
          </Link>
          <Link href="/coding-races" onClick={() => handleLinkClick('/coding-races')}>
            Coding Races
          </Link>
          <Link href="/about" onClick={() => handleLinkClick('/about')}>About</Link>
        </nav>
      </div>
    </header>
  );
}