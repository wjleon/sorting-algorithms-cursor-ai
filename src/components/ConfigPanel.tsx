'use client';

import React, { useState, useEffect } from 'react';
import { AlgorithmName, ElementDistribution } from '@/lib/sortingAlgorithms';

interface ConfigPanelProps {
  algorithm: AlgorithmName;
  setAlgorithm: (algorithm: AlgorithmName) => void;
  numElements: number;
  setNumElements: (num: number) => void;
  distribution: ElementDistribution;
  setDistribution: (distribution: ElementDistribution) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isRunning: boolean;
  resetArray: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  algorithm,
  setAlgorithm,
  numElements,
  setNumElements,
  distribution,
  setDistribution,
  soundEnabled,
  setSoundEnabled,
  isRunning,
  resetArray,
}) => {
  // Local state for the input field to allow temporary invalid values
  const [inputValue, setInputValue] = useState<string>(numElements.toString());

  // Keep local state synced with prop if prop changes externally
  useEffect(() => {
    setInputValue(numElements.toString());
  }, [numElements]);

  // List of all available sorting algorithms
  const algorithms: AlgorithmName[] = [
    'Bubble Sort',
    'Selection Sort',
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort',
    'Heap Sort',
    'Counting Sort',
    'Radix Sort',
    'Bucket Sort',
    'Shell Sort',
    'Tim Sort',
    'Comb Sort',
    'Pigeonhole Sort',
    'Cycle Sort',
    'Strand Sort',
    'Bitonic Sort',
    'Pancake Sort',
    'Bogo Sort',
    'Gnome Sort',
    'Stooge Sort',
    'Odd-Even Sort',
  ];

  // List of all distribution types
  const distributions: ElementDistribution[] = [
    'Random',
    'Ascending',
    'Descending',
    'Split Ascending',
    'Split Descending',
  ];

  // Handle algorithm change
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value as AlgorithmName);
    resetArray();
  };

  // Handle element count change from input field
  const handleNumElementsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedValue = e.target.value;
    setInputValue(typedValue); // Update local state immediately

    // Validate and update the actual numElements state only if valid
    const parsedValue = parseInt(typedValue);
    if (!isNaN(parsedValue) && parsedValue >= 10 && parsedValue <= 200) {
      setNumElements(parsedValue);
    } else if (typedValue === '') {
      // Allow empty field temporarily, maybe set a default or show error later
      // For now, we don't update numElements if empty
    }
  };

  // Handle blur event to validate or reset if input is left invalid
  const handleNumElementsBlur = () => {
    const parsedValue = parseInt(inputValue);
    if (isNaN(parsedValue) || parsedValue < 10 || parsedValue > 200) {
      // If invalid on blur, reset input field to the last valid numElements value
      setInputValue(numElements.toString());
    }
  };

  // Handle distribution change
  const handleDistributionChange = (distribution: ElementDistribution) => {
    setDistribution(distribution);
  };

  // Handle sound toggle
  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    
    // If enabling sound, try to trigger a user interaction to satisfy browser autoplay policy
    if (!soundEnabled) {
      // Create and immediately play a silent audio context to satisfy browser autoplay policy
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        gainNode.gain.value = 0.001; // Nearly silent
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          // Close the context after a short time
          setTimeout(() => audioContext.close(), 100);
        }, 10);
      } catch (error) {
        console.error('Failed to initialize temporary audio context:', error);
      }
    }
  };

  return (
    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Configuration</h2>
      
      {/* Algorithm Selection */}
      <div className="mb-6">
        <label htmlFor="algorithm" className="block text-sm font-medium mb-2">
          Choose Sorting Algorithm
        </label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={handleAlgorithmChange}
          disabled={isRunning}
          className="w-full p-2 border rounded-md bg-white"
        >
          {algorithms.map((algo) => (
            <option key={algo} value={algo}>
              {algo}
            </option>
          ))}
        </select>
      </div>
      
      {/* Number of Elements */}
      <div className="mb-6">
        <label htmlFor="numElements" className="block text-sm font-medium mb-2">
          Number of Elements
        </label>
        <input
          id="numElements"
          type="number"
          min={10}
          max={200}
          value={inputValue}
          onChange={handleNumElementsInputChange}
          onBlur={handleNumElementsBlur}
          disabled={isRunning}
          className="w-full p-2 border rounded-md"
          placeholder="10-200"
        />
        <div className="text-xs text-gray-500 mt-1">
          Enter a value between 10 and 200
        </div>
      </div>
      
      {/* Distribution of Elements */}
      <div className="mb-6">
        <span className="block text-sm font-medium mb-2">
          Distribution of Elements
        </span>
        <div className="space-y-2">
          {distributions.map((dist) => (
            <div key={dist} className="flex items-center">
              <input
                id={`dist-${dist}`}
                type="radio"
                name="distribution"
                checked={distribution === dist}
                onChange={() => handleDistributionChange(dist)}
                disabled={isRunning}
                className="mr-2"
              />
              <label htmlFor={`dist-${dist}`} className="text-sm">
                {dist}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sound Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Sound Settings</label>
        <div className="flex items-center">
          <input
            id="sound-toggle"
            type="checkbox"
            checked={soundEnabled}
            onChange={handleSoundToggle}
            className="mr-2 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="sound-toggle" className="text-sm flex items-center">
            Enable Sound
            {soundEnabled && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="mr-1 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Active
              </span>
            )}
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {soundEnabled 
            ? "Sound provides audio feedback during sorting. Click 'Start' to enable audio."
            : "Enable sound for audio feedback during sorting."}
        </p>
      </div>
    </div>
  );
};

export default ConfigPanel; 