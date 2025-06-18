// components/ui/progress.tsx
import React from "react";
import clsx from "clsx";

type CircularSpinnerProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  fullscreen?: boolean; // нове
};

export function CircularSpinner({
  size = 40,
  strokeWidth = 4,
  className,
  fullscreen = false,
}: CircularSpinnerProps) {
  const spinner = (
    <svg
      className={clsx("animate-spin", className, "text-red")}
      width={size}
      height={size}
      viewBox="0 0 50 50"
    >
      <circle
        className="opacity-25"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <circle
        className="opacity-75"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray="90,150"
        strokeDashoffset="0"
        strokeLinecap="round"
      />
    </svg>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
