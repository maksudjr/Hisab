/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Calculator as CalcIcon, 
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Languages,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Calendar,
  Tag,
  CreditCard,
  HandCoins,
  ChevronRight,
  Download,
  Upload,
  FileText,
  Share2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Theme = 'light' | 'dark' | 'golden' | 'sky' | 'forest';
type Lang = 'en' | 'bn';
type TransactionType = 'income' | 'expense';
type DueType = 'owe-me' | 'i-owe';

interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

interface Due {
  id: string;
  who: string;
  type: DueType;
  amount: number;
  reason: string;
  date: string;
}

// --- Translations ---
const translations = {
  en: {
    appName: "Hishab",
    welcome: "Welcome",
    enterName: "Please enter your name",
    getStarted: "Get Started",
    dashboard: "Dashboard",
    transactions: "History",
    dues: "Dues",
    calculator: "Calculator",
    settings: "Settings",
    income: "Income",
    expense: "Expense",
    balance: "Balance",
    addTransaction: "Add Transaction",
    addDue: "Add Due",
    amount: "Amount",
    type: "Type",
    category: "Category",
    description: "Description",
    date: "Date",
    save: "Save",
    cancel: "Cancel",
    who: "Who",
    reason: "Reason",
    oweMe: "They Owe Me",
    iOwe: "I Owe Them",
    totalOweMe: "Receivable",
    totalIOwe: "Payable",
    theme: "Theme",
    themeSelection: "Choose Theme",
    golden: "Golden",
    sky: "Sky Blue",
    forest: "Forest Green",
    font: "Font Style",
    fontSize: "Text Size",
    sans: "Modern Sans",
    serif: "Elegant Serif",
    mono: "Technical Mono",
    small: "Small",
    normal: "Normal",
    large: "Large",
    language: "Language",
    languageSelection: "Choose Language",
    dark: "Dark",
    light: "Light",
    history: "Recent Activity",
    noTransactions: "No transactions yet",
    noDues: "No dues recorded",
    delete: "Delete",
    reset: "Reset All Data",
    resetWarning: "This will permanently delete all your transactions, dues, and user settings. This action cannot be undone.",
    confirmReset: "Yes, Reset Everything",
    backup: "Backup & Restore",
    exportData: "Export Data (JSON/CSV)",
    importData: "Import Data",
    downloadPDF: "Download PDF Report",
    about: "About App",
    quickActions: "Quick Actions",
    developedBy: "Developed by:",
    maksudComputers: "Maksudur Rahman, Director, Maksud Computer's, Narundi Bazar, Sadar Jamalpur.",
    categories: {
      food: "Food",
      transport: "Transport",
      shopping: "Shopping",
      bills: "Bills",
      salary: "Salary",
      other: "Other"
    }
  },
  bn: {
    appName: "হিসাব",
    welcome: "স্বাগতম",
    enterName: "আপনার নাম লিখুন",
    getStarted: "শুরু করুন",
    dashboard: "ড্যাশবোর্ড",
    transactions: "ইতিহাস",
    dues: "বকেয়া",
    calculator: "ক্যালকুলেটর",
    settings: "সেটিংস",
    income: "আয়",
    expense: "ব্যয়",
    balance: "ব্যালেন্স",
    addTransaction: "লেনদেন যোগ করুন",
    addDue: "বকেয়া যোগ করুন",
    amount: "পরিমাণ",
    type: "ধরণ",
    category: "বিভাগ",
    description: "বিবরণ",
    date: "তারিখ",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    who: "কার থেকে/কাকে",
    reason: "কারণ",
    oweMe: "পাওনা",
    iOwe: "দেনা",
    totalOweMe: "পাওনা টাকা",
    totalIOwe: "দেনা টাকা",
    theme: "থিম",
    themeSelection: "থিম পছন্দ করুন",
    golden: "গোল্ডেন",
    sky: "নীল আকাশ",
    forest: "সবুজ বন",
    font: "ফন্ট স্টাইল",
    fontSize: "লেখার সাইজ",
    sans: "মডার্ন সানস",
    serif: "এলিগ্যান্ট সেরিফ",
    mono: "টেকনিক্যাল মনো",
    small: "ছোট",
    normal: "স্বাভাবিক",
    large: "বড়",
    language: "ভাষা",
    languageSelection: "ভাষা পছন্দ করুন",
    dark: "ডার্ক",
    light: "লাইট",
    history: "সাম্প্রতিক কার্যক্রম",
    noTransactions: "কোন লেনদেন নেই",
    noDues: "কোন বকেয়া নেই",
    delete: "মুছে ফেলুন",
    reset: "সব ডাটা রিসেট করুন",
    resetWarning: "এটি আপনার সকল লেনদেন, বকেয়া এবং সেটিংস স্থায়ীভাবে মুছে ফেলবে। এটি আর ফিরে পাওয়া সম্ভব নয়।",
    confirmReset: "হ্যাঁ, সব মুছে ফেলুন",
    backup: "ব্যাকআপ এবং রিস্টোর",
    exportData: "এক্সপোর্ট ডাটা (JSON/CSV)",
    importData: "ইমপোর্ট ডাটা",
    downloadPDF: "পিডিএফ রিপোর্ট",
    about: "অ্যাপ সম্পর্কে",
    quickActions: "দ্রুত কার্যক্রম",
    developedBy: "ডেভেলপ করেছেন:",
    maksudComputers: "মাকসুদুর রহমান, ডিরেক্টর, মাকসুদ কম্পিউটার্স, নরুন্দি বাজার, সদর জামালপুর।",
    categories: {
      food: "খাবার",
      transport: "পরিবহন",
      shopping: "কেনাকাটা",
      bills: "বিল",
      salary: "বেতন",
      other: "অন্যান্য"
    }
  }
};

