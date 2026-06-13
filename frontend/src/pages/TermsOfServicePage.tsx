import { Link } from 'react-router-dom'
import { FiArrowLeft, FiFileText } from 'react-icons/fi'

const TermsOfServicePage = () => {
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
            <FiFileText size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Terms of Service
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Last updated: June 2026
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none dark:prose-invert">
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to SmartCart AI. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before making a purchase or using our AI-powered features.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Account Registration</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            To access certain features, you must create an account. You agree to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain the security of your password and account</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Be responsible for all activities under your account</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">AI Features & Recommendations</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Our AI chatbot and recommendation engine are designed to enhance your shopping experience. These tools:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
            <li>Provide suggestions based on product data and your browsing history</li>
            <li>Are continuously improved to deliver better results</li>
            <li>Should not be relied upon as the sole basis for purchasing decisions</li>
            <li>May occasionally make inaccurate suggestions — we encourage you to verify product details</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Orders & Payments</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600 dark:text-gray-400">
            <li>All prices are listed in USD and are subject to change without notice</li>
            <li>We reserve the right to refuse or cancel any order</li>
            <li>Payment information is processed securely by our payment partners</li>
            <li>We do not store full payment card details on our servers</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Intellectual Property</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            All content on SmartCart AI — including code, design, graphics, logos, and software — is the property of SmartCart AI and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Limitation of Liability</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            SmartCart AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability is limited to the amount paid for the product or service giving rise to the claim.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Changes to Terms</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We reserve the right to update these Terms at any time. We will notify users of material changes via email or a notice on our website. Continued use after changes constitutes acceptance of the new Terms.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-gray-100">Contact</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Questions about these Terms? Reach out to{' '}
            <a href="mailto:support@smartcart.ai" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
              support@smartcart.ai
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage
