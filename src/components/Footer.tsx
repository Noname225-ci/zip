import { Shield, FileText, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 mt-20 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-display font-bold text-white mb-4">
              Wasted <span className="text-indigo-400">or</span> Worth It?
            </h3>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Stop guessing where your money goes. Calculate your financial runway and discover the true cost of your subscriptions with our privacy-first, client-side tools.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <Shield size={14} /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <FileText size={14} /> Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <FileText size={14} /> Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <Shield size={14} /> Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Social</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61552394056042"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <Facebook size={14} /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs font-medium">
            &copy; {currentYear} Wasted or Worth It. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            This site is for informational purposes only and does not constitute financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
