// components/charts/Ratingchart.tsx
"use client";

import React, { useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

interface RatingChartProps {
  totalRatings: number;
  averageRating: number;
}

export const RatingChart = ({ totalRatings, averageRating }: RatingChartProps) => {
  const negative = 5 - averageRating;

  const data = [
    { name: "Positive", value: averageRating, fill: "#2ecc71" },
    { name: "Negative", value: negative, fill: "#e74c3c" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          style={{ fontWeight: "bold", fontSize: 16 }}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={24}
          textAnchor="middle"
          fill="#333"
          style={{ fontSize: 14 }}
        >
          {`${value} (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ratings</h1>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={90}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-2xl font-bold">{averageRating.toFixed(1)}</h1>
        <p className="text-xs text-gray-500">of max ratings</p>
      </div>

      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
        Rated by {totalRatings} patients
      </h2>
    </div>
  );
};
