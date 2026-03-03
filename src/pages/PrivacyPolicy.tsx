import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20 pt-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 font-bold transition-colors">
          <ArrowLeft size={20} /> Back to Calculator
        </Link>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
            <div className="bg-indigo-500/20 p-4 rounded-2xl text-indigo-400">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">Privacy Policy</h1>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            <p><strong>Last Updated:</strong> March 2026</p>
            <p className="text-lg">At <strong>Wasted or Worth It?</strong>, we believe your financial data belongs to you. This Privacy Policy outlines how we handle the information you provide when using our tools, including the **Freedom Runway Calculator** and the **Subscription Value Calculator**.</p>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">1. No Data Collection</h2>
              <p>We do not collect, store, or transmit any of the financial data you enter into our calculators to our servers. All calculations, including your inputs for savings, income, expenses, subscription costs, and usage frequencies, happen entirely within your browser (client-side).</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">2. Local Storage & Data Security</h2>
              <p>We use your browser's <code>localStorage</code> to save your inputs so you don't lose them if you refresh the page. This data never leaves your device and is secured to prevent casual access by third-party scripts. You can clear this at any time by clearing your browser cache or clicking the "Reset" buttons in the app.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">3. Third-Party Vendors and Cookies</h2>
              <p>We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to our website or other websites.</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
                <li>You may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>.</li>
                <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
              </ul>
              <p className="mt-4">For more detailed information regarding how we handle cookies, please refer to our <Link to="/cookies" className="text-indigo-400 hover:text-indigo-300 underline">Cookie Policy</Link>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">4. Analytics</h2>
              <p>We may use privacy-focused analytics (like simple page view counters) that do not track personal identifiable information (PII) to understand how our site is used and improve its performance.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
