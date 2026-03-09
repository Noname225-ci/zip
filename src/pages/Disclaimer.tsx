import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20 pt-24">
      <SEO
        title="Disclaimer"
        description="Important financial disclaimer for Wasted or Worth It? tools. Our calculators are for informational purposes only."
        keywords="financial disclaimer, not financial advice, investment warning, educational tools"
        canonical="https://wastedorworthit.com/disclaimer"
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 font-bold transition-colors">
          <ArrowLeft size={20} /> Back to Calculator
        </Link>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
            <div className="bg-indigo-500/20 p-4 rounded-2xl text-indigo-400">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">Financial Disclaimer</h1>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 text-amber-400 font-bold text-lg">
              This website does not provide financial advice.
            </div>

            <p className="text-lg">The information and calculations provided by <strong>Wasted or Worth It?</strong> are for educational and informational purposes only.</p>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">Not Professional Advice</h2>
              <p>We are not financial advisors, accountants, or tax professionals. The "Freedom Runway" and subscription valuations are estimates based on the numbers you provide.</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">Do Your Own Research</h2>
              <p>Before making significant financial decisions (like quitting a job, cancelling essential services, or changing investments), please consult with a qualified financial professional who understands your specific situation.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
