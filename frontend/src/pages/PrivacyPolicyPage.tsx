import { Link } from 'react-router-dom'
import { FiArrowLeft, FiShield } from 'react-icons/fi'

const PrivacyPolicyPage = () => {
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
            <FiShield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Privacy Policy
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Last updated: June 2026
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none dark:prose-invert">
          <p className="text-gray-600 dark:text-gray-400">
            At SmartCart AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Information We Collect</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
            <li><strong className="text-gray-900 dark:text-gray-100">Account Information:</strong> Name, email address, password, and shipping address when you create an account</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Order Information:</strong> Products purchased, payment details, shipping preferences</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Communication Data:</strong> Messages sent through our AI chat, customer support inquiries, and email subscriptions</li>
            <li><strong className="text-gray-900 dark:text-gray-100">Usage Data:</strong> Pages visited, products viewed, search queries, and interactions with our AI features</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">How We Use Your Information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
            <li>Process and fulfill your orders</li>
            <li>Personalize your shopping experience with AI-powered recommendations</li>
            <li>Improve our AI chatbot and product suggestions</li>
            <li>Send order updates, promotions, and newsletters (with your consent)</li>
            <li>Detect and prevent fraud or unauthorized activity</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Data Sharing & Disclosure</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We do not sell your personal information. We may share your data with trusted third-party service providers who assist us in operating our platform, processing payments, and delivering orders — all bound by strict confidentiality agreements.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Data Security</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We implement industry-standard security measures including encryption (SSL/TLS), secure password hashing (bcrypt), and regular security audits to protect your information from unauthorized access, alteration, or disclosure.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Your Rights</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You have the right to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
            <li>Access, update, or delete your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data</li>
            <li>Withdraw consent for AI-powered personalization</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Us</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:support@smartcart.ai" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
              support@smartcart.ai
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
