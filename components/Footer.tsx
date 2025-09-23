export default function Footer() {
  // Get the current year for the copyright notice
  const currentYear = new Date().getFullYear();
  // Get the full current date to display
  const currentDate = new Date().toLocaleDateString('en-AU'); // Formats date for Australia

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto py-6 px-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>
            &copy; {currentYear} | [Alya Nursalma Ridwan] | [22586609] 
          </p>
          <p className="text-sm mt-1">
            Date: {currentDate}
          </p>
        </div>
      </div>
    </footer>
  );
}