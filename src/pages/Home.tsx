import { useState, useRef, FormEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  DollarSign,
  Activity,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ExternalLink,
  BarChart3,
  Search,
  ChevronDown,
  Check,
  Bell,
  Plus,
  Zap,
  TrendingUp,
  ChevronRight,
  Trash2,
  Download,
  Upload,
  Lock,
  Timer,
  Coffee,
  Banknote,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { subscriptionsData, categoryThresholds, defaultThresholds } from '../data/subscriptions';
import { categoryResources } from '../data/resources';
import '../index.css';
import { useCurrency } from '../context/CurrencyContext';
import { useSubscription } from '../context/SubscriptionContext';
import CurrencySelector from '../components/CurrencySelector';
import LanguageSelector from '../components/LanguageSelector';
import RunwayCalculator from '../components/RunwayCalculator';
import { secureStorage } from '../utils/secureStorage';

interface CalculationResult {
  monthlyCost: number;
  annualCost: number;
  dailyCost: number;
  costPerUse: number;
  usage: number;
  sub: typeof subscriptionsData[0];
  verdict: string;
  verdictClass: 'good' | 'consider' | 'wasted';
  detailMsg: string;
  meterPct: number;
  showSuggestions: boolean;
  breakEvenUses: number;
  lattesPerMonth: number;
  savingsProjection: { yr1: number; yr3: number; yr5: number } | null;
}

export default function Home() {
  const { t } = useTranslation();
  const { currency, formatCurrency } = useCurrency();
  const { addItem, items, removeItem, importItems, clearAll } = useSubscription();

  const [selectedSubId, setSelectedSubId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSubs, setFilteredSubs] = useState(subscriptionsData);

  const [cost, setCost] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [usage, setUsage] = useState('');

  const [billingDate, setBillingDate] = useState('');
  const [reminderDays, setReminderDays] = useState('3');
  const [isReminderSet, setIsReminderSet] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [addedToDashboard, setAddedToDashboard] = useState(false);
  const [runwayOpen, setRunwayOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsed = secureStorage.getItem<any>('wasted_subscription_data');
    if (parsed) {
      if (parsed.subId) {
        setSelectedSubId(parsed.subId);
        const sub = subscriptionsData.find(s => s.id === parsed.subId);
        if (sub) setSearchTerm(sub.name);
      }
      if (parsed.cost) setCost(parsed.cost);
      if (parsed.frequency) setFrequency(parsed.frequency);
      if (parsed.usage) setUsage(parsed.usage);
      if (parsed.billingDate) setBillingDate(parsed.billingDate);
      if (parsed.reminderDays) setReminderDays(parsed.reminderDays);
      if (parsed.isReminderSet) setIsReminderSet(parsed.isReminderSet);
      if (parsed.isReminderSet && parsed.billingDate) {
        checkReminder(parsed.billingDate, parsed.reminderDays, parsed.subId);
      }
    }
  }, []);

  const checkReminder = (dateStr: string, daysStr: string, subId: string) => {
    const due = new Date(dateStr);
    const days = parseInt(daysStr, 10) || 3;
    const today = new Date();
    const notifyDate = new Date(due);
    notifyDate.setDate(due.getDate() - days);
    if (today >= notifyDate && today <= due) {
      const subName = subscriptionsData.find(s => s.id === subId)?.name || 'Subscription';
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(`Renewing Soon: ${subName}`, {
          body: `Your subscription renews on ${due.toLocaleDateString()}. Time to cancel?`,
          icon: '/logo.png',
        });
      }
    }
  };

  const handleSaveReminder = async () => {
    if (!selectedSubId || !billingDate) {
      setError(t('reminder.permission_denied'));
      return;
    }
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError(t('reminder.permission_denied'));
        return;
      }
    }
    secureStorage.setItem('wasted_subscription_data', {
      subId: selectedSubId, cost, frequency, usage, billingDate, reminderDays, isReminderSet: true,
    });
    setIsReminderSet(true);
    setError('');
    new Notification(t('reminder.set_success'), {
      body: `${t('reminder.days_label')} ${reminderDays} ${t('reminder.days_before')} ${new Date(billingDate).toLocaleDateString()}.`,
    });
  };

  const clearReminder = () => {
    secureStorage.removeItem('wasted_subscription_data');
    setIsReminderSet(false);
    setBillingDate('');
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) { setFilteredSubs(subscriptionsData); return; }
    const lower = searchTerm.toLowerCase();
    const nameMatches = subscriptionsData.filter(s => s.name.toLowerCase().includes(lower) && !s.isGeneric);
    const catMatches = subscriptionsData.filter(s => s.category.toLowerCase().includes(lower));
    const generics = subscriptionsData.filter(s => s.isGeneric);
    let results = [...nameMatches, ...catMatches];
    const cats = new Set(results.map(r => r.category));
    results = [...results, ...generics.filter(g => cats.has(g.category))];
    if (results.length === 0) results = generics;
    results = results.filter((item, i, self) => i === self.findIndex(x => x.id === item.id));
    setFilteredSubs(results);
  }, [searchTerm]);

  const handleShareVerdict = async () => {
    const card = document.getElementById('verdict-share-card');
    if (!card) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(card, { backgroundColor: '#0a1628', scale: 2 });
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'my-subscription-verdict.png'; a.click();
        URL.revokeObjectURL(url);
      });
    } catch (e) { console.error(e); }
  };

  const handleSelectSub = (sub: typeof subscriptionsData[0]) => {
    setSelectedSubId(sub.id);
    setSearchTerm(sub.name);
    setIsDropdownOpen(false);
    setError('');
  };

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setAddedToDashboard(false);

    setTimeout(() => {
      const costValue = parseFloat(cost);
      const usageValue = parseInt(usage, 10);

      if (!selectedSubId) { setError(t('calculator.error_select')); setLoading(false); return; }
      if (isNaN(costValue) || costValue <= 0) { setError(t('calculator.error_cost')); setLoading(false); return; }
      if (isNaN(usageValue) || usageValue < 0) { setError(t('calculator.error_usage')); setLoading(false); return; }

      const sub = subscriptionsData.find(s => s.id === selectedSubId);
      if (!sub) { setLoading(false); return; }

      const monthlyCost = frequency === 'yearly' ? costValue / 12 : costValue;
      const annualCost = monthlyCost * 12;
      const dailyCost = monthlyCost / 30.44;
      const costPerUse = usageValue === 0 ? Infinity : monthlyCost / usageValue;
      const thresholds = categoryThresholds[sub.category] || defaultThresholds;

      let verdict: string, verdictClass: 'good' | 'consider' | 'wasted', detailMsg: string, meterPct: number, showSuggestions: boolean;

      const unit = t(`units.${thresholds.unit}`, thresholds.unit);
      const benchmark = formatCurrency(thresholds.good);
      const category = sub.category;

      if (costPerUse === Infinity) {
        verdict = t('verdict.wasted'); verdictClass = 'wasted';
        detailMsg = t('verdict.detail_zero', { cost: formatCurrency(monthlyCost), annual: formatCurrency(annualCost) });
        meterPct = 0; showSuggestions = true;
      } else if (costPerUse <= thresholds.good) {
        verdict = t('verdict.good'); verdictClass = 'good';
        detailMsg = t('verdict.detail_good', { cost: formatCurrency(costPerUse), unit, benchmark, category });
        meterPct = 100; showSuggestions = false;
      } else if (costPerUse <= thresholds.consider) {
        verdict = t('verdict.consider'); verdictClass = 'consider';
        detailMsg = t('verdict.detail_consider', { cost: formatCurrency(costPerUse), unit, benchmark, category });
        meterPct = 50; showSuggestions = true;
      } else {
        verdict = t('verdict.wasted'); verdictClass = 'wasted';
        detailMsg = t('verdict.detail_wasted', { cost: formatCurrency(costPerUse), unit, benchmark, category });
        meterPct = 20; showSuggestions = true;
      }

      const breakEvenUses = Math.ceil(monthlyCost / (thresholds.good || 1));
      const lattesPerMonth = monthlyCost / 6.50;
      const savingsProjection = verdictClass !== 'good'
        ? { yr1: annualCost, yr3: annualCost * 3, yr5: annualCost * 5 }
        : null;

      setResult({ monthlyCost, annualCost, dailyCost, costPerUse, usage: usageValue, sub, verdict, verdictClass, detailMsg, meterPct, showSuggestions, breakEvenUses, lattesPerMonth, savingsProjection });
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, 500);
  };

  const handleReset = () => {
    setSelectedSubId(''); setSearchTerm(''); setCost(''); setFrequency('monthly');
    setUsage(''); setResult(null); setError(''); setAddedToDashboard(false);
    setFilteredSubs(subscriptionsData);
  };

  const adjustUsage = (delta: number) => setUsage(String(Math.max(0, parseInt(usage || '0', 10) + delta)));

  const handleAddToDashboard = () => {
    if (!result) return;
    const alreadyAdded = items.some(i => i.name === result.sub.name);
    if (!alreadyAdded) {
      addItem({
        id: Date.now().toString(),
        name: result.sub.name,
        category: result.sub.category,
        cost: frequency === 'yearly' ? result.annualCost : result.monthlyCost,
        frequency: frequency as 'monthly' | 'yearly',
        usage: result.usage,
        verdict: result.verdictClass,
      });
    }
    setAddedToDashboard(true);
    setTimeout(() => setAddedToDashboard(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100 font-sans selection:bg-teal-500 selection:text-white pb-20">
      <SEO
        title="Wasted or Worth It? | Subscription and Financial Freedom Calculator"
        description="Calculate your financial freedom runway and the true cost-per-use of your subscriptions. Discover if your expenses are worth it with our free financial tools."
        keywords="financial freedom, freedom runway calculator, financial independence, FIRE calculator, subscription cost per use, subscription tracker, save money, budget optimization, recurring expense tracker, cancel subscriptions, personal finance tools, money management, cost per use calculator"
        canonical="https://wastedorworthit.com/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Wasted or Worth It? | Subscription and Financial Freedom Calculator',
          url: 'https://wastedorworthit.com/',
          description: 'Tools to calculate financial independence runway and track subscription value through cost-per-use analysis.',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      {/* ── HEADER ── */}
      <header className="bg-[#0d1e32]/90 border-b border-slate-700/60 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-1 rounded-xl text-white shadow-lg shadow-teal-500/20 rotate-3 hover:rotate-0 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Wasted or Worth It Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="text-xl font-bold tracking-tight text-white leading-none font-display">
              Wasted <span className="text-teal-400">or</span> Worth It?
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden md:flex gap-5 text-sm font-semibold text-slate-400 items-center">
              <a href="#calculator" className="hover:text-teal-400 transition-colors">{t('nav.subscriptions')}</a>
              {items.length > 0 && (
                <a href="#dashboard" className="hover:text-teal-400 transition-colors">{t('nav.dashboard')}</a>
              )}
              <a href="#runway" className="hover:text-teal-400 transition-colors">{t('nav.runway')}</a>
              <a href="#about" className="hover:text-teal-400 transition-colors">{t('nav.about')}</a>
            </nav>
            <LanguageSelector />
            <CurrencySelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 rounded-3xl p-8 md:p-14 text-white shadow-2xl relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
              {t('hero.headline1')}<br />
              <span className="text-teal-200">{t('hero.headline2')}</span>
            </h1>
            <p className="text-lg text-teal-50/90 max-w-xl font-medium leading-relaxed mb-6">
              {t('hero.sub')}
            </p>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-display font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition-colors active:scale-95"
            >
              {t('calculator.calculate_btn')} <ArrowRight size={18} />
            </a>
            <p className="mt-4 flex items-center gap-2 text-sm text-teal-100/70">
              <Lock size={13} className="shrink-0" />
              {t('trust.privacy_badge')}
            </p>
          </div>
        </motion.div>

        {/* ── HOW IT WORKS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-center text-2xl font-display font-bold text-white mb-6">{t('howItWorks.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Search size={26} />, title: t('howItWorks.step1_title'), desc: t('howItWorks.step1_desc'), cls: 'bg-teal-500/15 text-teal-400' },
              { icon: <Calculator size={26} />, title: t('howItWorks.step2_title'), desc: t('howItWorks.step2_desc'), cls: 'bg-indigo-500/15 text-indigo-400' },
              { icon: <TrendingUp size={26} />, title: t('howItWorks.step3_title'), desc: t('howItWorks.step3_desc'), cls: 'bg-amber-500/15 text-amber-400' },
            ].map((step, i) => (
              <div key={i} className="bg-[#0d1e32] rounded-2xl p-5 border border-slate-700/60 flex gap-4 items-start">
                <div className={`shrink-0 p-3 rounded-xl ${step.cls}`}>{step.icon}</div>
                <div>
                  <div className="font-display font-bold text-white mb-1">{step.title}</div>
                  <div className="text-sm text-slate-400 leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Calculator */}
          <div className="lg:col-span-8 space-y-6">

            <div id="calculator" className="bg-[#0d1e32] rounded-3xl p-6 md:p-8 border border-slate-700/60 shadow-xl">
              <div className="flex items-center gap-3 mb-7">
                <div className="bg-teal-500/20 p-3 rounded-2xl text-teal-400">
                  <Activity size={24} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">{t('calculator.title')}</h2>
              </div>

              <form onSubmit={handleCalculate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Service search */}
                  <div className="space-y-2 md:col-span-2" ref={dropdownRef}>
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">{t('calculator.service_label')}</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none z-10">
                        <Search size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder={t('calculator.service_placeholder')}
                        aria-label={t('calculator.service_label')}
                        className="min-w-0 w-full pl-12 pr-12 py-4 bg-slate-800 border border-slate-600 rounded-2xl text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-bold text-lg placeholder:text-slate-500 transition-all"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setIsDropdownOpen(true); if (selectedSubId) setSelectedSubId(''); }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onWheel={e => e.currentTarget.blur()}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown size={20} />
                      </div>
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto"
                          >
                            {filteredSubs.length > 0 ? (
                              <ul className="py-2">
                                {filteredSubs.map(sub => {
                                  const isSel = sub.id === selectedSubId;
                                  return (
                                    <li key={sub.id}>
                                      <button
                                        type="button"
                                        onClick={() => handleSelectSub(sub)}
                                        className={`w-full text-left px-6 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors ${isSel ? 'bg-teal-500/15 text-teal-300' : 'text-slate-200'}`}
                                      >
                                        <div>
                                          <span className="font-bold block">{sub.name}</span>
                                          <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{sub.category}</span>
                                        </div>
                                        {isSel && <Check size={18} className="text-teal-400" />}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <div className="p-6 text-center">
                                <p className="font-bold text-slate-300">{t('calculator.no_matches')}</p>
                                <p className="text-sm mt-1 text-slate-500">{t('calculator.no_matches_hint')}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">{t('calculator.cost_label')}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency.symbol}</span>
                      <input
                        type="number" step="0.01"
                        placeholder={t('calculator.cost_placeholder')}
                        aria-label={t('calculator.cost_label')}
                        className="min-w-0 w-full pl-9 pr-4 py-4 bg-slate-800 border border-slate-600 rounded-2xl text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-bold text-lg placeholder:text-slate-500"
                        value={cost}
                        onChange={e => setCost(e.target.value)}
                        onWheel={e => e.currentTarget.blur()}
                      />
                    </div>
                  </div>

                  {/* Billing */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">{t('calculator.billing_label')}</label>
                    <select
                      aria-label={t('calculator.billing_label')}
                      className="w-full px-4 py-4 bg-slate-800 border border-slate-600 rounded-2xl text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-bold text-lg"
                      value={frequency}
                      onChange={e => setFrequency(e.target.value)}
                    >
                      <option value="monthly">{t('calculator.billing_monthly')}</option>
                      <option value="yearly">{t('calculator.billing_yearly')}</option>
                    </select>
                  </div>

                  {/* Usage stepper */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">{t('calculator.usage_label')}</label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => adjustUsage(-1)} aria-label="Decrease usage"
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-700 text-white hover:bg-slate-600 active:scale-95 transition-all font-display text-2xl font-bold border border-slate-600">
                        −
                      </button>
                      <input
                        type="number" min="0" placeholder="0"
                        aria-label={t('calculator.usage_label')}
                        className="min-w-0 flex-1 text-center py-4 bg-slate-800 border border-slate-600 rounded-2xl text-white font-display text-2xl font-bold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        value={usage}
                        onChange={e => setUsage(e.target.value)}
                        onWheel={e => e.currentTarget.blur()}
                      />
                      <button type="button" onClick={() => adjustUsage(1)} aria-label="Increase usage"
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-700 text-white hover:bg-slate-600 active:scale-95 transition-all font-display text-2xl font-bold border border-slate-600">
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit" disabled={loading}
                    className="flex-1 bg-teal-500 hover:bg-teal-400 text-white font-display font-bold text-xl py-5 px-8 rounded-2xl shadow-lg shadow-teal-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? t('calculator.calculating_btn') : <>{t('calculator.calculate_btn')} <ArrowRight strokeWidth={3} /></>}
                  </button>
                  <button type="button" onClick={handleReset} aria-label={t('calculator.reset_btn')}
                    className="px-5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-2xl font-bold transition-colors border border-slate-600">
                    <RotateCcw size={20} />
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-5 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl flex items-center gap-3 font-bold text-sm"
                  >
                    <AlertTriangle size={18} className="shrink-0" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  id="results" ref={resultsRef}
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                  className="space-y-5"
                >
                  {/* Verdict */}
                  <div className={`rounded-3xl p-7 border-2 shadow-xl relative overflow-hidden
                    ${result.verdictClass === 'good'    ? 'bg-emerald-900/20 border-emerald-500/40'
                    : result.verdictClass === 'consider' ? 'bg-amber-900/20 border-amber-500/40'
                    :                                      'bg-rose-900/20 border-rose-500/40'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
                      <div className={`p-5 rounded-full shadow-lg flex items-center justify-center shrink-0
                        ${result.verdictClass === 'good'    ? 'bg-emerald-500 text-white'
                        : result.verdictClass === 'consider' ? 'bg-amber-500 text-white'
                        :                                      'bg-rose-500 text-white'}`}>
                        {result.verdictClass === 'good'    && <CheckCircle2 size={44} />}
                        {result.verdictClass === 'consider' && <AlertTriangle size={44} />}
                        {result.verdictClass === 'wasted'   && <XCircle size={44} />}
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h3 className={`text-3xl md:text-4xl font-display font-bold mb-1
                          ${result.verdictClass === 'good'    ? 'text-emerald-400'
                          : result.verdictClass === 'consider' ? 'text-amber-400'
                          :                                      'text-rose-400'}`}>
                          {result.verdict}
                        </h3>
                        <p className="text-base text-slate-300 font-medium leading-relaxed">{result.detailMsg}</p>
                      </div>
                      <button
                        onClick={handleAddToDashboard}
                        className={`shrink-0 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 border shadow-md text-sm
                          ${addedToDashboard
                            ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                            : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'}`}
                      >
                        {addedToDashboard
                          ? <><Check size={17} /> {t('verdict.added')}</>
                          : <><Plus size={17} /> {t('verdict.add_dashboard')}</>}
                      </button>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard label={t('verdict.cost_per_use')} value={result.costPerUse === Infinity ? '∞' : formatCurrency(result.costPerUse)} highlight />
                    <MetricCard label={t('verdict.monthly_cost')} value={formatCurrency(result.monthlyCost)} />
                    <MetricCard label={t('verdict.annual_cost')} value={formatCurrency(result.annualCost)} />
                    <MetricCard label={t('verdict.daily')} value={formatCurrency(result.dailyCost)} />
                  </div>

                  {/* Financial Insights */}
                  <div className="bg-[#0d1e32] rounded-2xl p-5 border border-slate-700/60 space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp size={15} className="text-teal-400" /> {t('verdict.insights_title')}
                    </h4>

                    {/* Break-even */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-teal-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} className="text-teal-400" />
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {t('verdict.break_even_needs')}{' '}
                        <span className="font-bold text-white">{result.breakEvenUses}×</span>{' '}
                        {t('verdict.break_even_times')}
                        {result.usage > 0 && result.usage < result.breakEvenUses && (
                          <span className="text-rose-400 font-bold"> {t('verdict.break_even_short', { count: result.breakEvenUses - result.usage })}</span>
                        )}
                        {result.usage > 0 && result.usage >= result.breakEvenUses && (
                          <span className="text-emerald-400 font-bold"> {t('verdict.break_even_good')}</span>
                        )}
                      </p>
                    </div>

                    {/* Latte comparison */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Coffee size={14} className="text-amber-400" />
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {t('verdict.latte_roughly')}{' '}
                        <span className="font-bold text-amber-300">{result.lattesPerMonth.toFixed(1)}</span>{' '}
                        {t('verdict.latte_unit')}
                      </p>
                    </div>

                    {/* Savings projection */}
                    {result.savingsProjection && (
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Banknote size={14} className="text-emerald-400" />
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {t('verdict.cancel_pre')}{' '}
                          <span className="font-bold text-emerald-400">{formatCurrency(result.savingsProjection.yr1)}</span> {t('verdict.cancel_this_year')}{' '}
                          <span className="font-bold text-emerald-400">{formatCurrency(result.savingsProjection.yr3)}</span> {t('verdict.cancel_3yr')}{' '}
                          <span className="font-bold text-emerald-400">{formatCurrency(result.savingsProjection.yr5)}</span> {t('verdict.cancel_5yr')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── Runway Impact ── */}
                  <div className="bg-gradient-to-r from-indigo-900/30 to-teal-900/20 rounded-2xl p-5 border border-indigo-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Timer size={16} className="text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {t('verdict.runway_impact', {
                            cost: formatCurrency(result.monthlyCost),
                            days: Math.round(result.monthlyCost / (2000 / 30.44)),
                            annual: formatCurrency(result.annualCost)
                          })}
                        </p>
                        <a
                          href="#runway"
                          className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          {t('verdict.runway_cta')} <ChevronRight size={13} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ── Share verdict card ── */}
                  <div id="verdict-share-card" className="bg-[#0a1628] rounded-2xl p-5 border border-slate-700/40">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('verdict.share_title')}</span>
                      <button
                        onClick={handleShareVerdict}
                        className="flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Download size={13} /> {t('verdict.share_download')}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display font-bold text-white text-lg">{result.sub.name}</div>
                        <div className="text-slate-400 text-sm">{formatCurrency(result.monthlyCost)}/mo · {result.usage}× per month</div>
                      </div>
                      <div className={`text-sm font-bold px-4 py-2 rounded-xl border
                        ${result.verdictClass === 'good'    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : result.verdictClass === 'consider' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'}`}>
                        {result.verdict}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700/40 text-[10px] text-slate-600 text-right">wastedorworthit.com</div>
                  </div>

                  <ResourcesContent sub={result.sub} />

                  {/* Reminder */}
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/60">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Bell size={15} className="text-teal-400" /> {t('reminder.title')}
                      </span>
                      {isReminderSet && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20">
                          <Check size={12} /> Saved
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-center">
                      <input
                        type="date" aria-label={t('reminder.billing_date_label')}
                        className="min-w-0 w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-2xl text-white focus:ring-2 focus:ring-teal-500 outline-none font-bold appearance-none"
                        value={billingDate} onChange={e => setBillingDate(e.target.value)}
                      />
                      <div className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-600 rounded-2xl px-3 py-3">
                        <span className="text-slate-300 font-bold text-sm">{t('reminder.days_label')}</span>
                        <input
                          type="number" min="1" max="30"
                          className="min-w-[3rem] w-12 bg-transparent border-b border-slate-600 text-white focus:border-teal-500 outline-none font-bold text-lg text-center"
                          value={reminderDays} onChange={e => setReminderDays(e.target.value)} onWheel={e => e.currentTarget.blur()}
                        />
                        <span className="text-slate-300 font-bold text-sm">{t('reminder.days_before')}</span>
                      </div>
                      <button type="button" onClick={handleSaveReminder}
                        className={`py-3 px-5 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 border text-sm
                          ${isReminderSet
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-teal-500 hover:bg-teal-400 text-white border-transparent shadow-md'}`}
                      >
                        <Bell size={17} />
                        {isReminderSet ? t('reminder.saved') : t('reminder.set_btn')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-4 space-y-5">

            <AnimatePresence>
              {isReminderSet && billingDate && (
                <motion.div
                  initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                  className="bg-[#0d1e32] rounded-3xl p-6 border border-teal-500/30 shadow-lg shadow-teal-500/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-teal-400"><Bell size={80} /></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1"><Bell size={12} /> {t('reminder.active')}</span>
                      <button onClick={clearReminder} aria-label="Clear reminder" className="text-slate-500 hover:text-rose-400 transition-colors">
                        <XCircle size={16} />
                      </button>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-1">{searchTerm || 'Subscription'}</h3>
                    <div className="text-3xl font-bold text-teal-300 mb-1">
                      {new Date(billingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                      {t('reminder.renews_in', { days: Math.ceil((new Date(billingDate).getTime() - Date.now()) / 86400000) })}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="bg-[#0d1e32] rounded-3xl p-6 border border-slate-700/60 shadow-xl space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <BarChart3 className="text-teal-400" />
                <h3 className="font-display font-bold text-xl text-white">{t('sidebar.did_you_know')}</h3>
              </div>
              <div className="bg-teal-500/10 p-4 rounded-2xl border border-teal-500/20">
                <div className="text-3xl font-display font-bold text-teal-400 mb-0.5">{formatCurrency(273)}</div>
                <div className="text-xs font-bold text-teal-200/80 uppercase tracking-wide">{t('sidebar.avg_monthly')}</div>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20">
                <div className="text-3xl font-display font-bold text-purple-400 mb-0.5">42%</div>
                <div className="text-xs font-bold text-purple-200/80 uppercase tracking-wide">{t('sidebar.unused')}</div>
              </div>
              <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                <div className="text-3xl font-display font-bold text-amber-400 mb-0.5">{formatCurrency(3276)}</div>
                <div className="text-xs font-bold text-amber-200/80 uppercase tracking-wide">{t('sidebar.potential_savings')}</div>
              </div>
            </div>

            {/* Quick Tip */}
            <div className="sticky top-24 bg-[#0d1e32] rounded-3xl p-5 border border-slate-700/60">
              <div className="flex items-center gap-2 mb-3 text-amber-400">
                <Lightbulb size={18} />
                <h4 className="font-bold text-sm uppercase tracking-wider">{t('sidebar.quick_tip')}</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t('sidebar.quick_tip_text')}
              </p>
            </div>
          </div>
        </div>

        {/* ── SUBSCRIPTION DASHBOARD ── */}
        <SubscriptionDashboard />

        {/* ── RUNWAY CALCULATOR (collapsible) ── */}
        <div id="runway" className="mt-16">
          <button
            onClick={() => setRunwayOpen(v => !v)}
            className="w-full flex items-center justify-between bg-[#0d1e32] hover:bg-[#0f2540] border border-slate-700/60 rounded-2xl px-6 py-5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-teal-500/20 p-3 rounded-xl text-teal-400">
                <DollarSign size={22} />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-white text-lg">{t('runway.toggle_label')}</div>
                <div className="text-sm text-slate-400">{t('runway.toggle_sub')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-teal-400">
              <span className="hidden sm:inline">{runwayOpen ? t('runway.collapse') : t('runway.expand')}</span>
              <ChevronRight size={20} className={`transition-transform ${runwayOpen ? 'rotate-90' : ''}`} />
            </div>
          </button>

          <AnimatePresence>
            {runwayOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <RunwayCalculator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── ABOUT ── */}
        <section id="about" className="mt-20 mb-8">
          <div className="bg-[#0d1e32] rounded-3xl border border-slate-700/50 p-8 md:p-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/15 flex items-center justify-center shrink-0">
                <Search size={20} className="text-teal-400" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">Why This Exists</h2>
            </div>

            <div className="space-y-5 text-slate-300 leading-relaxed text-[15px]">
              <p>
                The average person pays for <span className="text-white font-semibold">12 subscriptions a month</span> and actively uses fewer than half of them.
                The rest run silently in the background. Nine dollars here, fifteen there. By the time the annual total hits, nobody can explain where the money went.
              </p>
              <p>
                We built this because every other tool that claims to help you with this
                either asks for your <span className="text-white font-semibold">bank login</span>,
                requires you to <span className="text-white font-semibold">create an account</span>,
                or buries the answer under a subscription of its own.
                None of that made sense.
              </p>
              <p>
                The math is not complicated. If you pay $15/month for something you use 3 times,
                each use costs $5. Whether that is a good deal depends entirely on
                <span className="text-white font-semibold">what you are buying.</span> A gym visit at $5 is a bargain. A Netflix stream at $5 is a waste. We built that distinction in.
              </p>
              <p>
                Everything runs in your browser. No data is sent anywhere.
                No account, no email, no tracking.
                Your financial information is yours.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { icon: <ShieldCheck size={20} className="text-teal-400" />, bg: 'bg-teal-500/15', label: 'Zero data collection', sub: 'Runs 100% in your browser' },
                { icon: <Zap size={20} className="text-amber-400" />,        bg: 'bg-amber-500/15',  label: 'Instant verdict',       sub: 'No signup, no waiting' },
                { icon: <Target size={20} className="text-indigo-400" />,    bg: 'bg-indigo-500/15', label: 'Category-smart',        sub: 'Different bar for gym vs. streaming' },
              ] as const).map(({ icon, bg, label, sub }) => (
                <div key={label} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/40 text-center">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>{icon}</div>
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="text-xs text-slate-500 mt-1">{sub}</div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-slate-600 text-center">
              No ads influence the verdicts. No affiliate relationship changes what we recommend.
              The calculator gives you the math. What you do with it is up to you.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

function MetricCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center
      ${highlight ? 'bg-slate-800 border-teal-500/40 shadow-lg shadow-teal-500/10' : 'bg-slate-800/50 border-slate-700/60'}`}>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-2xl font-display font-bold ${highlight ? 'text-teal-300' : 'text-slate-200'}`}>{value}</span>
    </div>
  );
}

function SubscriptionDashboard() {
  const { t } = useTranslation();
  const { items, removeItem, importItems, clearAll, totalMonthlyCost, totalYearlyCost, wastedCount } = useSubscription();
  const { formatCurrency } = useCurrency();

  if (items.length === 0) return null;

  const handleExport = () => {
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'my-subscriptions.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) { importItems(parsed); }
      } catch { alert('Invalid file format.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const moneyPitSavings = items
    .filter(i => i.verdict === 'wasted')
    .reduce((acc, i) => acc + (i.frequency === 'yearly' ? i.cost / 12 : i.cost), 0) * 12;

  return (
    <motion.div
      id="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500/20 p-3 rounded-2xl text-teal-400">
            <BarChart3 size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-white">{t('dashboard.title')}</h2>
            <p className="text-sm text-slate-400">{items.length === 1 ? t('dashboard.subtitle_one', { count: 1 }) : t('dashboard.subtitle_other', { count: items.length })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl transition-colors"
          >
            <Download size={13} /> {t('dashboard.export')}
          </button>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            <Upload size={13} /> {t('dashboard.import')}
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#0d1e32] rounded-2xl p-4 border border-teal-500/30 text-center">
          <div className="text-2xl font-display font-bold text-teal-300">{formatCurrency(totalMonthlyCost)}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{t('dashboard.monthly_total')}</div>
        </div>
        <div className="bg-[#0d1e32] rounded-2xl p-4 border border-slate-700/60 text-center">
          <div className="text-2xl font-display font-bold text-slate-200">{formatCurrency(totalYearlyCost)}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{t('dashboard.yearly_total')}</div>
        </div>
        <div className="bg-[#0d1e32] rounded-2xl p-4 border border-rose-500/20 text-center">
          <div className="text-2xl font-display font-bold text-rose-400">{wastedCount}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{t('dashboard.money_pits')}</div>
        </div>
        <div className="bg-[#0d1e32] rounded-2xl p-4 border border-emerald-500/20 text-center">
          <div className="text-2xl font-display font-bold text-emerald-400">{formatCurrency(moneyPitSavings)}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{t('dashboard.saveable_yearly')}</div>
        </div>
      </div>

      {/* Items list */}
      <div className="bg-[#0d1e32] rounded-3xl border border-slate-700/60 shadow-xl overflow-hidden">
        <div className="divide-y divide-slate-700/40">
          {items.map(item => {
            const monthlyCost = item.frequency === 'yearly' ? item.cost / 12 : item.cost;
            return (
              <div key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0
                    ${item.verdict === 'good' ? 'bg-emerald-400'
                    : item.verdict === 'consider' ? 'bg-amber-400'
                    : 'bg-rose-400'}`} />
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{item.name}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">{item.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-slate-200 text-sm">{formatCurrency(monthlyCost)}/mo</div>
                    <div className="text-xs text-slate-500">{item.usage}× /mo</div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full hidden sm:inline
                    ${item.verdict === 'good' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    : item.verdict === 'consider' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'}`}>
                    {t(`verdict.${item.verdict}`)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`${t('dashboard.remove')} ${item.name}`}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ResourcesContent({ sub }: { sub: typeof subscriptionsData[0] }) {
  const { t } = useTranslation();
  const catRes = categoryResources[sub.category];

  return (
    <div className="space-y-5 pt-5 border-t border-slate-700/60">
      <div className="flex items-center gap-3">
        <Zap className="text-teal-400" size={20} />
        <h3 className="text-xl font-display font-bold text-white">{t('verdict.alternatives_title')}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sub.alternatives?.map((alt, idx) => (
          <a key={idx} href={alt.link || '#'} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700/60 transition-colors group">
            <span className="font-bold text-slate-200 group-hover:text-white text-sm">{alt.name}</span>
            {alt.link && <ExternalLink size={15} className="text-slate-500 group-hover:text-teal-400 shrink-0 ml-2" />}
          </a>
        ))}
      </div>

      {sub.tips && sub.tips.length > 0 && (
        <div className="bg-amber-500/8 rounded-2xl p-5 border border-amber-500/20">
          <h4 className="font-bold text-amber-300 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Lightbulb size={14} /> {t('verdict.tips_title')}
          </h4>
          <ul className="space-y-2">
            {sub.tips.map((tip, i) => (
              <li key={i} className="text-slate-300 text-sm leading-relaxed flex gap-2">
                <span className="text-amber-400 font-bold shrink-0">·</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {catRes && (
        <div className="bg-teal-900/20 rounded-2xl p-5 border border-teal-500/20">
          <h4 className="font-bold text-teal-300 mb-3 text-sm uppercase tracking-wider">
            {t('resources.title')} {sub.category}
          </h4>
          <div className="space-y-2">
            {catRes.freeSites.map((site: any, idx: number) => (
              <a key={idx} href={site.url} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-2 text-slate-300 hover:text-teal-300 transition-colors text-sm group">
                <span>{site.icon}</span>
                <span>
                  <span className="font-bold group-hover:underline underline-offset-4 decoration-teal-500">{site.name}</span>
                  <span className="text-slate-500">, {site.desc}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
