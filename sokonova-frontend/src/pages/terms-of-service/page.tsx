import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using SOKONOVA, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
              <p className="mb-4">When creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be at least 18 years old or have parental consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Buyer Responsibilities</h2>
              <p className="mb-4">As a buyer, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate shipping and payment information</li>
                <li>Pay for all items you purchase</li>
                <li>Communicate respectfully with sellers</li>
                <li>Follow our return and refund policies</li>
                <li>Not engage in fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Seller Responsibilities</h2>
              <p className="mb-4">As a seller, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate product descriptions and images</li>
                <li>Honor the prices and terms listed in your listings</li>
                <li>Ship items promptly and as described</li>
                <li>Respond to customer inquiries in a timely manner</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Pay all applicable fees and commissions</li>
                <li>Not sell prohibited or illegal items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Activities</h2>
              <p className="mb-4">You may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Sell counterfeit or stolen goods</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Manipulate reviews or ratings</li>
                <li>Attempt to circumvent our fee structure</li>
                <li>Use automated tools to scrape or collect data</li>
                <li>Interfere with platform operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payments and Fees</h2>
              <p className="mb-4">
                All transactions are processed through our secure payment system. Sellers agree to pay applicable commission fees and transaction charges as outlined in our Fees & Pricing page. Buyers agree to pay the full purchase price including shipping and taxes.
              </p>
              <p>
                We reserve the right to hold funds, cancel transactions, or suspend accounts if we suspect fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns and Refunds</h2>
              <p>
                Our return policy allows buyers to return most items within 30 days of delivery. Sellers must honor returns according to their stated policies. Refunds are processed within 5-7 business days after return approval. Some items may not be eligible for return.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="mb-4">
                All content on SOKONOVA, including logos, text, graphics, and software, is owned by us or our licensors and protected by intellectual property laws. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks or branding without authorization</li>
                <li>Reverse engineer or decompile our software</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Dispute Resolution</h2>
              <p>
                We encourage users to resolve disputes directly. If a resolution cannot be reached, you may contact our support team for mediation. For legal disputes, you agree to binding arbitration in accordance with the laws of the jurisdiction where SOKONOVA is registered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p>
                SOKONOVA is a marketplace platform connecting buyers and sellers. We are not responsible for the quality, safety, or legality of items listed, the accuracy of listings, or the ability of sellers to complete transactions. Our liability is limited to the maximum extent permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Account Termination</h2>
              <p className="mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms. You may close your account at any time by contacting support. Upon termination:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must complete all pending transactions</li>
                <li>Outstanding fees must be paid</li>
                <li>Your listings will be removed</li>
                <li>Access to your account will be revoked</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. Significant changes will be communicated via email or platform notification. Continued use of SOKONOVA after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="mb-4">For questions about these terms, contact us:</p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> legal@sokonova.com</li>
                <li><strong>Address:</strong> SOKONOVA Legal Department, 123 Market Street, San Francisco, CA 94103</li>
                <li><strong>Phone:</strong> +1 (555) 123-4567</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
