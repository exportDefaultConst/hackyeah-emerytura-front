import React, { useState, useRef, useCallback } from "react";

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value = [50],
  onValueChange,
  onDragStart,
  onDragEnd,
  className = "",
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);

  const currentValue = Array.isArray(value) ? value[0] : value;

  // Calculate percentage for positioning
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const updateValue = useCallback(
    (clientX) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      );
      const rawValue = min + (percentage / 100) * (max - min);

      // Round to nearest step
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      if (onValueChange && clampedValue !== currentValue) {
        onValueChange([clampedValue]);
      }
    },
    [min, max, step, currentValue, onValueChange]
  );

  const handleStart = useCallback(
    (clientX) => {
      if (disabled) return;

      setIsDragging(true);
      onDragStart && onDragStart();
      updateValue(clientX);
    },
    [disabled, updateValue, onDragStart]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    onDragEnd && onDragEnd();
  }, [onDragEnd]);

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      handleStart(e.clientX);

      const handleMouseMove = (e) => {
        updateValue(e.clientX);
      };

      const handleMouseUp = () => {
        handleEnd();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleStart, handleEnd, updateValue]
  );

  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX);

      const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        updateValue(touch.clientX);
      };

      const handleTouchEnd = () => {
        handleEnd();
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [handleStart, handleEnd, updateValue]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;

      let newValue = currentValue;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue = Math.max(min, currentValue - step);
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue = Math.min(max, currentValue + step);
          break;
        case "Home":
          e.preventDefault();
          newValue = min;
          break;
        case "End":
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }

      if (onValueChange && newValue !== currentValue) {
        onValueChange([newValue]);
      }
    },
    [disabled, currentValue, min, max, step, onValueChange]
  );

  return (
    <div className={`w-full py-3 ${className}`}>
      <div
        ref={sliderRef}
        className={`relative w-full h-2 bg-slate-200 rounded outline-none transition-colors focus:ring-2 focus:ring-(--color-zus-green) focus:ring-opacity-50 ${
          disabled ? "bg-slate-100 cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`absolute top-0 left-0 h-full bg-(--color-zus-green) rounded ${
            disabled ? "bg-slate-400" : ""
          } ${isDragging ? "" : "transition-all duration-150 ease-out"}`}
          style={{ width: `${percentage}%` }}
        />
        <div
          ref={thumbRef}
          className={`absolute top-1/2 w-5 h-5 bg-white border-2 border-(--color-zus-green) rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md hover:shadow-lg hover:scale-110 focus:ring-2 focus:ring-(--color-zus-green) focus:ring-opacity-50 ${
            isDragging
              ? "cursor-grabbing scale-120 shadow-lg ring-2 ring-(--color-zus-green) ring-opacity-30"
              : "transition-all duration-150 ease-out"
          } ${
            disabled
              ? "border-slate-400 cursor-not-allowed bg-slate-50 hover:scale-100 hover:shadow-md"
              : "cursor-grab"
          }`}
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Slider;
