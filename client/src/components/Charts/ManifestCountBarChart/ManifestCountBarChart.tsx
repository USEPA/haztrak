import React, { ReactElement } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  {
    date: '2000-01',
    hazardous: 40,
    nonHazardous: 24,
  },
  {
    date: '2000-02',
    hazardous: 30,
    nonHazardous: 13,
  },
  {
    date: '2000-03',
    hazardous: 20,
    nonHazardous: 98,
  },
  {
    date: '2000-04',
    hazardous: 27,
    nonHazardous: 39,
  },
  {
    date: '2000-05',
    hazardous: 18,
    nonHazardous: 48,
  },
  {
    date: '2000-06',
    hazardous: 23,
    nonHazardous: 38,
  },
  {
    date: '2000-07',
    hazardous: 34,
    nonHazardous: 43,
  },
  {
    date: '2000-08',
    hazardous: 40,
    nonHazardous: 24,
  },
  {
    date: '2000-09',
    hazardous: 30,
    nonHazardous: 13,
  },
  {
    date: '2000-10',
    hazardous: 20,
    nonHazardous: 98,
  },
  {
    date: '2000-11',
    hazardous: 27,
    nonHazardous: 39,
  },
  {
    date: '2000-12',
    hazardous: 18,
    nonHazardous: 48,
  },
];

const monthTickFormatter = (tick: any) => {
  const date = new Date(tick);

  return date.getMonth() + 1;
};

const renderQuarterTick = (tickProps: any): ReactElement<SVGElement> => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;

  if (month % 3 === 1) {
    return <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>;
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
  }
  return <></>;
};

export function ManifestCountBarChart() {
  return (
    <ResponsiveContainer minWidth={100} minHeight={300} height={'10%'}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* @ts-expect-error - ok with dummy data for now*/}
        <XAxis dataKey="date" tickFormatter={monthTickFormatter} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={renderQuarterTick}
          height={1}
          scale="band"
          xAxisId="quarter"
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="nonHazardous" fill="#8884d8" />
        <Bar dataKey="hazardous" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
