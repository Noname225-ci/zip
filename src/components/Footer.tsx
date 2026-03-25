import { Shield, FileText, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/60 mt-20 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-display font-bold text-white mb-4">
              Wasted <span className="text-teal-400">or</span> Worth It?
            </h3>
            <p className="text-slate-300 text-sm max-w-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <Shield size={14} className="shrink-0" /> {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <FileText size={14} className="shrink-0" /> {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <FileText size={14} className="shrink-0" /> {t('footer.disclaimer')}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <Shield size={14} className="shrink-0" /> {t('footer.cookies')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('footer.social')}</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61552394056042"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors flex items-center gap-2"
                >
                  <Facebook size={14} className="shrink-0" /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {currentYear} Wasted or Worth It. {t('footer.copyright')}
          </p>
          <p className="text-slate-400 text-xs text-center md:text-right">
            {t('footer.disclaimer_short')}
          </p>
        </div>
      </div>
    </footer>
  );
}
