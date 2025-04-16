'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyExpense {
  month: string;
  total: number;
}

interface MonthlyExpensesChartProps {
  expenses: MonthlyExpense[];
}

const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({ expenses }) => {
  return (
    <ResponsiveContainer width="35%" height={300}>
      <BarChart data={expenses}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip formatter={(value) => `$${value}`} />
        <Bar dataKey="total" fill="#8E7DBE" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyExpensesChart;