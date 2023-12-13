import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Pending', value: 40, searchParam: 'pending' },
  { name: 'Scheduled', value: 39, searchParam: 'scheduled' },
  { name: 'In Transit', value: 33, searchParam: 'intransit' },
  { name: 'Ready for TSDF Signature', value: 21, searchParam: 'readyforsignature' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ManifestStatusPieChart() {
  const navigate = useNavigate();
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
          {data.map((entry, index) => {
            return (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                onClick={() => {
                  navigate({ pathname: './manifest', search: `?status=${entry.searchParam}` });
                }}
              />
            );
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
