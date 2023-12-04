import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Pending', value: 400 },
  { name: 'Scheduled', value: 300 },
  { name: 'In Transit', value: 300 },
  { name: 'Ready for TSDF Signature', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ManifestStatusPieChart() {
  return (
    <ResponsiveContainer minWidth={100} minHeight={300} height={'10%'}>
      <PieChart width={400} height={400}>
        <Legend verticalAlign="bottom" height={36} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label={true}
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
