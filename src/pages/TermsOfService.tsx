import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20 pt-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 font-bold transition-colors">
          <ArrowLeft size={20} /> Back to Calculator
        </Link>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
            <div className="bg-indigo-500/20 p-4 rounded-2xl text-indigo-400">
              <FileText size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">Terms of Service</h1>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            <p className="text-lg">By using <strong>Wasted or Worth It?</strong>, you agree to the following terms:</p>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">1. Usage & Purpose</h2>
              <p>This tool, including both the <strong>Freedom Runway Calculator</strong> and the <strong>Subscription Value Calculator</strong>, is provided for personal, entertainment, and informational purposes only. You are free to use it to estimate your expenses, track your subscriptions, and analyze your financial runway.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">2. No Financial Advice or Warranties</h2>
              <p>The software is provided "as is", without warranty of any kind, express or implied. We do not guarantee the accuracy, completeness, or usefulness of the calculations. The results depend entirely on user input and simplified assumptions, and should not be construed as professional financial advice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">3. Third-Party Links and Ads</h2>
              <p>Our website may display advertisements served by third-party vendors, such as Google AdSense, or contain links to external websites. We do not endorse and are not responsible for the content, privacy policies, or practices of any third-party websites or services. Any interaction with third-party ads or websites is strictly between you and that third party.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">4. Liability</h2>
              <p>We are not liable for any financial decisions, losses, or damages you make or incur based on the results provided by this tool.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
