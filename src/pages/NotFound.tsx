import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex justify-center items-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                404
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
                Page Not Found
              </h2>
            </div>
            
            <div className="text-gray-600 dark:text-gray-400 mb-8">
              <p className="text-lg mb-4">
                Sorry, the page you're looking for doesn't exist.
              </p>
              <p className="text-base mb-6">
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Back to Homepage
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                or{' '}
                <a
                  href="mailto:letranduyhien@gmail.com"
                  className="text-teal-500 hover:text-teal-600 underline"
                >
                  contact me
                </a>
                {' '}if you need help
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default NotFound;
