'use client';

import React, { useState, useMemo } from 'react';

// Responsive Interactive SVG Area Chart for Visitors & Sessions over time
export const AreaTimelineChart = React.memo(function AreaTimelineChart({
  data,
  height = 260,
}: {
  data: { date: string; visitors: number; sessions: number }[];
  height?: number;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 800;
  const paddingX = 44;
  const paddingY = 32;

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map((d) => Math.max(d.visitors, d.sessions)), 6);
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;

    const pointsV = data.map((d, i) => {
      const x = paddingX + (i / Math.max(data.length - 1, 1)) * chartW;
      const y = height - paddingY - (d.visitors / maxVal) * chartH;
      return { x, y, val: d.visitors };
    });

    const pointsS = data.map((d, i) => {
      const x = paddingX + (i / Math.max(data.length - 1, 1)) * chartW;
      const y = height - paddingY - (d.sessions / maxVal) * chartH;
      return { x, y, val: d.sessions };
    });

    const pathV = pointsV.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const pathS = pointsS.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const areaV = `${pathV} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

    return { maxVal, chartW, chartH, pointsV, pointsS, pathV, pathS, areaV };
  }, [data, height]);

  if (!chartData || !data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 13.5,
          gap: 6,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-8 4 6 5-10" />
        </svg>
        <span>No telemetry recordings available for this timeframe.</span>
      </div>
    );
  }

  const { maxVal, chartW, chartH, pointsV, pointsS, pathV, pathS, areaV } = chartData;
  const activeItem = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;
  const activePointV = hoverIndex !== null && pointsV[hoverIndex] ? pointsV[hoverIndex] : null;

  return (
    <div className="admin-chart-container" style={{ position: 'relative', width: '100%' }}>
      {/* Interactive Tooltip Card */}
      {activeItem && activePointV && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: `${Math.min(Math.max((activePointV.x / width) * 100, 15), 85)}%`,
            transform: 'translateX(-50%)',
            background: 'var(--admin-card-bg, #0f172a)',
            color: 'var(--admin-text, #ffffff)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 12,
            zIndex: 10,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--admin-text-sub, #94a3b8)' }}>{activeItem.date}</div>
          <div style={{ color: '#38bdf8', fontWeight: 700 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', marginRight: 4 }}>Visitors:</span>
            {activeItem.visitors}
          </div>
          <div style={{ color: '#a78bfa', fontWeight: 700 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', marginRight: 4 }}>Sessions:</span>
            {activeItem.sessions}
          </div>
        </div>
      )}

      <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', minWidth: 540, height: 'auto', display: 'block' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Gradient & Filter Definitions */}
          <defs>
            <linearGradient id="visitorAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0071e3" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#0071e3" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0071e3" stopOpacity="0.0" />
            </linearGradient>
            <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0071e3" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid Horizontal Guidelines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * chartH;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="var(--admin-border, #e2e8f0)"
                  strokeWidth="1"
                  strokeDasharray={idx === 0 ? 'none' : '3 3'}
                  opacity={0.65}
                />
                <text
                  x={paddingX - 10}
                  y={y + 3.5}
                  fill="var(--admin-text-sub, #64748b)"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="system-ui, sans-serif"
                >
                  {Math.round(ratio * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaV} fill="url(#visitorAreaGrad)" />

          {/* Sessions Line (Secondary dashed curve) */}
          <path
            d={pathS}
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity={0.8}
          />

          {/* Visitors Line (Primary high-impact Apple Blue curve) */}
          <path
            d={pathV}
            fill="none"
            stroke="#0071e3"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#chartGlow)"
          />

          {/* Vertical guideline on hover */}
          {activePointV && (
            <line
              x1={activePointV.x}
              y1={paddingY}
              x2={activePointV.x}
              y2={height - paddingY}
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}

          {/* Data Points */}
          {pointsV.map((p, i) => {
            const isHovered = hoverIndex === i;
            return (
              <g key={i}>
                {/* Invisible hover zone */}
                <rect
                  x={p.x - chartW / (data.length * 2)}
                  y={0}
                  width={chartW / data.length}
                  height={height}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onTouchStart={() => setHoverIndex(i)}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? '#38bdf8' : '#ffffff'}
                  stroke="#0071e3"
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ transition: 'all 0.15s ease', pointerEvents: 'none' }}
                />
              </g>
            );
          })}

          {/* Date Axis Labels */}
          {data.map((d, i) => {
            const step = Math.max(1, Math.ceil(data.length / 8));
            if (i % step === 0 || i === data.length - 1) {
              const x = paddingX + (i / Math.max(data.length - 1, 1)) * chartW;
              return (
                <text
                  key={i}
                  x={x}
                  y={height - 8}
                  fill="var(--admin-text-sub, #64748b)"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="system-ui, sans-serif"
                >
                  {d.date.length > 5 ? d.date.substring(5) : d.date}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          marginTop: 10,
          fontSize: 12,
          color: 'var(--admin-text-sub, #64748b)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 3,
              background: '#0071e3',
              borderRadius: 2,
              display: 'inline-block',
            }}
          />
          Unique Visitors
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 3,
              background: '#a78bfa',
              borderRadius: 2,
              display: 'inline-block',
              borderTop: '2px dashed #a78bfa',
            }}
          />
          Total Sessions
        </span>
      </div>
    </div>
  );
});

// Interactive Donut Chart for Breakdown distributions
export const InteractiveDonutChart = React.memo(function InteractiveDonutChart({
  items,
  totalLabel = 'Total',
  size = 190,
}: {
  items: { label: string; count: number; color?: string }[];
  totalLabel?: string;
  size?: number;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const defaultColors = useMemo(
    () => ['#0071e3', '#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f87171'],
    []
  );
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const { total, slices } = useMemo(() => {
    const tot = (items || []).reduce((sum, item) => sum + item.count, 0);
    if (tot === 0 || !items || items.length === 0) {
      return { total: 0, slices: [] };
    }

    let cumulativeAngle = 0;
    const sls = items.map((item, idx) => {
      const fraction = item.count / tot;
      const strokeDasharray = `${circumference * fraction} ${circumference * (1 - fraction)}`;
      const strokeDashoffset = -cumulativeAngle * circumference;
      cumulativeAngle += fraction;
      return {
        ...item,
        color: item.color || defaultColors[idx % defaultColors.length],
        strokeDasharray,
        strokeDashoffset,
        fraction,
      };
    });

    return { total: tot, slices: sls };
  }, [items, circumference, defaultColors]);

  if (total === 0 || !items || items.length === 0) {
    return (
      <div style={{ height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
        No distribution telemetry available.
      </div>
    );
  }

  const activeItem = activeIdx !== null ? slices[activeIdx] : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {slices.map((slice, idx) => (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={activeIdx === idx ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              style={{
                transition: 'all 0.22s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--admin-text, #060e24)' }}>
            {activeItem ? activeItem.count : total}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--admin-text-sub, #64748b)' }}>
            {activeItem ? activeItem.label : totalLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 140 }}>
        {slices.map((slice, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12.5,
              padding: '4px 8px',
              borderRadius: 6,
              background: activeIdx === idx ? 'var(--admin-hover-bg, rgba(0, 113, 227, 0.08))' : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={() => setActiveIdx(idx)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--admin-text, #060e24)', fontWeight: 500 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: slice.color, flexShrink: 0 }} />
              {slice.label}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--admin-text-sub, #64748b)', fontSize: 12 }}>
              {Math.round(slice.fraction * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// Horizontal Comparative Bar Chart for Services / Pages
export const HorizontalBarChart = React.memo(function HorizontalBarChart({
  items,
}: {
  items: { label: string; value: number; secondary?: string }[];
}) {
  const max = useMemo(() => Math.max(...(items || []).map((i) => i.value), 1), [items]);

  if (!items || items.length === 0) {
    return (
      <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
        No telemetry ranking data recorded yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((item, idx) => {
        const pct = Math.round((item.value / max) * 100);
        return (
          <div key={idx}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              <span style={{ color: 'var(--admin-text, #060e24)' }}>{item.label}</span>
              <span style={{ color: '#0071e3', fontWeight: 700 }}>
                {item.value} {item.secondary ? <span style={{ color: 'var(--admin-text-sub, #64748b)', fontWeight: 500 }}>({item.secondary})</span> : ''}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 8,
                background: 'var(--admin-border, #f1f5f9)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #0071e3 0%, #38bdf8 100%)',
                  borderRadius: 999,
                  transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
