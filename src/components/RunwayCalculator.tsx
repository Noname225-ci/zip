import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Wallet, PiggyBank, TrendingUp, ShieldCheck, Percent,
  CreditCard, Home, Utensils, Zap, ShoppingBag, Car,
  Smile, AlertCircle, DollarSign, Activity, Lock, Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../context/CurrencyContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { secureStorage } from '../utils/secureStorage';

const STORAGE_KEY = 'runway_calculator_data';

export default function RunwayCalculator() {
  const { t } = useTranslation();
  const { currency, formatCurrency } = useCurrency();

  // Load initial state from localStorage or use defaults
  const loadState = () => {
    return secureStorage.getItem<any>(STORAGE_KEY);
  };

  const initialState = loadState();

  // Inputs
  const [income, setIncome] = useState(initialState?.income || '');
  const [savings, setSavings] = useState(initialState?.savings || '');

  // Expenses State
  const [expenses, setExpenses] = useState(initialState?.expenses || {
    rent: '',
    food: '',
    utilities: '',
    subscriptions: '',
    gym: '',
    entertainment: '',
    clothing: '',
    transport: '',
    essential: '',
    other: ''
  });

  // Debts State
  const [debts, setDebts] = useState(initialState?.debts || {
    car: '',
    mortgage: '',
    creditCard: '',
    studentLoan: '',
    other: ''
  });

  // Controls
  const [expenseReduction, setExpenseReduction] = useState(initialState?.expenseReduction || 0);
  const [safetyBuffer, setSafetyBuffer] = useState(initialState?.safetyBuffer || false);

  // Results
  const [runway, setRunway] = useState({ months: 0, years: 0 });
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [adjustedExpenses, setAdjustedExpenses] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  // Auto-save effect
  useEffect(() => {
    const dataToSave = {
      income,
      savings,
      expenses,
      debts,
      expenseReduction,
      safetyBuffer
    };
    secureStorage.setItem(STORAGE_KEY, dataToSave);
  }, [income, savings, expenses, debts, expenseReduction, safetyBuffer]);

  // Calculate Runway & Chart Data
  useEffect(() => {
    // Sum Expenses
    const monthlyExpenses = Object.values(expenses).reduce<number>((acc, val) => acc + (parseFloat(val as string) || 0), 0);
    const monthlyDebt = Object.values(debts).reduce<number>((acc, val) => acc + (parseFloat(val as string) || 0), 0);

    const totalMonthlyOut = monthlyExpenses + monthlyDebt;
    setTotalExpenses(totalMonthlyOut);

    // Apply Reduction
    const discretionaryTotal =
      (parseFloat(expenses.food) || 0) +
      (parseFloat(expenses.subscriptions) || 0) +
      (parseFloat(expenses.gym) || 0) +
      (parseFloat(expenses.entertainment) || 0) +
      (parseFloat(expenses.clothing) || 0) +
      (parseFloat(expenses.other) || 0);

    const fixedTotal = totalMonthlyOut - discretionaryTotal;

    const reducedDiscretionary = discretionaryTotal * (1 - expenseReduction / 100);
    const currentAdjustedExpenses = fixedTotal + reducedDiscretionary;
    setAdjustedExpenses(currentAdjustedExpenses);

    // Calculate Available Savings
    const totalLiquid = parseFloat(savings) || 0;
    const bufferAmount = safetyBuffer ? (currentAdjustedExpenses * 3) : 0;
    const availableSavings = Math.max(0, totalLiquid - bufferAmount);

    // Calculate Runway
    let months = 0;
    if (currentAdjustedExpenses > 0) {
      months = availableSavings / currentAdjustedExpenses;
      setRunway({
        months: months,
        years: months / 12
      });
    } else {
      months = totalLiquid > 0 ? 999 : 0;
      setRunway({ months, years: totalLiquid > 0 ? 99 : 0 });
    }

    // Generate Chart Data
    const data = [];
    let currentBalance = availableSavings;
    const projectedMonths = Math.min(Math.ceil(months) + 5, 60); // Show up to 5 years or slightly past runway

    // If infinite runway, just show flat line for a year
    if (months === 999) {
      for (let i = 0; i <= 12; i++) {
        data.push({ month: i, balance: currentBalance });
      }
    } else {
      for (let i = 0; i <= projectedMonths; i++) {
        data.push({ month: i, balance: Math.max(0, currentBalance) });
        currentBalance -= currentAdjustedExpenses;
        if (currentBalance < -currentAdjustedExpenses) break; // Stop shortly after 0
      }
    }
    setChartData(data);

  }, [expenses, debts, savings, expenseReduction, safetyBuffer]);

  const handleExpenseChange = (key: string, value: string) => {
    setExpenses(prev => ({ ...prev, [key]: value }));
  };

  const handleDebtChange = (key: string, value: string) => {
    setDebts(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    const doc = new jsPDF();

    // Custom Header
    doc.setFillColor(99, 102, 241); // Indigo-500
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Freedom Runway Report", 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);

    // Reset text color for body
    doc.setTextColor(30, 41, 59); // slate-800

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Summary", 14, 55);

    const summaryData = [
      ["Runway", runway.months === 999 ? "Infinite" : `${runway.months.toFixed(1)} Months`],
      ["Years of Freedom", runway.months === 999 ? "Forever" : `${runway.years.toFixed(1)} Years`],
      ["Total Liquid Savings", formatCurrency(parseFloat(savings) || 0)],
      ["Monthly Burn (Adjusted)", formatCurrency(adjustedExpenses)],
      ["Safety Buffer Locked", safetyBuffer ? formatCurrency(adjustedExpenses * 3) : "None"]
    ];

    autoTable(doc, {
      startY: 60,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241], fontSize: 12 },
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Expenses Breakdown", 14, (doc as any).lastAutoTable.finalY + 15);

    const expensesData = Object.entries(expenses)
      .filter(([_, val]) => parseFloat(val as string) > 0)
      .map(([key, val]) => [key.charAt(0).toUpperCase() + key.slice(1), formatCurrency(parseFloat(val as string))]);

    const debtsData = Object.entries(debts)
      .filter(([_, val]) => parseFloat(val as string) > 0)
      .map(([key, val]) => [key.charAt(0).toUpperCase() + key.slice(1) + " (Debt)", formatCurrency(parseFloat(val as string))]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Category', 'Amount']],
      body: [...expensesData, ...debtsData],
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], fontSize: 12 }, // Indigo-600
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save("freedom-runway-report.pdf");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-400 text-xs font-bold mb-1">{t('runway.month_tooltip', { n: label })}</p>
          <p className="text-emerald-400 font-bold text-sm">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-20">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="p-5 sm:p-8 md:p-10">
          <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                <TrendingUp size={28} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">{t('runway.title')}</h2>
                <p className="text-slate-400 font-medium text-sm sm:text-base">{t('runway.survive')}</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 sm:px-4 rounded-xl font-bold transition-colors text-sm shrink-0"
            >
              <Download size={16} /> <span className="hidden sm:inline">{t('runway.export_pdf')}</span><span className="sm:hidden">PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* INPUTS COLUMN */}
            <div className="lg:col-span-7 space-y-8">

              {/* 1. Assets & Income */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Wallet size={16} /> {t('runway.assets_section')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 focus-within:border-indigo-500 transition-colors">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t('runway.total_liquid')}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-lg">{currency.symbol}</span>
                      <input
                        type="number"
                        placeholder="0"
                        className="bg-transparent min-w-0 w-full text-xl font-bold text-white outline-none placeholder:text-slate-700 py-1"
                        value={savings}
                        onChange={e => setSavings(e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 focus-within:border-indigo-500 transition-colors">
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t('runway.monthly_income_net')}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold text-lg">{currency.symbol}</span>
                      <input
                        type="number"
                        placeholder={t('runway.income_optional')}
                        className="bg-transparent min-w-0 w-full text-xl font-bold text-white outline-none placeholder:text-slate-700 py-1"
                        value={income}
                        onChange={e => setIncome(e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Monthly Expenses */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag size={16} /> {t('runway.expenses_title')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'rent', label: t('runway.expense_rent'), icon: Home },
                    { key: 'food', label: t('runway.expense_food'), icon: Utensils },
                    { key: 'utilities', label: t('runway.expense_utilities'), icon: Zap },
                    { key: 'subscriptions', label: t('runway.expense_subscriptions'), icon: Activity },
                    { key: 'gym', label: t('runway.expense_gym'), icon: Activity },
                    { key: 'transport', label: t('runway.expense_transport'), icon: Car },
                    { key: 'entertainment', label: t('runway.expense_entertainment'), icon: Smile },
                    { key: 'clothing', label: t('runway.expense_clothing'), icon: ShoppingBag },
                    { key: 'essential', label: t('runway.expense_essential'), icon: AlertCircle },
                  ].map((item) => (
                    <div key={item.key} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1 uppercase">
                        <item.icon size={10} /> {item.label}
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-600 text-sm">{currency.symbol}</span>
                        <input
                          type="number"
                          placeholder="0"
                          className="bg-transparent min-w-0 w-full text-sm font-bold text-white outline-none placeholder:text-slate-800 py-1"
                          value={expenses[item.key as keyof typeof expenses]}
                          onChange={e => handleExpenseChange(item.key, e.target.value)}
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Debts & Loans */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={16} /> {t('runway.debt_section')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'car', label: t('runway.debt_car') },
                    { key: 'studentLoan', label: t('runway.debt_student') },
                    { key: 'creditCard', label: t('runway.debt_creditcard') },
                    { key: 'other', label: t('runway.debt_other') },
                  ].map((item) => (
                    <div key={item.key} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 focus-within:border-rose-500/50 transition-colors">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">{item.label}</label>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-600 text-sm">{currency.symbol}</span>
                        <input
                          type="number"
                          placeholder="0"
                          className="bg-transparent min-w-0 w-full text-sm font-bold text-white outline-none placeholder:text-slate-800 py-1"
                          value={debts[item.key as keyof typeof debts]}
                          onChange={e => handleDebtChange(item.key, e.target.value)}
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OUTPUT COLUMN */}
            <div className="lg:col-span-5 space-y-6">

              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-40 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none group-hover:bg-indigo-400/30 transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                  <h3 className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                    <TrendingUp size={16} /> {t('runway.freedom_runway_card')}
                  </h3>

                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative">
                      <motion.span
                        className="text-6xl sm:text-8xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200 tracking-tighter leading-none"
                        key={runway.months}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      >
                        {runway.months === 999 ? '∞' : runway.months.toFixed(1)}
                      </motion.span>
                      {runway.months !== 999 && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="absolute -bottom-2 left-0 right-0 h-2 bg-indigo-500/30 rounded-full blur-sm"
                        />
                      )}
                    </div>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-400/80 mt-2 font-display">{t('runway.months_label')}</span>
                  </div>

                  <div className="text-center mb-8">
                    <p className="text-slate-400 font-medium text-lg">
                      {runway.years === 99 ? t('runway.infinite_msg') : t('runway.years_msg', { years: runway.years.toFixed(1) })}
                    </p>
                  </div>

                  {/* Graph Visualization */}
                  <div className="h-36 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                          type="monotone"
                          dataKey="balance"
                          stroke="#818cf8"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorBalance)"
                          animationDuration={1000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mt-2">
                    <span>{t('runway.now_label')}</span>
                    <span>{t('runway.runway_end_label')}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700 space-y-6">

                {/* What-If Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label htmlFor="expense-reduction-slider" className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Percent size={16} className="text-indigo-400" /> {t('runway.what_if')}
                    </label>
                    <span className="text-indigo-400 font-bold bg-indigo-400/10 px-3 py-1 rounded-lg text-sm">
                      -{expenseReduction}%
                    </span>
                  </div>
                  <div className="relative w-full h-6 flex items-center">
                    <input
                      id="expense-reduction-slider"
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={expenseReduction}
                      onChange={(e) => setExpenseReduction(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {t('runway.reduction_desc', { pct: expenseReduction })}
                  </p>
                </div>

                {/* Safety Buffer Toggle */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <ShieldCheck size={16} className={safetyBuffer ? "text-emerald-400" : "text-slate-500"} />
                      {t('runway.safety_buffer_label')}
                    </label>
                    <p className="text-xs text-slate-500 max-w-[200px]">
                      {t('runway.safety_buffer_desc')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSafetyBuffer(!safetyBuffer)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${safetyBuffer ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${safetyBuffer ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('runway.result_monthly_burn')}</div>
                  <div className="text-xl font-bold text-white break-all">{formatCurrency(adjustedExpenses)}</div>
                  {expenseReduction > 0 && (
                    <div className="text-xs text-emerald-400 font-bold mt-1 break-all">
                      {t('runway.saved_label', { amount: formatCurrency(totalExpenses - adjustedExpenses) })}
                    </div>
                  )}
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('runway.available_cash')}</div>
                  <div className="text-xl font-bold text-white break-all">
                    {formatCurrency(Math.max(0, (parseFloat(savings) || 0) - (safetyBuffer ? adjustedExpenses * 3 : 0)))}
                  </div>
                  {safetyBuffer && (
                    <div className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1 break-all">
                      <Lock size={10} className="shrink-0" /> {formatCurrency(adjustedExpenses * 3)} {t('runway.locked_label')}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
