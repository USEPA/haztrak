import { useState, useCallback } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface Entry {
  name: string;
  value: number;
  searchParam: string;
}

const data: Array<Entry> = [
  { name: 'Pending', value: 40, searchParam: 'pending' },
  { name: 'Scheduled', value: 39, searchParam: 'scheduled' },
  { name: 'In Transit', value: 33, searchParam: 'intransit' },
  { name: 'Ready for TSDF Signature', value: 21, searchParam: 'readyforsignature' },
];

const normalAlpha = '1';
const activeAlpha = '.75';

const COLORS = [
  { normal: `rgba(0, 136, 254, ${normalAlpha})`, active: `rgba(0, 136, 254, ${activeAlpha})` },
  { normal: `rgba(0, 196, 159, ${normalAlpha})`, active: `rgba(0, 196, 159, ${activeAlpha})` },
  { normal: `rgba(255, 187, 40, ${normalAlpha})`, active: `rgba(255, 187, 40, ${activeAlpha})` },
  { normal: `rgba(255, 128, 66, ${normalAlpha})`, active: `rgba(255, 128, 66, ${activeAlpha})` },
];

const RADIAN = Math.PI / 180;

const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, value, hover, activeIndex } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const lx = cx + (outerRadius - 30) * cos;
  const ly = cy + (outerRadius - 30) * sin;
  const hoverPieX = lx + 8 * cos;
  const hoverPieY = ly + 8 * sin;

  const label = (
    <text
      x={hover ? hoverPieX : lx}
      y={hover ? hoverPieY : ly}
      fill="white"
      dominantBaseline="central"
    >
      {`${value}`}
    </text>
  );

  return activeIndex < 0 ? label : null;
};

const renderOuterRing = (props: any) => {
  const { cx, cy, midAngle, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const PIE_HOVER_OFFSET_DISTANCE = 9;

  const hoverPieX = cx + PIE_HOVER_OFFSET_DISTANCE * cos;
  const hoverPieY = cy + PIE_HOVER_OFFSET_DISTANCE * sin;

  const labelStartX = hoverPieX + (outerRadius + 10) * cos;
  const labelStartY = hoverPieY + (outerRadius + 10) * sin;
  const labelMidX = hoverPieX + (outerRadius + 30) * cos;
  const labelMidY = hoverPieY + (outerRadius + 30) * sin;

  const labelEndX = labelMidX + (cos >= 0 ? 1 : -1) * 22;
  const labelEndY = labelMidY;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <>
      <Sector
        cx={hoverPieX}
        cy={hoverPieY}
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
        d={`M${labelStartX},${labelStartY}L${labelMidX},${labelMidY}L${labelEndX},${labelEndY}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={labelEndX} cy={labelEndY} r={2} fill={fill} stroke="none" />
      <text
        x={labelEndX + (cos >= 0 ? 12 : -12)}
        y={labelEndY}
        dy={6}
        textAnchor={textAnchor}
        fill="#333"
      >{`${(percent * 100).toFixed(2)}%`}</text>
    </>
  );
};

const renderShape = (props: any, isActive: boolean) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, onClick } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const offset = isActive ? 9 : 0;
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
      {isActive && renderOuterRing(props)}
    </g>
  );
};

const renderLegend = (props: any) => {
  const { payload, handleMouseEnter, handleMouseLeave, handleClick } = props;

  return (
    <div
      className="recharts-legend-wrapper"
      style={{ position: 'absolute', width: '626px', height: '36px', left: '5px', bottom: '5px' }}
    >
      <ul
        className="recharts-default-legend"
        style={{ padding: '0px', margin: '0px', textAlign: 'center' }}
      >
        {payload.map((entry: any, index: number) => {
          const dataEntry = data.find((d) => d.name === entry.value);
          const activeAlphaColor = entry.color.slice(
            entry.color.lastIndexOf(' ') + 1,
            entry.color.length - 1
          );
          const activeLegend = activeAlphaColor === activeAlpha;
          const baseStyle = { color: entry.color, paddingBottom: '2px' };
          const spanStyle = activeLegend
            ? { ...baseStyle, borderBottom: `2px solid ${entry.color}` }
            : baseStyle;

          // const activeLegend =
          //   entry.color.slice(entry.color.lastIndexOf(' ') + 1, entry.color.length - 1) === activeAlpha;
          // const baseStyle = { color: entry.color, paddingBottom: '2px' };
          // const spanStyle = activeLegend
          //   ? { ...baseStyle, borderBottom: `2px solid ${entry.color}` }
          //   : { ...baseStyle };

          return (
            <button
              key={`item-${index}`}
              onMouseEnter={() => handleMouseEnter(null, index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(dataEntry)}
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
                ></path>
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
  const navigate = useNavigate();

  const handleMouseEnter = useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(-1);
  }, [setActiveIndex]);

  const handleClick = (entry: Entry) => {
    navigate({
      pathname: './manifest',
      search: `?status=${entry.searchParam}`,
    });
  };

  return (
    <ResponsiveContainer minWidth={100} minHeight={300} height="10%">
      <PieChart width={400} height={400}>
        <Legend
          content={(props: any) =>
            renderLegend({ ...props, handleMouseEnter, handleMouseLeave, handleClick })
          }
          verticalAlign="bottom"
          height={36}
        />
        <Pie
          activeIndex={activeIndex}
          activeShape={(props: any) => renderShape(props, true)}
          inactiveShape={(props: any) => renderShape(props, false)}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
          label={(props: any) =>
            renderCustomLabel({ ...props, hover: false, activeIndex: activeIndex })
          }
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          cursor={'pointer'}
        >
          {data.map((entry: Entry, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={index === activeIndex ? COLORS[index].active : COLORS[index].normal}
              onClick={() => handleClick(entry)}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
