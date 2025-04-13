'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlgorithmName, SortStep } from '@/lib/sortingAlgorithms';

interface VisualizationPanelProps {
  array: number[];
  currentStep: SortStep | undefined;
  algorithm: AlgorithmName;
  numElements: number;
  comparisons: number;
  timeElapsed: number;
  isRunning: boolean;
  isPaused: boolean;
  isSortingComplete: boolean;
  startSorting: () => void;
  pauseSorting: () => void;
  resetSorting: () => void;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  array,
  currentStep,
  algorithm,
  numElements,
  comparisons,
  timeElapsed,
  isRunning,
  isPaused,
  isSortingComplete,
  startSorting,
  pauseSorting,
  resetSorting,
}) => {
  const visualizationRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Format time
  const formatTime = (time: number) => time.toFixed(3);

  // Update container dimensions
  useEffect(() => {
    const adjustDimensions = () => {
      if (visualizationRef.current) {
        const { width, height } = visualizationRef.current.getBoundingClientRect();
        setContainerWidth(width);
        // Ensure min height respects available space
        const minHeight = Math.min(Math.max(300, window.innerHeight * 0.5), 500);
        visualizationRef.current.style.height = `${minHeight}px`;
      }
    };

    adjustDimensions();
    const resizeObserver = new ResizeObserver(adjustDimensions);
    if (visualizationRef.current) {
      resizeObserver.observe(visualizationRef.current);
    }

    return () => {
      if (visualizationRef.current) {
        resizeObserver.unobserve(visualizationRef.current);
      }
    };
  }, []);

  // Calculate bar width based on container width and number of elements
  const calculateBarWidth = () => {
    if (!containerWidth || numElements === 0) return 2; // Default minimum width
    
    const totalPadding = 16; // p-2 on parent means 8px padding on each side
    const availableWidth = containerWidth - totalPadding;
    const gapBetweenBars = 2; // Pixels
    const totalGapWidth = (numElements - 1) * gapBetweenBars;
    const calculatedWidth = (availableWidth - totalGapWidth) / numElements;
    
    return Math.max(2, Math.min(calculatedWidth, 30)); // Min 2px, Max 30px
  };
  
  const barWidth = calculateBarWidth();

  return (
    <div className="w-full lg:w-2/3 bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col border border-gray-200">
      {/* New Main Title */}
      <h1 className="text-2xl font-bold mb-1 text-center text-gray-900">
        Sorting Algorithms Motion Showcase by 
        <a 
          href="https://medium.com/@wjleon" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Wilmer Leon
        </a>
      </h1>
      
      {/* Existing Title - Modified */}
      <h2 className="text-lg font-medium mb-4 text-center text-gray-700">
        Sorting {numElements} Elements with {algorithm} - Made with Cursor AI
      </h2>

      {/* Metrics */}
      <div className="text-sm mb-4 flex flex-col md:flex-row md:space-x-6 text-gray-600">
        <span>Comparisons: <span className="font-medium text-gray-800">{comparisons}</span></span>
        <span>Time: <span className="font-medium text-gray-800">{formatTime(timeElapsed)}s</span></span>
      </div>

      {/* Completion Message */}
      {isSortingComplete && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-md mb-4 text-sm shadow-sm">
          Finished sorting in {formatTime(timeElapsed)}s with {comparisons} comparisons.
        </div>
      )}

      {/* Visualization Area */}
      <div 
        ref={visualizationRef}
        className="flex-1 mb-4 relative border border-gray-300 rounded-md overflow-hidden bg-white shadow-inner"
        style={{ minHeight: '300px' }} // Initial minHeight
      >
        <div className="absolute inset-0 flex items-end justify-center px-2 space-x-[2px]">
          {array.map((value, index) => {
            const heightPercent = Math.max(1, (value / numElements) * 100); // Ensure min 1% height
            const isComparing = currentStep?.comparing?.includes(index);
            const isSwapping = currentStep?.swapping?.includes(index);
            
            let barColor = 'bg-blue-500';
            let extraClasses = 'transition-all duration-300 ease-out';
            let transformStyle = 'scaleY(1)';
            
            if (isComparing) {
              barColor = 'bg-yellow-400';
              transformStyle = 'scaleY(1.02)'; // Slightly raise comparing bars
            }
            if (isSwapping) {
              barColor = 'bg-red-500';
              extraClasses = 'animate-pulse transition-all duration-150 ease-in-out'; // Faster pulse for swap
              transformStyle = 'scaleY(1.05)'; // Scale swapping bars more
            }
            if (isSortingComplete) {
              barColor = 'bg-green-500';
              extraClasses = 'transition-all duration-500 ease-in'; // Slower transition to green
            }
            
            return (
              <div
                key={index}
                className={`${barColor} ${extraClasses} rounded-t-sm flex-shrink-0`}
                style={{
                  height: `${heightPercent}%`,
                  width: `${barWidth}px`,
                  transformOrigin: 'bottom',
                  transform: transformStyle,
                  boxShadow: isComparing || isSwapping ? '0 0 8px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.1)',
                }}
                title={`Value: ${value}`}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={startSorting}
          disabled={isRunning && !isPaused}
          className={`px-5 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${
            isRunning && !isPaused
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
          }`}
        >
          {isPaused ? 'Resume' : isSortingComplete ? 'Restart' : 'Start'}
        </button>
        <button
          onClick={pauseSorting}
          disabled={!isRunning || isPaused}
          className={`px-5 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${
            !isRunning || isPaused
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400'
          }`}
        >
          Pause
        </button>
        <button
          onClick={resetSorting}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default VisualizationPanel; 