import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About This Project</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Student Details</h2>
        <p className={styles.info}>
          <strong>Name:</strong> Alya Nursalma Ridwan
          <br />
          <strong>Student Number:</strong> 22586609
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Website Walkthrough</h2>
        <p className={styles.info}>
          The following video provides a complete walkthrough of the application,
          demonstrating its features and explaining the code structure as required
          for Assignment 1.
        </p>
        <div className={styles.videoPlaceholder}>
          Your video will be embedded here.
        </div>
      </div>
    </div>
  );
}

