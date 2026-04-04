// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  ArrowUpDown,
  Eye,
  Edit2,
  Plus,
  Download,
  Moon,
  Sun,
  X,
  DollarSign,
  PieChart,
  Calendar
} from 'lucide-react';

// Mock Data
const initialTransactions = [
  { id: 1, date: '2024-03-15', description: 'Salary', amount: 5000, category: 'Income', type: 'income' },
  { id: 2, date: '2024-03-14', description: 'Rent', amount: 1500, category: 'Housing', type: 'expense' },
  { id: 3, date: '2024-03-13', description: 'Groceries', amount: 200, category: 'Food', type: 'expense' },
  { id: 4, date: '2024-03-12', description: 'Netflix', amount: 15, category: 'Entertainment', type: 'expense' },
  { id: 5, date: '2024-03-11', description: 'Freelance', amount: 800, category: 'Income', type: 'income' },
  { id: 6, date: '2024-03-10', description: 'Restaurant', amount: 75, category: 'Food', type: 'expense' },
  { id: 7, date: '2024-03-09', description: 'Electricity Bill', amount: 120, category: 'Utilities', type: 'expense' },
  { id: 8, date: '2024-03-08', description: 'Investment', amount: 1000, category: 'Investment', type: 'expense' },
  { id: 9, date: '2024-03-07', description: 'Gym Membership', amount: 50, category: 'Health', type: 'expense' },
  { id: 10, date: '2024-03-06', description: 'Dividend', amount: 150, category: 'Income', type: 'income' },
];

// Helper function to calculate summary
const calculateSummary = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  return { income, expenses, balance };
};

// Spending by category
const getCategorySpending = (transactions) => {
  const spending = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    spending[t.category] = (spending[t.category] || 0) + t.amount;
  });
  return spending;
};

// Monthly data for trend
const getMonthlyData = (transactions) => {
  const months = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7);
    if (!months[month]) months[month] = { income: 0, expense: 0 };
    if (t.type === 'income') months[month].income += t.amount;
    else months[month].expense += t.amount;
  });
  return Object.entries(months).map(([month, data]) => ({
    month: new Date(month + '-01').toLocaleString('default', { month: 'short' }),
    income: data.income,
    expense: data.expense,
    balance: data.income - data.expense
  })).slice(-6);
};

