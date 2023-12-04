import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React, { JSXElementConstructor, ReactElement } from 'react';

const data = [
  {
    date: '2000-01',
    hazardous: 4000,
    nonHazardous: 2400,
  },
  {
    date: '2000-02',
    hazardous: 3000,
    nonHazardous: 1398,
  },
  {
    date: '2000-03',
    hazardous: 2000,
    nonHazardous: 9800,
  },
  {
    date: '2000-04',
    hazardous: 2780,
    nonHazardous: 3908,
  },
  {
    date: '2000-05',
    hazardous: 1890,
    nonHazardous: 4800,
  },
  {
    date: '2000-06',
    hazardous: 2390,
    nonHazardous: 3800,
  },
  {
    date: '2000-07',
    hazardous: 3490,
    nonHazardous: 4300,
  },
  {
    date: '2000-08',
    hazardous: 4000,
    nonHazardous: 2400,
  },
  {
    date: '2000-09',
    hazardous: 3000,
    nonHazardous: 1398,
  },
  {
    date: '2000-10',
    hazardous: 2000,
    nonHazardous: 9800,
  },
  {
    date: '2000-11',
    hazardous: 2780,
    nonHazardous: 3908,
  },
  {
    date: '2000-12',
    hazardous: 1890,
    nonHazardous: 4800,
  },
];

const monthTickFormatter = (tick: any) => {
  const date = new Date(tick);

  return date.getMonth() + 1;
};

const renderQuarterTick = (
  tickProps: any
): ReactElement<SVGElement, string | JSXElementConstructor<any>> => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;
  const isMidMonth = month % 3 === 1;

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
        {/* @ts-ignore*/}
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
