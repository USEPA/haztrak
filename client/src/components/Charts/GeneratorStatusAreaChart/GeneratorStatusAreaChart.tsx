import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const generatorStatusYAxis = ([_dataMin, dataMax]: [number, number]): [number, number] => {
  const yMax = dataMax < 100 ? 120 : dataMax < 1000 ? 1200 : Math.ceil((dataMax * 1.5) / 100) * 100;
  return [0, yMax];
};

function daysInMonth() {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  return new Date(year, month, 0).getDate();
}

const data = [
  {
    day: 1,
    haz: 4,
  },
  {
    day: 2,
    haz: 4,
  },
  {
    day: 3,
    haz: 4,
  },
  {
    day: 4,
    haz: 44,
  },
  {
    day: 5,
    haz: 44,
  },
  {
    day: 6,
    haz: 326,
  },
  {
    day: 7,
    haz: 326,
  },
  {
    day: 8,
    haz: 326,
  },
  {
    day: 9,
    haz: 326,
  },
  {
    day: 10,
    haz: 386,
  },
  {
    day: 11,
    haz: 386,
  },
  {
    day: 12,
    haz: 386,
  },
  {
    day: 13,
    haz: 461,
  },
  {
    day: 14,
    haz: 461,
  },
];

export function GeneratorStatusAreaChart() {
  const monthNumber = new Date().getMonth();
  const days = daysInMonth();
  return (
    <ResponsiveContainer minWidth={100} minHeight={300} height={'10%'}>
      <AreaChart data={data} margin={{ top: 10, right: 50, left: 25, bottom: 25 }}>
        <defs>
          <linearGradient id="colorHaz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <ReferenceLine
          y={1000}
          label={{ value: 'LQG', position: 'right' }}
          stroke="red"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={100}
          label={{ value: 'SQG', position: 'right' }}
          stroke="blue"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="day"
          type="number"
          domain={[1, days]}
          tickFormatter={(value, _index) => `${monthNumber + 1}/${value}`}
        >
          <Label value="Date" position="bottom" />
        </XAxis>
        <YAxis domain={generatorStatusYAxis}>
          <Label value="Hazardous Waste (kg)" position="left" angle={-90} />
        </YAxis>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="haz"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorHaz)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
