'use client';

import React, { ReactElement } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SVGProps } from 'react';

interface CategoryBudget {
  category: string;
  budget: number;
  actual: number;
}

interface BudgetVsActualChartProps {
  data: CategoryBudget[];
}

interface RechartsTickProps extends SVGProps<SVGTextElement> {
  x: number;
  y: number;
  payload: { value: string | number } | null;
}

const BudgetVsActualTick = (props: RechartsTickProps): ReactElement<SVGElement> => {
  const { x, y, payload, ...rest } = props;

  if (!payload || typeof x !== 'number' || typeof y !== 'number') {
    return <g />; // Return an empty SVG group if data is missing
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        {...rest}
        dy={16}
        textAnchor="end"
        transform="rotate(-45)"
        fontSize={12}
        dominantBaseline="hanging"
        style={{ fill: '#000' }}
      >
        {payload.value}
      </text>
    </g>
  );
};

const BudgetVsActualChart: React.FC<BudgetVsActualChartProps> = ({ data }) => {
  const tooltipFormatter = (value: number | string) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return `$${Number(value).toFixed(2)}`;
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" tick={BudgetVsActualTick} interval={0} />
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
