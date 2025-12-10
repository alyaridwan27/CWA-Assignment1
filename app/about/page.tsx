import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About This Project</h1>

      {/* STUDENT DETAILS */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Student Details</h2>
        <p className={styles.info}>
          <strong>Name:</strong> Alya Nursalma Ridwan
          <br />
          <strong>Student Number:</strong> 22586609
        </p>
      </div>

      {/* ASSIGNMENT 1 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Assignment 1 – Website Walkthrough</h2>
        <p className={styles.info}>
          This video explains all Assignment 1 functionalities, including dynamic tab creation,
          HTML generation, local storage persistence, theme switching, responsive UI behavior,
          and navigation state persistence using cookies.
        </p>

        <div className={styles.videoWrapper}>
          <iframe
            className={styles.videoIframe}
            src="https://www.youtube.com/embed/4fi-fHZVjOg?si=z_lyAz9_9f0IqsP1"
            title="Assignment 1 Walkthrough Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* ASSIGNMENT 2 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Assignment 2 – Cloud Deployment & Monitoring</h2>
        <p className={styles.info}>
          For Assignment 2, the application was redesigned to run in a cloud-native environment using Azure.
          The deployment includes:
          <br /><br />
          • Dockerized Next.js application pushed to Azure Container Registry (ACR)  
          • Web App for Containers running the production build  
          • Azure PostgreSQL Flexible Server as the cloud database  
          • Prisma migrations to initialize schema  
          • Application Insights instrumentation for monitoring  
          • Azure Function (serverless) that processes Tab data through an HTTP trigger  
          • Performance testing using Apache JMeter  
          <br /><br />
          The following video demonstrates the full setup, including Docker build/push,
          Azure services configuration, database migration, deployment, serverless
          function integration, and load-testing evaluation.
        </p>

        <div className={styles.videoWrapper}>
          <iframe
            className={styles.videoIframe}
            src="https://www.youtube.com/embed/X2VlWOD77qg?si=6PMR4Ui0-25MKBhY"
            title="Assignment 2 Deployment & Monitoring Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
