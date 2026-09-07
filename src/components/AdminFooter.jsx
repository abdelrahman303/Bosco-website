export default function AdminFooter() {
  return (
    <footer className="h-12 bg-white dark:bg-bosco-card border-t border-gray-200 dark:border-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
      Bosco International Trade - Admin Portal &copy; {new Date().getFullYear()}
    </footer>
  );
}