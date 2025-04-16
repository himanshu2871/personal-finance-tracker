// src/components/BudgetVsActualChart.tsx
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryBudget {
  category: string;
  budget: number;
  actual: number;
}

interface BudgetVsActualChartProps {
  data: CategoryBudget[];
}

const BudgetVsActualChart: React.FC<BudgetVsActualChartProps> = ({ data }) => {
  const tooltipFormatter = (value: number | string) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return `$${Number(value).toFixed(2)}`;
  };

  const renderXAxisTick = (tickProps: any) => {
    const { x, y, payload } = tickProps;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          transform="rotate(-45)"
          fontSize={12}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}> 
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" tick={renderXAxisTick} interval={0} />
        <YAxis />
        <Tooltip formatter={tooltipFormatter} />
        <Legend verticalAlign="top" align="center"/>
        <Bar dataKey="budget" fill="#3E3F5B" name="Budget" />
        <Bar dataKey="actual" fill="#EF9651" name="Actual Spending" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetVsActualChart;