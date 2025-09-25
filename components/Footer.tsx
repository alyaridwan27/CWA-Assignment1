import styles from './Footer.module.css'; 

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>
        © {currentYear} Alya Nursalma Ridwan - 22586609 -{' '}
        {new Date().toLocaleDateString()}
      </p>
    </footer>
  );
}