import { useState, useRef, FormEvent, useEffect } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  DollarSign,
  Calendar,
  Activity,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ExternalLink,
  TrendingDown,
  Info,
  BarChart3,
  Search,
  ChevronDown,
  Check,
  Bell,
  Plus
} from 'lucide-react';
import { subscriptionsData, categoryThresholds, defaultThresholds } from '../data/subscriptions';
import { categoryResources } from '../data/resources';
import '../index.css';
import { useCurrency } from '../context/CurrencyContext';
import { useSubscription } from '../context/SubscriptionContext';
import CurrencySelector from '../components/CurrencySelector';
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
}


// ... existing imports ...

export default function Home() {
  const { currency, formatCurrency } = useCurrency();
  const { addItem } = useSubscription();

  const [selectedSubId, setSelectedSubId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSubs, setFilteredSubs] = useState(subscriptionsData);

  const [cost, setCost] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [usage, setUsage] = useState('');

  // Reminder State
  const [billingDate, setBillingDate] = useState('');
  const [reminderDays, setReminderDays] = useState('3');
  const [isReminderSet, setIsReminderSet] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved data on mount
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

      // Check for due reminders immediately
      if (parsed.isReminderSet && parsed.billingDate) {
        checkReminder(parsed.billingDate, parsed.reminderDays, parsed.subId);
      }
    }
  }, []);

  const checkReminder = (dateStr: string, daysStr: string, subId: string) => {
    const due = new Date(dateStr);
    const days = parseInt(daysStr, 10) || 3;
    const today = new Date();

    // Calculate date to notify
    const notifyDate = new Date(due);
    notifyDate.setDate(due.getDate() - days);

    // If today is after or equal to notify date, and before the actual due date (optional logic)
    if (today >= notifyDate && today <= due) {
      const subName = subscriptionsData.find(s => s.id === subId)?.name || 'Subscription';

      // Browser Notification
      if (Notification.permission === 'granted') {
        new Notification(`Renewing Soon: ${subName}`, {
          body: `Your subscription renews on ${due.toLocaleDateString()}. Time to cancel?`,
          icon: '/logo.png' // Fallback icon
        });
      }
    }
  };

  const handleSaveReminder = async () => {
    if (!selectedSubId || !billingDate) {
      setError("Please select a subscription and billing date to set a reminder.");
      return;
    }

    // Request Permission
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError("We need notification permission to remind you!");
        return;
      }
    }

    // Save to LocalStorage
    const dataToSave = {
      subId: selectedSubId,
      cost,
      frequency,
      usage,
      billingDate,
      reminderDays,
      isReminderSet: true
    };

    secureStorage.setItem('wasted_subscription_data', dataToSave);
    setIsReminderSet(true);
    setError('');

    // Show a browser notification immediately as a test/confirmation
    new Notification("Reminder Set!", {
      body: `We'll remind you ${reminderDays} days before ${new Date(billingDate).toLocaleDateString()}.`
    });
  };

  const clearReminder = () => {
    secureStorage.removeItem('wasted_subscription_data');
    setIsReminderSet(false);
    setBillingDate('');
    handleReset(); // Optional: clear form too? Maybe just clear reminder state.
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter subscriptions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubs(subscriptionsData);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();

    // 1. Exact/Partial Name Matches (excluding generics initially)
    const nameMatches = subscriptionsData.filter(sub =>
      sub.name.toLowerCase().includes(lowerTerm) && !sub.isGeneric
    );

    // 2. Category Matches
    const categoryMatches = subscriptionsData.filter(sub =>
      sub.category.toLowerCase().includes(lowerTerm)
    );

    // 3. Generic Fallbacks
    const genericMatches = subscriptionsData.filter(sub => sub.isGeneric);

    let results = [...nameMatches];

    // If we have category matches, include them
    if (categoryMatches.length > 0) {
      results = [...results, ...categoryMatches];
    }

    // If few results, or if the user might be looking for a category, suggest relevant generics
    // Find generics that match the categories of the results found so far
    const relevantCategories = new Set(results.map(r => r.category));
    const relevantGenerics = genericMatches.filter(g => relevantCategories.has(g.category));

    results = [...results, ...relevantGenerics];

    // If still no results, show ALL generics as fallback (Closest Category logic)
    if (results.length === 0) {
      results = genericMatches;
    }

    // Deduplicate by ID
    results = results.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );

    setFilteredSubs(results);
  }, [searchTerm]);

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

    setTimeout(() => {
      const costValue = parseFloat(cost);
      const usageValue = parseInt(usage, 10);

      if (!selectedSubId) {
        setError("Please select a subscription service from the list.");
        setLoading(false);
        return;
      }
      if (isNaN(costValue) || costValue < 0) {
        setError("Please enter a valid cost.");
        setLoading(false);
        return;
      }
      if (isNaN(usageValue) || usageValue < 0) {
        setError("Please enter usage frequency.");
        setLoading(false);
        return;
      }

      const sub = subscriptionsData.find(s => s.id === selectedSubId);
      if (!sub) {
        setError("Subscription not found.");
        setLoading(false);
        return;
      }

      const monthlyCost = frequency === 'yearly' ? costValue / 12 : costValue;
      const annualCost = monthlyCost * 12;
      const dailyCost = monthlyCost / 30.44;
      const costPerUse = usageValue === 0 ? Infinity : monthlyCost / usageValue;

      const thresholds = categoryThresholds[sub.category] || defaultThresholds;
      const THRESHOLD_GOOD = thresholds.good;
      const THRESHOLD_CONSIDER = thresholds.consider;

      let verdict, verdictClass: 'good' | 'consider' | 'wasted', detailMsg, meterPct, showSuggestions;

      if (costPerUse === Infinity) {
        verdict = "Total Waste";
        verdictClass = "wasted";

        detailMsg = `You're paying ${formatCurrency(monthlyCost)}/mo for nothing. That's ${formatCurrency(annualCost)} a year gone.`;
        meterPct = 0;
        showSuggestions = true;
      } else if (costPerUse <= THRESHOLD_GOOD) {
        verdict = "Great Value!";
        verdictClass = "good";

        detailMsg = `At ${formatCurrency(costPerUse)} per use, this is a steal. Keep it!`;
        meterPct = 100;
        showSuggestions = false;
      } else if (costPerUse <= THRESHOLD_CONSIDER) {
        verdict = "Meh, It's Okay";
        verdictClass = "consider";

        detailMsg = `${formatCurrency(costPerUse)} per use is a bit steep. Use it more or find a deal.`;
        meterPct = 50;
        showSuggestions = true;
      } else {
        verdict = "Money Pit";
        verdictClass = "wasted";

        detailMsg = `At ${formatCurrency(costPerUse)} per use, you're overpaying. Cancel or downgrade.`;
        meterPct = 20;
        showSuggestions = true;
      }

      setResult({
        monthlyCost,
        annualCost,
        dailyCost,
        costPerUse,
        usage: usageValue,
        sub,
        verdict,
        verdictClass,
        detailMsg,
        meterPct,
        showSuggestions
      });
      setLoading(false);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 600);
  };

  const handleReset = () => {
    setSelectedSubId('');
    setSearchTerm('');
    setCost('');
    setFrequency('monthly');
    setUsage('');
    setResult(null);
    setError('');
    setFilteredSubs(subscriptionsData);
  };

  const adjustUsage = (delta: number) => {
    const current = parseInt(usage || '0', 10);
    const next = Math.max(0, current + delta);
    setUsage(next.toString());
  };

  const handleAddToDashboard = () => {
    if (result) {
      addItem({
        id: Date.now().toString(),
        name: result.sub.name,
        category: result.sub.category,
        cost: frequency === 'yearly' ? result.annualCost : result.monthlyCost,
        frequency: frequency as 'monthly' | 'yearly',
        usage: result.usage,
        verdict: result.verdictClass
      });
      // Optional: Show toast or feedback
      const btn = document.getElementById('add-dashboard-btn');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg> Added!</span>';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      <SEO
        title="Freedom Runway & Subscription Value Calculator"
        description="Calculate your financial freedom runway and the true cost-per-use of your subscriptions. Discover if your expenses are worth it with our free financial tools."
        keywords="financial freedom, freedom runway calculator, financial independence, FIRE calculator, subscription cost per use, subscription tracker, save money, budget optimization, recurring expense tracker, cancel subscriptions, personal finance tools, money management, cost per use calculator"
        canonical="https://wastedorworthit.com/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Freedom Runway & Subscription Value Calculator",
          "url": "https://wastedorworthit.com/",
          "description": "Tools to calculate financial independence runway and track subscription value through cost-per-use analysis.",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />

      {/* Header */}
      <header className="bg-[#1e293b]/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-1 rounded-xl text-white shadow-lg shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Wasted or Worth It Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-white leading-none font-display">
                Wasted <span className="text-indigo-400">or</span> Worth It?
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 text-sm font-bold text-slate-400 items-center">
              <a href="#runway" className="hover:text-white transition-colors">Runway</a>
              <a href="#calculator" className="hover:text-white transition-colors">Subscriptions</a>
            </nav>
            <CurrencySelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">

        {/* 1. FREEDOM RUNWAY CALCULATOR */}
        <div id="runway" className="mb-20">
          <RunwayCalculator />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN (Main Content) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
                  Stop Guessing. <br />
                  <span className="text-indigo-200">Calculate Your Financial Freedom.</span>
                </h1>
                <p className="text-lg text-indigo-100 max-w-xl font-medium">
                  Find out exactly how much each watch, listen, or session actually costs you. Is it worth it?
                </p>
              </div>
            </motion.div>

            {/* Calculator Card */}
            <div id="calculator" className="bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-700 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400">
                  <Activity size={24} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white">Calculate Value</h3>
              </div>

              <form onSubmit={handleCalculate} className="space-y-8">
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-3 md:col-span-2" ref={dropdownRef}>
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">1. Service</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10">
                        <Search size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="Search subscription (e.g. Netflix, Gym...)"
                        className="min-w-0 w-full pl-12 pr-12 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg placeholder:text-slate-600 transition-all"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsDropdownOpen(true);
                          if (selectedSubId) setSelectedSubId(''); // Clear selection if user types
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <ChevronDown size={20} />
                      </div>

                      {/* Dropdown List */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                          >
                            {filteredSubs.length > 0 ? (
                              <ul className="py-2">
                                {filteredSubs.map((sub) => {
                                  const isSelected = sub.id === selectedSubId;
                                  return (
                                    <li key={sub.id}>
                                      <button
                                        type="button"
                                        onClick={() => handleSelectSub(sub)}
                                        className={`w-full text-left px-6 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-200'}`}
                                      >
                                        <div>
                                          <span className="font-bold block">{sub.name}</span>
                                          <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{sub.category}</span>
                                        </div>
                                        {isSelected && <Check size={18} className="text-indigo-400" />}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <div className="p-6 text-center text-slate-500">
                                <p className="font-bold">No matches found.</p>
                                <p className="text-sm mt-1">Try searching for a category like "Music" or "Fitness".</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">2. Cost</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{currency.symbol}</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="15.99"
                        className="min-w-0 w-full pl-8 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg placeholder:text-slate-600"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Billing</label>
                    <select
                      className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">3. Uses per Month</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => adjustUsage(-1)}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all font-display text-2xl font-bold border border-slate-600"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="min-w-0 flex-1 text-center py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white font-display text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={usage}
                        onChange={(e) => setUsage(e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      <button
                        type="button"
                        onClick={() => adjustUsage(1)}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all font-display text-2xl font-bold border border-slate-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-display font-bold text-xl py-5 px-8 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? 'Calculating...' : <>Calculate <ArrowRight strokeWidth={3} /></>}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold transition-colors border border-slate-700"
                  >
                    <RotateCcw />
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3 font-bold"
                  >
                    <AlertTriangle size={20} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  id="results"
                  ref={resultsRef}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Verdict Card */}
                  <div className={`
                    rounded-3xl p-8 border-2 shadow-xl relative overflow-hidden
                    ${result.verdictClass === 'good' ? 'bg-emerald-900/30 border-emerald-500/50' :
                      result.verdictClass === 'consider' ? 'bg-amber-900/30 border-amber-500/50' :
                        'bg-rose-900/30 border-rose-500/50'}
                  `}>
                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                      <div className={`
                        p-6 rounded-full shadow-lg flex items-center justify-center
                        ${result.verdictClass === 'good' ? 'bg-emerald-500 text-white' :
                          result.verdictClass === 'consider' ? 'bg-amber-500 text-white' :
                            'bg-rose-500 text-white'}
                      `}>
                        {result.verdictClass === 'good' && <CheckCircle2 size={48} />}
                        {result.verdictClass === 'consider' && <AlertTriangle size={48} />}
                        {result.verdictClass === 'wasted' && <XCircle size={48} />}
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h3 className={`text-3xl md:text-4xl font-display font-bold mb-2
                          ${result.verdictClass === 'good' ? 'text-emerald-400' :
                            result.verdictClass === 'consider' ? 'text-amber-400' :
                              'text-rose-400'}
                        `}>
                          {result.verdict}
                        </h3>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed">
                          {result.detailMsg}
                        </p>
                      </div>
                      <button
                        id="add-dashboard-btn"
                        onClick={handleAddToDashboard}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 border border-slate-600 shadow-lg"
                      >
                        <Plus size={20} /> Add to Dashboard
                      </button>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard label="Cost / Use" value={result.costPerUse === Infinity ? '∞' : formatCurrency(result.costPerUse)} highlight />
                    <MetricCard label="Monthly" value={formatCurrency(result.monthlyCost)} />
                    <MetricCard label="Yearly" value={formatCurrency(result.annualCost)} />
                    <MetricCard label="Daily" value={formatCurrency(result.dailyCost)} />
                  </div>

                  {/* Resources */}
                  <ResourcesContent sub={result.sub} />

                  {/* Reminder Section (Moved Here) */}
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Bell size={16} className="text-indigo-400" /> Set Renewal Reminder
                      </label>
                      {isReminderSet && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20">
                          <Check size={12} /> Saved
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                      <div className="relative">
                        <input
                          type="date"
                          className="min-w-0 w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg placeholder:text-slate-600 appearance-none"
                          value={billingDate}
                          onChange={(e) => setBillingDate(e.target.value)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-bold pointer-events-none uppercase tracking-wider bg-slate-800 px-1 rounded">Next Bill</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 rounded-2xl px-3 py-3">
                        <span className="text-slate-400 font-bold text-sm">Remind me</span>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          className="min-w-[3rem] w-12 bg-transparent border-b border-slate-700 text-white focus:border-indigo-500 outline-none font-bold text-lg text-center"
                          value={reminderDays}
                          onChange={(e) => setReminderDays(e.target.value)}
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                        <span className="text-slate-300 font-bold text-sm">days before</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveReminder}
                        className={`h-full py-3 px-6 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 border ${isReminderSet ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-indigo-500 hover:bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/20'}`}
                      >
                        <Bell size={20} className={isReminderSet ? "fill-emerald-400/20" : ""} />
                        <span>{isReminderSet ? 'Reminder Saved' : 'Save Reminder'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Active Reminder Card (Sidebar) */}
            <AnimatePresence>
              {isReminderSet && billingDate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="bg-slate-800 rounded-3xl p-6 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Bell size={80} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                        <Bell size={12} /> Active Reminder
                      </span>
                      <button onClick={clearReminder} className="text-slate-500 hover:text-rose-400 transition-colors">
                        <XCircle size={16} />
                      </button>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-1">{searchTerm || 'Subscription'}</h3>
                    <div className="text-3xl font-bold text-slate-200 mb-1">
                      {new Date(billingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                      Renews in {Math.ceil((new Date(billingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Card (Bento Style) */}
            <div className="bg-[#0f172a] rounded-3xl p-6 border border-slate-700 shadow-xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="text-cyan-400" />
                <h3 className="font-display font-bold text-xl text-white">Did You Know?</h3>
              </div>

              <div className="bg-cyan-500/10 p-5 rounded-2xl border border-cyan-500/20">
                <div className="text-3xl font-display font-bold text-cyan-400 mb-1">{formatCurrency(273)}</div>
                <div className="text-sm font-bold text-cyan-200/70 uppercase tracking-wide">Avg. Monthly Subs</div>
              </div>

              <div className="bg-purple-500/10 p-5 rounded-2xl border border-purple-500/20">
                <div className="text-3xl font-display font-bold text-purple-400 mb-1">42%</div>
                <div className="text-sm font-bold text-purple-200/70 uppercase tracking-wide">Unused Subs</div>
              </div>

              <div className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20">
                <div className="text-3xl font-display font-bold text-orange-400 mb-1">{formatCurrency(3276)}</div>
                <div className="text-sm font-bold text-orange-200/70 uppercase tracking-wide">Potential Savings</div>
              </div>
            </div>

            {/* Sidebar Ad Placeholder (Sticky) */}
            <div className="sticky top-24 space-y-6">
              {/* Quick Tips */}
              <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4 text-amber-400">
                  <Lightbulb size={20} />
                  <h4 className="font-bold">Quick Tip</h4>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Set a calendar reminder 3 days before any free trial ends. Companies bank on you forgetting!
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`
      p-4 rounded-2xl border flex flex-col items-center justify-center text-center
      ${highlight ? 'bg-slate-800 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-slate-800/50 border-slate-700'}
    `}>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-2xl font-display font-bold ${highlight ? 'text-white' : 'text-slate-200'}`}>{value}</span>
    </div>
  );
}

function ResourcesContent({ sub }: { sub: typeof subscriptionsData[0] }) {
  const catRes = categoryResources[sub.category];

  return (
    <div className="space-y-6 pt-6 border-t border-slate-700">
      <div className="flex items-center gap-3">
        <RotateCcw className="text-indigo-400" />
        <h3 className="text-xl font-display font-bold text-white">Alternatives</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sub.alternatives?.map((alt, idx) => (
          <a
            key={idx}
            href={alt.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 transition-colors group"
          >
            <span className="font-bold text-slate-200 group-hover:text-white">{alt.name}</span>
            {alt.link && <ExternalLink size={16} className="text-slate-500 group-hover:text-indigo-400" />}
          </a>
        ))}
      </div>

      {catRes && (
        <div className="bg-indigo-900/20 rounded-2xl p-6 border border-indigo-500/20 mt-4">
          <h4 className="font-bold text-indigo-300 mb-2">Free Resources</h4>
          <div className="space-y-2">
            {catRes.freeSites.map((site, idx) => (
              <a key={idx} href={site.url} target="_blank" rel="noopener noreferrer" className="block text-slate-300 hover:text-white hover:underline decoration-indigo-500 underline-offset-4">
                {site.name} <span className="text-slate-500 text-xs no-underline ml-1">— {site.desc}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
