// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import BudgetVsActualChart from '@/components/BudgetVsActualChart';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


interface Transaction {
  _id?: string;
  amount: number;
  date: Date;
  description: string;
  category: string;
}

interface MonthlyExpense {
  month: string;
  total: number;
}

interface CategoryExpense {
  name: string;
  value: number;
  color: string; // Optional color
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Entertainment',
  'Personal Care',
  'Education',
  'Travel',
  'Shopping',
  'Debt & Loans',
  'Savings & Investments',
  'Miscellaneous',
];

interface CategoryBudget {
  category: string;
  budget: number;
  actual: number;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [topCategories, setTopCategories] = useState<CategoryExpense[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({});
  const [budgetVsActual, setBudgetVsActual] = useState<CategoryBudget[]>([]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, '_id'>) => {
    if (editingTransaction) {
      // Update the existing transaction
      setTransactions(
        transactions.map((transaction) =>
          transaction._id === editingTransaction._id
            ? { ...editingTransaction, ...newTransaction, date: new Date(newTransaction.date) }
            : transaction
        )
      );
      setEditingTransaction(null); // Clear editing state
    } else {
      // Add a new transaction
      setTransactions([...transactions, { ...newTransaction, _id: Math.random().toString(36), date: new Date(newTransaction.date) }]);
    }
  };

  const handleEditTransaction = (transactionToEdit: Transaction) => {
    setEditingTransaction(transactionToEdit);
  };

  const handleDeleteTransaction = (idToDelete: string) => {
    setTransactions(transactions.filter((t) => t._id !== idToDelete));
  };

  const handleSetBudget = (category: string, amount: number | undefined) => {
    console.log("Setting budget for", category, "to:", amount);
    if (amount !== undefined && !isNaN(amount)) {
      setBudgets({ ...budgets, [category]: amount });
    } else {
      const newBudgets = { ...budgets };
      delete newBudgets[category];
      setBudgets(newBudgets);
    }
  };

  useEffect(() => {
    // Calculate monthly expenses
    console.log("All Transactions:", transactions);
    const expensesByMonth: { [key: string]: number } = {};
    transactions.forEach((transaction) => {
      const monthYear = `${transaction.date.getFullYear()}-${(transaction.date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      expensesByMonth[monthYear] = (expensesByMonth[monthYear] || 0) + transaction.amount;
    });
    const monthlyExpenseData: MonthlyExpense[] = Object.entries(expensesByMonth).map(
      ([month, total]) => ({ month, total })
    );
    setMonthlyExpenses(monthlyExpenseData);

    // Calculate category-wise expenses
    const expensesByCategory: { [key: string]: number } = {};
    transactions.forEach((transaction) => {
      expensesByCategory[transaction.category] =
        (expensesByCategory[transaction.category] || 0) + transaction.amount;
    });
    const categoryExpenseData: CategoryExpense[] = Object.entries(expensesByCategory).map(
      ([category, total]) => ({ name: category, value: total, color: '' })
    );
    setCategoryExpenses(categoryExpenseData);

    // Calculate total expenses
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    setTotalExpenses(total);

    // Get top categories by expense
    const sortedCategories = [...categoryExpenseData].sort((a, b) => b.value - a.value);
    setTopCategories(sortedCategories.slice(0, 3));

    // Get most recent transactions
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setRecentTransactions(sortedTransactions.slice(0, 5));

    // Calculate budget vs actual for the current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTransactions = transactions.filter(
      (t) => t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear
    );
    console.log("Monthly Transactions:", monthlyTransactions);

    const actualSpending: { [key: string]: number } = {};
    monthlyTransactions.forEach((transaction) => {
      actualSpending[transaction.category] =
        (actualSpending[transaction.category] || 0) + transaction.amount;
        console.log("Actual Spending for", transaction.category, ":", transaction.amount);
    });
    console.log("Total Actual Spending:", actualSpending);
    console.log("Current Budgets:", budgets);

    const budgetData: CategoryBudget[] = categories.map((category) => {
      console.log("Mapping category:", category);
      console.log("Keys in actualSpending:", Object.keys(actualSpending));
      return {
        category: category,
        budget: budgets[category] || 0,
        actual: actualSpending[category] || 0,
      };
    });
    console.log("Calculated budgetData:", budgetData);
    setBudgetVsActual(budgetData);
  }, [transactions, budgets]);

  const overspendingCategories = budgetVsActual.filter((item) => item.actual > item.budget);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h1>
      <TransactionForm
        onTransactionAdded={handleAddTransaction}
        editingTransaction={editingTransaction}
      />

      <div className="mt-8 bg-white rounded-md shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Set Monthly Budgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <Label htmlFor={`budget-${category.replace(/\s+/g, '-')}`}>{category}</Label>
              <Input
                type="number"
                id={`budget-${category.replace(/\s+/g, '-')}`}
                placeholder="Enter budget"
                value={budgets[category] || ''}
                onChange={(e) => handleSetBudget(category, parseFloat(e.target.value))}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">Enter your monthly budget for each category.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-md shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
          <p className="text-2xl font-bold text-green-500">${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-md shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Top Expense Categories</h2>
          {topCategories.length > 0 ? (
            <ul>
              {topCategories.map((category) => (
                <li key={category.name} className="py-1">
                  <span className="font-semibold">{category.name}:</span> ${category.value.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No category data yet.</p>
          )}
        </div>

        <div className="bg-white rounded-md shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <ul>
              {recentTransactions.map((transaction) => (
                <li key={transaction._id} className="py-1 text-sm">
                  <span className="font-semibold">{format(new Date(transaction.date), 'MMM dd')}:</span>{' '}
                  {transaction.description} (${transaction.amount.toFixed(2)})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No transactions yet.</p>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Transaction History</h2>
      <TransactionList
        transactions={transactions}
        onDelete={handleDeleteTransaction}
        onEdit={handleEditTransaction}
      />

      <h2 className="text-xl font-bold mt-8 mb-4">Budget vs Actual</h2>
      <BudgetVsActualChart data={budgetVsActual} />

      <h2 className="text-xl font-bold mt-8 mb-4">Monthly Expenses</h2>
      <MonthlyExpensesChart expenses={monthlyExpenses} />

      <h2 className="text-xl font-bold mt-8 mb-4">Expenses by Category</h2>
      <CategoryPieChart data={categoryExpenses} />

      <div className="mt-8 bg-white rounded-md shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
        {overspendingCategories.length > 0 ? (
          <ul>
            {overspendingCategories.map((item) => {
              const overspentBy = (item.actual - item.budget).toFixed(2);
              return (
                <li key={item.category} className="py-1 text-red-500 font-semibold">
                  {item.category}: Over budget by ${overspentBy}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-green-500 font-semibold">No overspending this month!</p>
        )}
      </div>
    </div>
  );
}