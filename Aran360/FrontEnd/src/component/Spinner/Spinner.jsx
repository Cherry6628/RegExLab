import React from "react";

const Spinner = ({
  size = 60,
  color = "#ffffff",
  strokeWidth = 4,
  speed = "1s",
  dashRatio = 0.4
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const dashLength = circumference * dashRatio;
  const gapLength = circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="status"
      aria-label="Loading"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dashLength} ${gapLength}`}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${center} ${center}`}
          to={`360 ${center} ${center}`}
          dur={speed}
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default Spinner;