// --- Main App Component ---
export default function App() {
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('hishab_name'));
  const [tempName, setTempName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('hishab_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [dues, setDues] = useState<Due[]>(() => {
    const saved = localStorage.getItem('hishab_dues');
    return saved ? JSON.parse(saved) : [];
  });
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('hishab_lang') as Lang) || 'en');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('hishab_theme') as Theme) || 'light');
  const [font, setFont] = useState(() => localStorage.getItem('hishab_font') || 'sans-serif');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('hishab_fontsize') || '16px');
  const [settingsSection, setSettingsSection] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDueModal, setShowDueModal] = useState(false);

  const t = translations[lang];

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('hishab_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('hishab_dues', JSON.stringify(dues));
  }, [dues]);

  useEffect(() => {
    localStorage.setItem('hishab_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('hishab_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hishab_font', font);
    document.body.style.fontFamily = font;
  }, [font]);

  useEffect(() => {
    localStorage.setItem('hishab_fontsize', fontSize);
    document.documentElement.style.fontSize = fontSize;
  }, [fontSize]);

  // Apply settings on load
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.fontFamily = font;
    document.documentElement.style.fontSize = fontSize;
  }, []);

  // Calculations
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const oweMe = dues.filter(d => d.type === 'owe-me').reduce((acc, curr) => acc + curr.amount, 0);
    const iOwe = dues.filter(d => d.type === 'i-owe').reduce((acc, curr) => acc + curr.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
      oweMe,
      iOwe
    };
  }, [transactions, dues]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      localStorage.setItem('hishab_name', tempName.trim());
      setUserName(tempName.trim());
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTx = { ...transaction, id: crypto.randomUUID() };
    setTransactions([newTx, ...transactions]);
    setShowAddModal(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addDue = (due: Omit<Due, 'id'>) => {
    const newDue = { ...due, id: crypto.randomUUID() };
    setDues([newDue, ...dues]);
    setShowDueModal(false);
  };

  const deleteDue = (id: string) => {
    setDues(dues.filter(d => d.id !== id));
  };

  // --- Backup & Restore Logic ---
  const exportData = (format: 'json' | 'csv') => {
    const combinedData = {
      transactions,
      dues,
      meta: {
        userName,
        exportDate: new Date().toISOString(),
        version: '2.0'
      }
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hishab_backup_${new Date().toLocaleDateString()}.json`;
      a.click();
    } else {
      // CSV Format
      let csv = 'Type,Category,Amount,Date,Description\n';
      transactions.forEach(tx => {
        csv += `${tx.type},${tx.category},${tx.amount},${tx.date},"${tx.description}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hishab_transactions_${new Date().toLocaleDateString()}.csv`;
      a.click();
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.transactions && data.dues) {
          if (confirm("Restore this backup? Existing data will be merged.")) {
            setTransactions([...data.transactions, ...transactions]);
            setDues([...data.dues, ...dues]);
            if (data.meta?.userName && !userName) setUserName(data.meta.userName);
            alert("Data restored successfully!");
          }
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const generatePDF = () => {
    // Simple window print as PDF workaround for a single-file zero-dep app
    const printContent = `
      <div style="font-family: Arial; padding: 40px;">
        <h1 style="text-align: center; color: #5A6D52;">Hishab Financial Report</h1>
        <p style="text-align: center;">Name: ${userName} | Date: ${new Date().toLocaleDateString()}</p>
        <hr/>
        <h3>Summary</h3>
        <p>Total Balance: ৳${stats.balance}</p>
        <p>Total Income: ৳${stats.income}</p>
        <p>Total Expense: ৳${stats.expense}</p>
        <hr/>
        <h3>Transactions</h3>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th></tr>
          </thead>
          <tbody>
            ${transactions.map(tx => `
              <tr>
                <td>${tx.date}</td>
                <td style="color: ${tx.type === 'income' ? 'green' : 'red'}">${tx.type.toUpperCase()}</td>
                <td>${tx.category}</td>
                <td>৳${tx.amount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    const win = window.open('', '', 'width=800,height=600');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.print();
    }
  };

  // --- UI Components ---
  
  if (!userName) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}
        >
          <div className="flex justify-center mb-6 text-indigo-500">
            <Wallet size={64} />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">{t.appName}</h1>
          <p className="text-center opacity-70 mb-8">{t.enterName}</p>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <input 
              type="text" 
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="e.g. Rahul"
              className={`w-full p-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${
                theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-100'
              }`}
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              {t.getStarted}
            </button>
          </form>
          <div className="flex justify-center mt-6 gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
              Change language to {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-natural-bg text-natural-text'}`}>
      
      {/* --- Top Navbar --- */}
      <nav className={`px-6 pt-8 pb-4 sticky top-0 z-40 backdrop-blur-md ${theme === 'dark' ? 'bg-zinc-950/80 border-b border-zinc-800' : 'bg-natural-bg/80 border-b border-natural-border'}`}>
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <span className="text-xs font-semibold opacity-60 uppercase tracking-widest">{t.welcome}</span>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User size={20} className="text-natural-accent" />
              {userName}
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className={`p-2 rounded-xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-natural-surface border-natural-border'}`}
            >
              <Languages size={20} />
            </button>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-natural-surface border-natural-border'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Main Balance Hero */}
              <div className={`relative overflow-hidden p-6 text-white shadow-xl transition-all ${
                theme === 'golden' ? 'rounded-none border-4 border-double border-white/20' : 
                theme === 'sky' ? 'rounded-[3rem]' : 
                theme === 'forest' ? 'rounded-[2rem] rotate-1' : 
                'rounded-[2rem]'
              } bg-natural-accent shadow-natural-accent/20`}>
                <div className="relative z-10 flex flex-col items-center">
                  <p className="opacity-70 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t.balance}</p>
                  <h3 className="text-3xl font-black tracking-tighter mb-4">৳{stats.balance.toLocaleString()}</h3>
                  
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Plus size={16} />
                      <span className="font-bold text-xs uppercase tracking-tight">{t.income}</span>
                    </button>
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="flex-1 bg-black/10 hover:bg-black/20 backdrop-blur-md py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Minus size={16} />
                      <span className="font-bold text-xs uppercase tracking-tight">{t.expense}</span>
                    </button>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-black/10 rounded-full blur-2xl" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <StatCard 
                  label={t.income} 
                  value={stats.income} 
                  icon={<ArrowDownRight size={14} />} 
                  type="income" 
                  theme={theme}
                />
                <StatCard 
                  label={t.expense} 
                  value={stats.expense} 
                  icon={<ArrowUpRight size={14} />} 
                  type="expense" 
                  theme={theme}
                />
                <StatCard 
                  label={t.totalOweMe} 
                  value={stats.oweMe} 
                  icon={<HandCoins size={14} />} 
                  type="owe-me" 
                  theme={theme}
                />
                <StatCard 
                  label={t.totalIOwe} 
                  value={stats.iOwe} 
                  icon={<CreditCard size={14} />} 
                  type="i-owe" 
                  theme={theme}
                />
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <div>
                    <h4 className="font-black text-xl leading-none">{t.history}</h4>
                    <p className="text-xs opacity-40 font-bold mt-1 uppercase tracking-wider">Latest Moves</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('transactions')} 
                    className="text-xs font-black text-natural-accent bg-natural-accent/10 px-3 py-1 rounded-full uppercase tracking-tighter hover:bg-natural-accent/20 transition-colors"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {transactions.slice(0, 4).map(tx => (
                    <TransactionItem key={tx.id} tx={tx} onDelete={deleteTransaction} theme={theme} lang={lang} />
                  ))}
                  {transactions.length === 0 && (
                    <div className={`p-10 rounded-3xl border border-dashed border-natural-border text-center opacity-30 italic`}>
                      {t.noTransactions}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div 
              key="transactions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{t.transactions}</h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-natural-accent text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:opacity-90 shadow-natural-card"
                >
                  <Plus size={18} /> {t.addTransaction}
                </button>
              </div>
              <div className="space-y-3">
                {transactions.map(tx => (
                  <TransactionItem key={tx.id} tx={tx} onDelete={deleteTransaction} theme={theme} lang={lang} />
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-20 opacity-40 italic">{t.noTransactions}</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'dues' && (
            <motion.div 
              key="dues"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{t.dues}</h3>
                <button 
                  onClick={() => setShowDueModal(true)}
                  className="bg-natural-accent text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:opacity-90 shadow-natural-card"
                >
                  <Plus size={18} /> {t.addDue}
                </button>
              </div>
              <div className="space-y-3">
                {dues.map(due => (
                  <DueItem key={due.id} due={due} onDelete={deleteDue} theme={theme} lang={lang} />
                ))}
                {dues.length === 0 && (
                  <div className="text-center py-20 opacity-40 italic">{t.noDues}</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div 
              key="calc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-sm mx-auto"
            >
              <Calculator theme={theme} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                {settingsSection && (
                  <button onClick={() => setSettingsSection(null)} className="p-2 rounded-xl bg-natural-surface border border-natural-border">
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                )}
                <h3 className="text-2xl font-bold">{settingsSection ? t[settingsSection as keyof typeof t] : t.settings}</h3>
              </div>
              
              {!settingsSection && (
                <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-natural-surface border-natural-border shadow-natural-card'}`}>
                  <SettingsMenuItem 
                    icon={<Sun size={20} />} 
                    label={t.theme} 
                    value={t[theme as keyof typeof t]} 
                    onClick={() => setSettingsSection('theme')} 
                  />
                  <SettingsMenuItem 
                    icon={<Tag size={20} />} 
                    label={t.font} 
                    value={font === 'sans-serif' ? t.sans : font === 'serif' ? t.serif : t.mono} 
                    onClick={() => setSettingsSection('font')} 
                  />
                  <SettingsMenuItem 
                    icon={<Plus size={20} />} 
                    label={t.fontSize} 
                    value={fontSize === '14px' ? t.small : fontSize === '16px' ? t.normal : t.large} 
                    onClick={() => setSettingsSection('fontSize')} 
                  />
                  <SettingsMenuItem 
                    icon={<Languages size={20} />} 
                    label={t.language} 
                    value={lang === 'en' ? 'English' : 'বাংলা'} 
                    onClick={() => setSettingsSection('language')} 
                  />
                  <SettingsMenuItem 
                    icon={<Download size={20} />} 
                    label={t.backup} 
                    onClick={() => setSettingsSection('backup')} 
                  />
                  <SettingsMenuItem 
                    icon={<Trash2 size={20} className="text-natural-expense" />} 
                    label={t.reset} 
                    onClick={() => setSettingsSection('reset')} 
                  />
                  <SettingsMenuItem 
                    icon={<Info size={20} />} 
                    label={t.about} 
                    onClick={() => setSettingsSection('about')} 
                  />
                </div>
              )}

              {settingsSection === 'theme' && (
                <div className="grid grid-cols-1 gap-3">
                  {(['light', 'dark', 'golden', 'sky', 'forest'] as Theme[]).map(th => (
                    <button 
                      key={th}
                      onClick={() => setTheme(th)}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${theme === th ? 'border-natural-accent bg-natural-accent/10' : 'bg-natural-surface border-natural-border'}`}
                    >
                      <span className="font-bold">{t[th as keyof typeof t]}</span>
                      {theme === th && <div className="w-2 h-2 rounded-full bg-natural-accent" />}
                    </button>
                  ))}
                </div>
              )}

              {settingsSection === 'font' && (
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'sans-serif', label: t.sans },
                    { id: 'serif', label: t.serif },
                    { id: 'monospace', label: t.mono }
                  ].map(f => (
                    <button 
                      key={f.id}
                      onClick={() => setFont(f.id)}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${font === f.id ? 'border-natural-accent bg-natural-accent/10' : 'bg-natural-surface border-natural-border'}`}
                      style={{ fontFamily: f.id }}
                    >
                      <span className="font-bold">{f.label}</span>
                      {font === f.id && <div className="w-2 h-2 rounded-full bg-natural-accent" />}
                    </button>
                  ))}
                </div>
              )}

              {settingsSection === 'fontSize' && (
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: '14px', label: t.small },
                    { id: '16px', label: t.normal },
                    { id: '18px', label: t.large }
                  ].map(fs => (
                    <button 
                      key={fs.id}
                      onClick={() => setFontSize(fs.id)}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${fontSize === fs.id ? 'border-natural-accent bg-natural-accent/10' : 'bg-natural-surface border-natural-border'}`}
                    >
                      <span className="font-bold" style={{ fontSize: fs.id }}>{fs.label}</span>
                      {fontSize === fs.id && <div className="w-2 h-2 rounded-full bg-natural-accent" />}
                    </button>
                  ))}
                </div>
              )}

              {settingsSection === 'language' && (
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'en', name: 'English' },
                    { id: 'bn', name: 'বাংলা' }
                  ].map(l => (
                    <button 
                      key={l.id}
                      onClick={() => setLang(l.id as Lang)}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${lang === l.id ? 'border-natural-accent bg-natural-accent/10' : 'bg-natural-surface border-natural-border'}`}
                    >
                      <span className="font-bold">{l.name}</span>
                      {lang === l.id && <div className="w-2 h-2 rounded-full bg-natural-accent" />}
                    </button>
                  ))}
                </div>
              )}

              {settingsSection === 'backup' && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-natural-surface border-natural-border shadow-sm'}`}>
                    <div onClick={() => exportData('json')} className="p-4 border-b border-inherit flex justify-between items-center cursor-pointer hover:bg-natural-bg/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-natural-bg text-natural-accent rounded-xl border border-natural-border">
                          <Share2 size={20} />
                        </div>
                        <div>
                          <p className="font-semibold">{t.exportData}</p>
                          <p className="text-xs opacity-50">JSON backup file</p>
                        </div>
                      </div>
                    </div>
                    <label className="p-4 border-b border-inherit flex justify-between items-center cursor-pointer hover:bg-natural-bg/50 transition-colors">
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-natural-bg text-natural-accent rounded-xl border border-natural-border">
                          <Upload size={20} />
                        </div>
                        <div>
                          <p className="font-semibold">{t.importData}</p>
                          <p className="text-xs opacity-50">Restore from JSON</p>
                        </div>
                      </div>
                    </label>
                    <div onClick={generatePDF} className="p-4 flex justify-between items-center cursor-pointer hover:bg-natural-bg/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-natural-bg text-natural-accent rounded-xl border border-natural-border">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-semibold">{t.downloadPDF}</p>
                          <p className="text-xs opacity-50">Printable Report</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {settingsSection === 'reset' && (
                <div className={`p-6 rounded-3xl border border-rose-200 bg-rose-50/50 dark:bg-rose-900/10 dark:border-rose-900/30`}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-natural-expense text-white rounded-2xl shadow-lg">
                      <Trash2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-natural-expense text-xl mb-1">{t.reset}</h4>
                      <p className="text-sm opacity-70 leading-relaxed">{t.resetWarning}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm(translations[lang].resetWarning)) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full bg-natural-expense text-white py-4 rounded-xl font-bold shadow-lg shadow-natural-expense/20 active:scale-[0.98] transition-all"
                  >
                    {t.confirmReset}
                  </button>
                </div>
              )}

              {settingsSection === 'about' && (
                <div className={`p-8 rounded-3xl border bg-natural-surface border-natural-border shadow-sm text-center`}>
                  <div className="w-20 h-20 bg-natural-bg rounded-3xl border border-natural-border flex items-center justify-center mx-auto mb-6 text-natural-accent">
                    <Wallet size={40} />
                  </div>
                  <h4 className="text-2xl font-black mb-2">{t.appName}</h4>
                  <p className="text-sm opacity-50 mb-8 font-medium">Simple Daily Accounts Manager</p>
                  
                  <div className="bg-natural-bg p-6 rounded-2xl border border-natural-border text-left">
                    <p className="text-[10px] font-bold text-natural-accent mb-2 uppercase tracking-widest">{t.developedBy}</p>
                    <p className="font-bold text-sm leading-relaxed">{t.maksudComputers}</p>
                  </div>
                </div>
              )}

              {!settingsSection && (
                <div className="text-center py-10 opacity-30 text-xs">
                  <p>{t.appName} v2.5 Premium Edition</p>
                  <p>Designed with Heart by Maksudur Rahman</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- Bottom Navigation --- */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 px-6 pt-4 pb-10 flex justify-center backdrop-blur-lg border-t transition-all ${
        theme === 'golden' ? 'rounded-t-none border-t-4 border-natural-accent' : 
        theme === 'sky' ? 'rounded-t-[3rem]' : 
        theme === 'forest' ? 'rounded-t-[1.5rem]' : 
        'rounded-t-[2rem]'
      } ${theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-2 max-w-md w-full justify-between">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<TrendingUp size={24} />} label={t.dashboard} lang={lang} />
          <NavButton active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<History size={24} />} label={t.transactions} lang={lang} />
          <NavButton active={activeTab === 'dues'} onClick={() => setActiveTab('dues')} icon={<HandCoins size={24} />} label={t.dues} lang={lang} />
          <NavButton active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} icon={<CalcIcon size={24} />} label={t.calculator} lang={lang} />
          <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={24} />} label={t.settings} lang={lang} />
        </div>
      </div>

      {/* --- Modals --- */}
      {showAddModal && (
        <TransactionModal 
          onClose={() => setShowAddModal(false)} 
          onSave={addTransaction} 
          theme={theme} 
          lang={lang} 
          t={t} 
        />
      )}
      {showDueModal && (
        <DueModal 
          onClose={() => setShowDueModal(false)} 
          onSave={addDue} 
          theme={theme} 
          lang={lang} 
          t={t} 
        />
      )}
    </div>
  );
}

// --- Helper UI Components ---

function StatCard({ label, value, icon, type, theme }: any) {
  const colors: any = {
    income: 'var(--income)',
    expense: 'var(--expense)',
    'owe-me': 'var(--accent)',
    'i-owe': 'var(--muted)',
  };

  const color = colors[type] || 'var(--accent)';

  // Design variations per theme
  const getCardStyle = () => {
    switch (theme) {
      case 'golden':
        return 'rounded-none border-2 border-double';
      case 'sky':
        return 'rounded-2xl border-sky-100 shadow-sm';
      case 'forest':
        return 'rounded-2xl border-forest-100';
      case 'dark':
        return 'rounded-xl border-zinc-800 bg-zinc-900';
      default:
        return 'rounded-2xl border-natural-border shadow-sm';
    }
  };

  return (
    <div 
      className={`p-3 border transition-all hover:scale-[1.02] ${getCardStyle()} ${theme !== 'dark' ? 'bg-natural-surface' : ''}`}
      style={{ 
        borderColor: `${color}25`,
      }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <div 
          className="p-1.5 rounded-lg bg-natural-bg border border-inherit"
          style={{ color: color }}
        >
          {icon}
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.1em] opacity-50 text-right leading-none">{label}</p>
      </div>
      <p className="text-base font-black tracking-tight leading-none" style={{ color: color }}>৳{value.toLocaleString()}</p>
    </div>
  );
}

function SettingsMenuItem({ icon, label, value, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="p-5 border-b border-inherit last:border-0 flex justify-between items-center cursor-pointer hover:bg-natural-bg/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-natural-bg text-natural-accent rounded-xl border border-natural-border">
          {icon}
        </div>
        <div>
          <p className="font-bold text-base leading-tight">{label}</p>
          {value && <p className="text-xs opacity-50 mt-0.5">{value}</p>}
        </div>
      </div>
      <ChevronRight className="opacity-30" size={18} />
    </div>
  );
}

function NavButton({ active, onClick, icon, label, lang }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all rounded-2xl p-2 ${active ? 'text-natural-accent scale-110' : 'opacity-40 hover:opacity-100'}`}
    >
      {icon}
      <span className={`text-[10px] font-bold uppercase tracking-tighter ${lang === 'bn' ? 'scale-90' : ''}`}>{label}</span>
      {active && <motion.div layoutId="nav-pill" className="w-1 h-1 rounded-full bg-natural-accent mt-0.5" />}
    </button>
  );
}

function TransactionItem({ tx, onDelete, theme, lang }: any) {
  const t = translations[lang == 'en' ? 'en' : 'bn'];
  
  const getCardStyle = () => {
    switch (theme) {
      case 'golden': return 'rounded-none border-b-2 border-natural-accent/20 hover:bg-natural-accent/5 italic';
      case 'sky': return 'rounded-3xl border-sky-100 shadow-sm hover:shadow-md';
      case 'forest': return 'rounded-2xl border-dashed border-forest-200 hover:bg-forest-50/30';
      case 'dark': return 'rounded-2xl border-zinc-800 hover:border-zinc-700 bg-zinc-900';
      default: return 'rounded-2xl border-natural-border shadow-sm';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex items-center justify-between p-4 border transition-all ${getCardStyle()} ${theme !== 'dark' ? 'bg-natural-surface' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${tx.type === 'income' ? 'bg-natural-income/20 text-natural-income' : 'bg-natural-expense/20 text-natural-expense'}`}>
          {tx.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
        <div>
          <p className="font-bold leading-tight text-sm">{tx.category in t.categories ? (t.categories as any)[tx.category] : tx.category}</p>
          <div className="flex items-center gap-2 opacity-50 text-[10px]">
             <span>{tx.description}</span>
             {tx.description && <span>•</span>}
             <span>{tx.date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className={`font-bold text-base ${tx.type === 'income' ? 'text-natural-income' : 'text-natural-expense'}`}>
          {tx.type === 'income' ? '+' : '-'}৳{tx.amount.toLocaleString()}
        </p>
        <button onClick={() => onDelete(tx.id)} className="opacity-0 group-hover:opacity-40 hover:!opacity-100 text-natural-expense transition-opacity p-2">
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function DueItem({ due, onDelete, theme, lang }: any) {
  const getCardStyle = () => {
    const base = due.type === 'owe-me' ? 'border-natural-income' : 'border-natural-expense';
    switch (theme) {
      case 'golden': return `rounded-none border-l-4 ${base}`;
      case 'sky': return `rounded-[2rem] border-2 ${base} border-opacity-30 bg-opacity-5`;
      case 'forest': return `rounded-3xl border-2 border-dashed ${base} border-opacity-40`;
      case 'dark': return `rounded-2xl border-l-4 ${base} bg-zinc-900 border-opacity-100`;
      default: return `rounded-2xl border-l-4 ${base} shadow-sm`;
    }
  };

  return (
    <motion.div 
      layout
      className={`group flex items-center justify-between p-4 transition-all ${getCardStyle()} ${theme !== 'dark' ? 'bg-natural-surface' : ''} border-natural-border`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${due.type === 'owe-me' ? 'bg-natural-income text-white' : 'bg-natural-expense text-white'}`}>
          <HandCoins size={20} />
        </div>
        <div>
          <p className="font-bold leading-tight text-sm">{due.who}</p>
          <p className="text-[10px] opacity-50 uppercase tracking-tighter">{due.reason} • {due.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`font-bold text-base ${due.type === 'owe-me' ? 'text-natural-income' : 'text-natural-expense'}`}>
            ৳{due.amount.toLocaleString()}
          </p>
          <p className="text-[8px] opacity-40 leading-none">{due.type === 'owe-me' ? 'TO RECEIVE' : 'TO PAY'}</p>
        </div>
        <button onClick={() => onDelete(due.id)} className="opacity-0 group-hover:opacity-40 hover:!opacity-100 text-natural-expense transition-opacity">
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

// --- Modals for Adding Data ---

function TransactionModal({ onClose, onSave, theme, lang, t }: any) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['food', 'transport', 'shopping', 'bills', 'salary', 'other'];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md p-6 rounded-[2rem] bg-natural-surface border border-natural-border shadow-2xl"
      >
        <h3 className="text-xl font-bold mb-6">{t.addTransaction}</h3>
        <div className="space-y-4">
          <div className="flex p-1 bg-natural-bg rounded-2xl border border-natural-border">
            <button 
              onClick={() => setFormData({...formData, type: 'expense'})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${formData.type === 'expense' ? 'bg-natural-expense text-white shadow-lg shadow-natural-expense/20' : 'text-natural-muted hover:bg-natural-surface/50 opacity-80'}`}
            >
              <Minus size={16} /> {t.expense}
            </button>
            <button 
              onClick={() => setFormData({...formData, type: 'income'})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${formData.type === 'income' ? 'bg-natural-income text-white shadow-lg shadow-natural-income/20' : 'text-natural-muted hover:bg-natural-surface/50 opacity-80'}`}
            >
              <Plus size={16} /> {t.income}
            </button>
          </div>

          <div className="flex items-center gap-3 bg-natural-bg p-4 rounded-2xl border border-natural-border">
            <div className="text-natural-muted">
              <CreditCard size={20} />
            </div>
            <input 
              type="number" 
              placeholder={t.amount} 
              className="bg-transparent flex-1 outline-none font-bold text-2xl text-natural-text hishab-no-spin" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="flex items-center gap-3 bg-natural-bg p-4 rounded-2xl border border-natural-border">
                <Tag size={18} className="text-natural-muted" />
                <select 
                  className="bg-transparent outline-none flex-1 text-sm font-semibold text-natural-text [&>option]:bg-natural-surface [&>option]:text-natural-text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{t.categories[cat]}</option>)}
                </select>
             </div>
             <div className="flex items-center gap-3 bg-natural-bg p-4 rounded-2xl border border-natural-border">
                <Calendar size={18} className="text-natural-muted" />
                <input 
                  type="date" 
                  className="bg-transparent outline-none flex-1 text-xs font-semibold text-natural-text"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
             </div>
          </div>

          <textarea 
            placeholder={t.description} 
            className="w-full bg-natural-bg p-4 rounded-2xl border border-natural-border outline-none resize-none h-24 text-sm text-natural-text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-4 text-sm font-bold text-natural-muted hover:text-natural-text">{t.cancel}</button>
            <button 
              onClick={() => {
                if (formData.amount) onSave({ ...formData, amount: Number(formData.amount) } as any);
              }}
              className="flex-[2] bg-natural-accent text-white rounded-2xl font-bold shadow-xl shadow-natural-accent/20 active:scale-95 transition-transform"
            >
              {t.save}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DueModal({ onClose, onSave, theme, lang, t }: any) {
  const [formData, setFormData] = useState({
    who: '',
    type: 'owe-me',
    amount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0]
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md p-6 rounded-[2rem] bg-natural-surface border border-natural-border shadow-2xl"
      >
        <h3 className="text-xl font-bold mb-6">{t.addDue}</h3>
        <div className="space-y-4">
          <div className="flex p-1 bg-natural-bg rounded-2xl border border-natural-border">
            <button 
              onClick={() => setFormData({...formData, type: 'owe-me'})}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === 'owe-me' ? 'bg-natural-income text-white shadow-lg' : 'text-natural-muted opacity-70'}`}
            >
              {t.oweMe}
            </button>
            <button 
              onClick={() => setFormData({...formData, type: 'i-owe'})}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === 'i-owe' ? 'bg-natural-expense text-white shadow-lg' : 'text-natural-muted opacity-70'}`}
            >
              {t.iOwe}
            </button>
          </div>

          <input 
            type="text" 
            placeholder={t.who} 
            className="w-full bg-natural-bg p-4 rounded-2xl border border-natural-border outline-none text-natural-text"
            value={formData.who}
            onChange={(e) => setFormData({...formData, who: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-3">
             <input 
              type="number" 
              placeholder={t.amount} 
              className="bg-natural-bg p-4 rounded-2xl border border-natural-border outline-none font-bold text-natural-text hishab-no-spin"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
            <input 
              type="date" 
              className="bg-natural-bg p-4 rounded-2xl border border-natural-border outline-none text-xs font-semibold text-natural-text"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <input 
            type="text" 
            placeholder={t.reason} 
            className="w-full bg-natural-bg p-4 rounded-2xl border border-natural-border outline-none text-natural-text"
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
          />

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-4 text-sm font-bold text-natural-muted">{t.cancel}</button>
            <button 
              onClick={() => {
                if (formData.amount && formData.who) onSave({ ...formData, amount: Number(formData.amount) } as any);
              }}
              className="flex-[2] bg-natural-accent text-white rounded-2xl font-bold active:scale-95 transition-transform shadow-natural-card"
            >
              {t.save}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Calculator Component ---

function Calculator({ theme }: { theme: Theme }) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleBtn = (val: string) => {
    if (display === '0' && !isNaN(Number(val))) {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const calculate = () => {
    try {
      // Basic math parser (replaces × and ÷)
      const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(sanitized); // Simple eval is okay for isolated calculator
      setDisplay(String(result));
      setEquation(display + ' =');
    } catch {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const CalcBtn = ({ children, onClick, className = '' }: any) => (
    <button 
      onClick={onClick}
      className={`h-16 flex items-center justify-center rounded-xl text-xl font-bold transition-all active:scale-90 ${className} ${
        theme === 'dark' ? 'bg-zinc-800 active:bg-zinc-700' : 'bg-natural-bg active:bg-natural-border border border-natural-border'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className={`p-4 rounded-[2rem] shadow-natural-card border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-natural-surface border-natural-border'}`}>
      <div className="bg-natural-text text-white rounded-2xl p-6 mb-4 text-right overflow-hidden min-h-[100px] flex flex-col justify-end">
        <p className="text-xs opacity-50 font-mono mb-1">{equation}</p>
        <h3 className="text-3xl font-bold font-mono tracking-tighter truncate">{display}</h3>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <CalcBtn onClick={clear} className="text-natural-accent">C</CalcBtn>
        <CalcBtn onClick={() => handleBtn('(')} className="text-natural-accent">(</CalcBtn>
        <CalcBtn onClick={() => handleBtn(')')} className="text-natural-accent">)</CalcBtn>
        <CalcBtn onClick={() => handleBtn('÷')} className="bg-natural-accent text-white">÷</CalcBtn>
        
        <CalcBtn onClick={() => handleBtn('7')}>7</CalcBtn>
        <CalcBtn onClick={() => handleBtn('8')}>8</CalcBtn>
        <CalcBtn onClick={() => handleBtn('9')}>9</CalcBtn>
        <CalcBtn onClick={() => handleBtn('×')} className="bg-natural-accent text-white">×</CalcBtn>
        
        <CalcBtn onClick={() => handleBtn('4')}>4</CalcBtn>
        <CalcBtn onClick={() => handleBtn('5')}>5</CalcBtn>
        <CalcBtn onClick={() => handleBtn('6')}>6</CalcBtn>
        <CalcBtn onClick={() => handleBtn('-')} className="bg-natural-accent text-white">-</CalcBtn>
        
        <CalcBtn onClick={() => handleBtn('1')}>1</CalcBtn>
        <CalcBtn onClick={() => handleBtn('2')}>2</CalcBtn>
        <CalcBtn onClick={() => handleBtn('3')}>3</CalcBtn>
        <CalcBtn onClick={() => handleBtn('+')} className="bg-natural-accent text-white">+</CalcBtn>
        
        <CalcBtn onClick={() => handleBtn('.')}>.</CalcBtn>
        <CalcBtn onClick={() => handleBtn('0')}>0</CalcBtn>
        <CalcBtn onClick={() => setDisplay(display.slice(0, -1) || '0')} className="text-natural-muted">del</CalcBtn>
        <button 
          onClick={calculate}
          className="h-16 flex items-center justify-center rounded-xl text-2xl font-bold bg-natural-accent text-white shadow-natural-card active:scale-95"
        >
          =
        </button>
      </div>
    </div>
  );
}
