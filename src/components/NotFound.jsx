import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiTool } from 'react-icons/fi';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bosco-dark flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="inline-block text-bosco-red mb-6"
        >
          <FiTool size={80} />
        </motion.div>
        
        <h1 className="text-8xl font-black text-bosco-gray dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6">
          {t('site.notFound.title')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          {t('site.notFound.body')}
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center justify-center bg-bosco-red hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-all hover:shadow-lg hover:shadow-bosco-red/30"
        >
          {t('site.notFound.back')}
        </Link>
      </motion.div>
    </div>
  );
}