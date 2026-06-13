import { Link } from 'react-router-dom'
import { FiArrowLeft, FiCookie } from 'react-icons/fi'

const CookiePolicyPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
      >
        <FiArrowLeft size={16} />
        Back to home
      </Link>

      <div className="glass-card p-6 sm:p-8 lg:p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600">
            <FiCookie size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Cookie Policy
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Last updated: June 2026
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none dark:prose-invert">
          <p className="text-gray-600 dark:text-gray-400">
            SmartCart AI uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and provide personalized recommendations. This policy explains what cookies are, how we use them, and how you can control them.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">What Are Cookies?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, login status, and browsing behavior to improve your experience.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Types of Cookies We Use</h2>

          <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-gray-100">Essential Cookies</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Required for the website to function properly. They enable core features like account authentication, shopping cart functionality, and secure checkout. These cannot be disabled.
          </p>

          <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-gray-100">Functional Cookies</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Remember your preferences such as language, currency, dark mode settings, and saved items to provide a personalized experience.
          </p>

          <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-gray-100">Analytics Cookies</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Help us understand how visitors interact with our website by collecting anonymous data on page visits, time spent, and navigation patterns. We use this data to improve our platform.
          </p>

          <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-gray-100">AI Personalization Cookies</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Power our AI recommendation engine by tracking product views, search queries, and purchase history to deliver tailored product suggestions through our AI chatbot and recommendation features.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">How We Use Cookies</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
            <li>Keep you logged into your account securely</li>
            <li>Remember items in your shopping cart</li>
            <li>Provide AI-powered product recommendations</li>
            <li>Analyze website performance and traffic</li>
            <li>Save your theme preference (light/dark mode)</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Managing Cookies</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You can control and manage cookies in your browser settings:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
            <li>Most browsers allow you to block or delete cookies</li>
            <li>Disabling essential cookies may affect website functionality</li>
            <li>You can opt out of AI personalization in your account settings</li>
            <li>Browser settings for managing cookies vary — check your browser's help section</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Updates to This Policy</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Contact</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Have questions about our cookie usage? Email us at{' '}
            <a href="mailto:support@smartcart.ai" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
              support@smartcart.ai
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicyPage
