import React, { ReactElement, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';

interface Entry {
  name: string;
  value: number;
  searchParam: string;
}

interface Color {
  normal: string;
  active: string;
}

const data: Array<Entry> = [
  { name: 'Pending', value: 40, searchParam: 'pending' },
  { name: 'Scheduled', value: 39, searchParam: 'scheduled' },
  { name: 'In Transit', value: 33, searchParam: 'intransit' },
  { name: 'Ready for TSDF Signature', value: 21, searchParam: 'readyforsignature' },
];

const inactiveAlpha = '1';
const activeAlpha = '.75';

const COLORS: Array<Color> = [
  { normal: `rgba(0, 136, 254, ${inactiveAlpha})`, active: `rgba(0, 136, 254, ${activeAlpha})` },
  { normal: `rgba(0, 196, 159, ${inactiveAlpha})`, active: `rgba(0, 196, 159, ${activeAlpha})` },
  { normal: `rgba(255, 187, 40, ${inactiveAlpha})`, active: `rgba(255, 187, 40, ${activeAlpha})` },
  { normal: `rgba(255, 128, 66, ${inactiveAlpha})`, active: `rgba(255, 128, 66, ${activeAlpha})` },
];

const PIE_HOVER_OFFSET_DISTANCE = 9;
const START_LABEL_DISTANCE = 10;
const MID_LABEL_DISTANCE = 30;
const RADIAN = Math.PI / 180;

const calculateTrig = (midAngle: number): { sin: number; cos: number } => ({
  sin: Math.sin(-RADIAN * midAngle),
  cos: Math.cos(-RADIAN * midAngle),
});

const calculateCoordinates = (
  radius: number,
  distance: number,
  x: number,
  y: number,
  sin: number,
  cos: number
): { x: number; y: number } => {
  return {
    x: x + (radius + distance) * cos,
    y: y + (radius + distance) * sin,
  };
};

const renderCustomLabel = (props: any): ReactElement | null => {
  const { cx, cy, midAngle, outerRadius, value, hover, activeIndex, index } = props;
  const { sin, cos } = calculateTrig(midAngle);
  const label = calculateCoordinates(outerRadius, -MID_LABEL_DISTANCE, cx, cy, sin, cos);

  // correct for text anchoring bottom-left on (x,y) coord
  // a positive Y value moves the element down
  // a positive X value moves the element right
  const ySign = sin < 0 ? -1 : 1;
  const dDistance = 2;
  const dx = value.toString().length * -dDistance;
  const dy = sin > 0 ? value.toString().length * ySign * dDistance : 0;

  const labelElement = (
    <text
      x={hover ? label.x + 8 * cos : label.x}
      y={hover ? label.y + 8 * sin : label.y}
      dx={dx}
      dy={dy}
      fill="white"
      dominantBaseline="central"
    >
      {`${value}`}
    </text>
  );

  return activeIndex !== index ? labelElement : null;
};

const renderOuterRing = (props: any): ReactElement => {
  const { cx, cy, midAngle, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const { sin, cos } = calculateTrig(midAngle);

  const hover = calculateCoordinates(0, PIE_HOVER_OFFSET_DISTANCE, cx, cy, sin, cos);
  const labelStart = calculateCoordinates(
    outerRadius,
    START_LABEL_DISTANCE,
    hover.x,
    hover.y,
    sin,
    cos
  );
  const labelMid = calculateCoordinates(
    outerRadius,
    MID_LABEL_DISTANCE,
    hover.x,
    hover.y,
    sin,
    cos
  );
  const labelEnd = { x: labelMid.x + (cos >= 0 ? 1 : -1) * 22, y: labelMid.y };
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <>
      <Sector
        cx={hover.x}
        cy={hover.y}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 11}
        fill={fill}
      />
      {renderCustomLabel({
        cx,
        cy,
        midAngle,
        outerRadius,
        value: payload.value,
        hover: true,
        activeIndex: -1,
      })}
      <path
        d={`M${labelStart.x},${labelStart.y}L${labelMid.x},${labelMid.y}L${labelEnd.x},${labelEnd.y}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={labelEnd.x} cy={labelEnd.y} r={2} fill={fill} stroke="none" />
      <text
        x={labelEnd.x + (cos >= 0 ? 12 : -12)}
        y={labelEnd.y}
        dy={6}
        textAnchor={textAnchor}
        fill="#333"
      >{`${(percent * 100).toFixed(2)}%`}</text>
    </>
  );
};

const renderShape = (props: any): ReactElement => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, onClick } = props;
  const { sin, cos } = calculateTrig(midAngle);
  const offset = 9;
  const x = cx + offset * cos;
  const y = cy + offset * sin;

  return (
    <g>
      <Sector
        cursor={'pointer'}
        cx={x}
        cy={y}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        onClick={onClick}
      />
      {renderOuterRing(props)}
    </g>
  );
};

const renderLegend = (props: any): ReactElement => {
  const { payload, handleMouseEnter, handleMouseLeave, handleClick } = props;

  return (
    <div
      className="recharts-legend-wrapper"
      style={{ position: 'absolute', width: '626px', height: '36px', left: '5px', bottom: '5px' }}
    >
      <ul
        className="recharts-default-legend"
        style={{ padding: '0px', margin: '10px', textAlign: 'center' }}
      >
        {payload.map((entry: any, index: number) => {
          const dataEntry = data.find((d) => d.name === entry.value);
          const activeAlphaColor = entry.color.slice(
            entry.color.lastIndexOf(' ') + 1,
            entry.color.length - 1
          );
          const activeLegend = activeAlphaColor === activeAlpha;
          const baseStyle = { color: entry.color, paddingBottom: '2px' };
          const spanStyle = activeLegend ? { ...baseStyle, borderBottom: `2px solid` } : baseStyle;

          return (
            <button
              key={`item-${index}`}
              onMouseEnter={() => handleMouseEnter(null, index)}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick(dataEntry)}
              className={`recharts-legend-item legend-item-${index}`}
              style={{ display: 'inline-block', marginRight: '10px' }}
            >
              <svg
                className="recharts-surface"
                width="14"
                height="14"
                style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}
                viewBox="0 0 32 32"
              >
                <title></title>
                <desc></desc>
                <path
                  stroke="none"
                  fill={entry.color}
                  d="M0,4h32v24h-32z"
                  className="recharts-legend-icon"
                />
              </svg>
              <span className="recharts-legend-item-text" style={spanStyle}>
                {entry.value}
              </span>
            </button>
          );
        })}
      </ul>
    </div>
  );
};

export function ManifestStatusPieChart() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [animationIsActive, setAnimationIsActive] = useState(true);
  const navigate = useNavigate();

  const handleMouseEnter = useCallback(
    (_: any, index: number) => {
      setAnimationIsActive(false);
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const handleMouseLeave = useCallback(() => {
    setAnimationIsActive(false);
    setActiveIndex(-1);
  }, [setActiveIndex]);

  const renderLabel = (props: any) => {
    return renderCustomLabel({ ...props, hover: false, activeIndex: activeIndex });
  };

  const handleClick = (entry: Entry) => () => {
    navigate({
      pathname: './manifest',
      search: `?status=${entry.searchParam}`,
    });
  };

  return (
    <ResponsiveContainer minWidth={100} minHeight={300} height={'10%'}>
      <PieChart width={400} height={400}>
        <Legend
          content={(props: any) => {
            return renderLegend({ ...props, handleMouseEnter, handleMouseLeave, handleClick });
          }}
          verticalAlign="bottom"
          height={36}
        />
        <Pie
          isAnimationActive={animationIsActive}
          onAnimationEnd={() => setAnimationIsActive(false)}
          onAnimationStart={() => setAnimationIsActive(true)}
          activeIndex={activeIndex}
          activeShape={(props: any) => renderShape(props)}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
          label={(props) => {
            if (!animationIsActive) return renderLabel(props);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          cursor={'pointer'}
        >
          {data.map((entry: Entry, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={index === activeIndex ? COLORS[index].active : COLORS[index].normal}
              onClick={handleClick(entry)}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
