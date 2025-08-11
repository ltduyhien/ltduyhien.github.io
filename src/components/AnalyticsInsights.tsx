import React from "react";

const AnalyticsInsights = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">
        🎯 Analytics Insights You'll Get
      </h3>

      <div className="space-y-6">
        {/* Custom Dimensions */}
        <div>
          <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mb-3">
            📊 Custom Dimensions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-blue-800 dark:text-blue-200">
                User Type
              </h5>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                <li>• Recruiter - Quick CV checks, brief visits</li>
                <li>• Designer - Deep visual exploration</li>
                <li>• Developer - Technical project focus</li>
                <li>• Other - General browsing</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-green-800 dark:text-green-200">
                Project Category
              </h5>
              <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                <li>• Desktop Applications</li>
                <li>• Mobile Applications</li>
                <li>• SaaS Enterprise Applications</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-purple-800 dark:text-purple-200">
                Visit Frequency
              </h5>
              <ul className="text-sm text-purple-700 dark:text-purple-300 mt-2 space-y-1">
                <li>• First Time - New visitors</li>
                <li>• Returning - 2-3 visits</li>
                <li>• Frequent - 4+ visits</li>
              </ul>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-orange-800 dark:text-orange-200">
                Device & Time
              </h5>
              <ul className="text-sm text-orange-700 dark:text-orange-300 mt-2 space-y-1">
                <li>• Desktop/Mobile/Tablet</li>
                <li>• Morning/Afternoon/Evening/Night</li>
                <li>• Weekday/Weekend</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Custom Metrics */}
        <div>
          <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mb-3">
            📈 Custom Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-indigo-800 dark:text-indigo-200">
                Interaction Depth
              </h5>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-2">
                How many sections users expand on About page (0-10+)
              </p>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-teal-800 dark:text-teal-200">
                Engagement Score
              </h5>
              <p className="text-sm text-teal-700 dark:text-teal-300 mt-2">
                Time spent + scroll depth + interactions
              </p>
            </div>
          </div>
        </div>

        {/* Geographic & Demographic Insights */}
        <div>
          <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mb-3">
            🌍 Geographic & Demographic Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-red-800 dark:text-red-200">
                Geographic Data
              </h5>
              <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                <li>• Timezone detection</li>
                <li>• Language preferences</li>
                <li>• Regional behavior patterns</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-yellow-800 dark:text-yellow-200">
                Behavioral Patterns
              </h5>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                <li>• Interest detection (AI, Mobile, SaaS, etc.)</li>
                <li>• Browsing patterns</li>
                <li>• Conversion paths</li>
              </ul>
            </div>
          </div>
        </div>

        {/* GA4 Reports You Can Create */}
        <div>
          <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mb-3">
            📋 GA4 Reports You Can Create
          </h4>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-gray-200">
                User Type Analysis
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Which user types engage most? Recruiters vs Designers vs
                Developers
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-gray-200">
                Project Category Performance
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Which project categories get most attention? Desktop vs Mobile
                vs SaaS
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-gray-200">
                Engagement Depth Analysis
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                How deeply do users explore your content? Section expansion
                patterns
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-gray-200">
                Time & Device Patterns
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                When and how do people visit? Best times for engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsInsights;