// Main App Component
function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  const [role, setRole] = useState('viewer');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [darkMode, setDarkMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const summary = calculateSummary(transactions);
  const categorySpending = getCategorySpending(transactions);
  const monthlyData = getMonthlyData(transactions);
  const highestCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
  const monthlyAvg = summary.expenses / monthlyData.length || 0;

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(t => 
      (typeFilter === 'all' || t.type === typeFilter) &&
      (t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? newTransaction : t));
    } else {
      setTransactions([newTransaction, ...transactions]);
    }
    
    resetModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setEditingTransaction(null);
    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (transaction) => {
    if (role !== 'admin') return;
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date
    });
    setShowAddModal(true);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Finance Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-105 transition`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role:</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`px-3 py-1 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-md p-6 border-l-4 border-blue-500 transition-all hover:shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Balance</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${summary.balance.toLocaleString()}
                </p>
              </div>
              <Wallet className="h-10 w-10 text-blue-500 opacity-75" />
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-md p-6 border-l-4 border-green-500 transition-all hover:shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Income</p>
                <p className={`text-2xl font-bold text-green-600 dark:text-green-400`}>
                  ${summary.income.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500 opacity-75" />
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-md p-6 border-l-4 border-red-500 transition-all hover:shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Expenses</p>
                <p className={`text-2xl font-bold text-red-600 dark:text-red-400`}>
                  ${summary.expenses.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="h-10 w-10 text-red-500 opacity-75" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Balance Trend */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Balance Trend
              </h2>
              <Calendar className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="h-64">
              <ResponsiveLineChart data={monthlyData} darkMode={darkMode} />
            </div>
          </div>

          {/* Spending Breakdown */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Spending by Category
              </h2>
              <PieChart className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="h-64">
              <ResponsivePieChart data={categorySpending} darkMode={darkMode} />
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Highest Spending</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {highestCategory ? `${highestCategory[0]}: $${highestCategory[1].toLocaleString()}` : 'No data'}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Average Spend</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${Math.round(monthlyAvg).toLocaleString()}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Savings Rate</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {summary.income ? Math.round((summary.balance / summary.income) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Transactions
              </h2>
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <button
                  onClick={() => setSortConfig({
                    key: 'amount',
                    direction: sortConfig.key === 'amount' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                  })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} hover:bg-gray-50 dark:hover:bg-gray-600 transition`}
                >
                  <ArrowUpDown size={16} />
                  Sort by Amount
                </button>
                {role === 'admin' && (
                  <>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus size={16} />
                      Add Transaction
                    </button>
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      <Download size={16} />
                      Export
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  {role === 'admin' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {transaction.description}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-xs">
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </td>
                      {role === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            <form onSubmit={handleAddOrEdit}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Amount
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option>Food</option>
                    <option>Housing</option>
                    <option>Transportation</option>
                    <option>Entertainment</option>
                    <option>Utilities</option>
                    <option>Health</option>
                    <option>Investment</option>
                    <option>Income</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingTransaction ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetModal}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple line chart component using SVG
function ResponsiveLineChart({ data, darkMode }) {
  const height = 200;
  const width = 500;
  const padding = 40;
  
  if (!data.length) {
    return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;
  }
  
  const maxBalance = Math.max(...data.map(d => d.balance), 1000);
  const minBalance = Math.min(...data.map(d => d.balance), 0);
  const range = maxBalance - minBalance;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.balance - minBalance) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <polyline
        points={points}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      {data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((d.balance - minBalance) / range) * (height - padding * 2);
        return (
          <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" />
        );
      })}
      {data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        return (
          <text key={`label-${i}`} x={x} y={height - 10} textAnchor="middle" fontSize="10" fill={darkMode ? '#9ca3af' : '#6b7280'}>
            {d.month}
          </text>
        );
      })}
      <text x="10" y="20" fontSize="10" fill={darkMode ? '#9ca3af' : '#6b7280'}>
        ${Math.round(maxBalance)}
      </text>
      <text x="10" y={height - padding} fontSize="10" fill={darkMode ? '#9ca3af' : '#6b7280'}>
        ${Math.round(minBalance)}
      </text>
    </svg>
  );
}

// Simple pie chart component using SVG
function ResponsivePieChart({ data, darkMode }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No expense data</div>;
  }
  
  let currentAngle = 0;
  const segments = [];
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec489a', '#06b6d4'];
  
  Object.entries(data).forEach(([category, amount], index) => {
    const angle = (amount / total) * 360;
    segments.push({
      category,
      amount,
      angle,
      color: colors[index % colors.length]
    });
  });
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {segments.reduce((acc, segment, idx) => {
          const startAngle = currentAngle;
          const endAngle = currentAngle + segment.angle;
          currentAngle = endAngle;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = 100 + 80 * Math.cos(startRad);
          const y1 = 100 + 80 * Math.sin(startRad);
          const x2 = 100 + 80 * Math.cos(endRad);
          const y2 = 100 + 80 * Math.sin(endRad);
          
          const largeArc = segment.angle > 180 ? 1 : 0;
          
          const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
          
          acc.push(
            <path key={idx} d={pathData} fill={segment.color} stroke={darkMode ? '#1f2937' : '#ffffff'} strokeWidth="2" />
          );
          return acc;
        }, [])}
        <circle cx="100" cy="100" r="40" fill={darkMode ? '#1f2937' : '#ffffff'} />
      </svg>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {segments.map((segment, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {segment.category}: ${segment.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;