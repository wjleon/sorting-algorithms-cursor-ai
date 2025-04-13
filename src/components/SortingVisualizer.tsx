'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AlgorithmName,
  ElementDistribution,
  SortStep,
  generateArray,
  getSortingFunction,
} from '@/lib/sortingAlgorithms';
import { useAudio } from '@/lib/useAudio';
import ConfigPanel from '@/components/ConfigPanel';
import VisualizationPanel from '@/components/VisualizationPanel';

const SortingVisualizer: React.FC = () => {
  // State for configuration
  const [algorithm, setAlgorithm] = useState<AlgorithmName>('Bubble Sort');
  const [numElements, setNumElements] = useState<number>(30);
  const [distribution, setDistribution] = useState<ElementDistribution>('Random');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // State for visualization
  const [array, setArray] = useState<number[]>([]);
  const [visualSteps, setVisualSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [comparisons, setComparisons] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isSortingComplete, setIsSortingComplete] = useState<boolean>(false);
  
  // Refs
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepIndexRef = useRef<number>(0);
  const animationSpeedRef = useRef<number>(50);
  const isRunningRef = useRef<boolean>(false); // Ref to track running state
  const visualStepsRef = useRef<SortStep[]>([]); // Ref to track visual steps

  // Use the updated audio hook
  const { playSound, isAudioReady, ensureAudioContext } = useAudio();
  
  // Update refs when state changes
  useEffect(() => { currentStepIndexRef.current = currentStepIndex; }, [currentStepIndex]);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { visualStepsRef.current = visualSteps; }, [visualSteps]);

  // Initialize array
  useEffect(() => {
    resetArray();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numElements, distribution]);

  // Initialize audio on first render (and ensure context gets running)
  useEffect(() => {
    ensureAudioContext();
  }, [ensureAudioContext]);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);
  
  // Generate a new array
  const resetArray = useCallback(() => {
    console.log('Resetting array...');
    setIsRunning(false);
    setIsPaused(false);
    setIsSortingComplete(false);
    const newArray = generateArray(numElements, distribution);
    setArray(newArray);
    const initialSteps = [{ array: [...newArray] }];
    setVisualSteps(initialSteps);
    visualStepsRef.current = initialSteps;
    setCurrentStepIndex(0);
    currentStepIndexRef.current = 0;
    setComparisons(0);
    setTimeElapsed(0);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    timerRef.current = null;
    animationTimeoutRef.current = null;
    startTimeRef.current = null;
  }, [numElements, distribution]);
  
  // Start or resume sorting
  const startSorting = useCallback(() => {
    console.log('Start sorting triggered...');
    // Attempt to ensure audio context is ready when starting/resuming
    if (soundEnabled) ensureAudioContext(); 

    if (isSortingComplete) {
      resetArray();
      // Need a slight delay after reset before starting again
      setTimeout(() => {
        console.log('Restarting after reset...');
        const sortingFunction = getSortingFunction(algorithm);
        const result = sortingFunction(generateArray(numElements, distribution)); // Generate fresh array
        setArray(result.steps[0]?.array || []);
        setVisualSteps(result.steps);
        setComparisons(result.comparisons);
        setCurrentStepIndex(0);
        setIsRunning(true);
        setIsPaused(false);
        setIsSortingComplete(false);
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          if (startTimeRef.current) {
            setTimeElapsed((Date.now() - startTimeRef.current) / 1000);
          }
        }, 10);
        animateSort();
      }, 50); // 50ms delay
      return;
    }
    
    // Generate steps only if starting from scratch
    if (visualStepsRef.current.length <= 1 && !isPaused) {
      console.log('Generating sorting steps...');
      const sortingFunction = getSortingFunction(algorithm);
      const currentArray = array.length > 0 ? array : generateArray(numElements, distribution);
      const result = sortingFunction([...currentArray]);
      console.log(`Generated ${result.steps.length} steps.`);
      setArray(result.steps[0]?.array || []); // Start with the first step's array
      setVisualSteps(result.steps);
      setComparisons(result.comparisons);
      setCurrentStepIndex(0); // Ensure we start from step 0
    }

    setIsRunning(true);
    setIsPaused(false);
    
    // Start timer if not already running or resuming
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setTimeElapsed((Date.now() - startTimeRef.current) / 1000);
        }
      }, 10);
    } else if (isPaused) {
      // Adjust start time when resuming to not count paused time
      const pausedDuration = Date.now() - (startTimeRef.current + timeElapsed * 1000);
      startTimeRef.current += pausedDuration;
    }
    
    // Delay the start of animation slightly to allow state updates
    requestAnimationFrame(() => {
      animateSort();
    });

  }, [soundEnabled, ensureAudioContext, isSortingComplete, resetArray, algorithm, numElements, distribution, isPaused, array, timeElapsed]);
  
  // Pause sorting
  const pauseSorting = useCallback(() => {
    console.log('Pausing sorting...');
    setIsRunning(false);
    setIsPaused(true);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    animationTimeoutRef.current = null;
    timerRef.current = null; // Stop the timer as well
  }, []);
  
  // Reset sorting
  const resetSorting = useCallback(() => {
    console.log('Resetting sorting...');
    setIsRunning(false);
    setIsPaused(false);
    resetArray();
  }, [resetArray]);
  
  // Animate the sorting process
  const animateSort = useCallback(() => {
    if (!isRunningRef.current) {
      return;
    }

    const currentIdx = currentStepIndexRef.current;
    const steps = visualStepsRef.current;

    if (currentIdx >= steps.length - 1) {
      setIsRunning(false);
      setIsSortingComplete(true);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    
    const nextStepIndex = currentIdx + 1;
    const nextStep = steps[nextStepIndex];

    if (!nextStep) {
        console.error('Error: nextStep is undefined at index', nextStepIndex);
        setIsRunning(false);
        return;
    }

    setCurrentStepIndex(nextStepIndex);
    setArray(nextStep.array);
    
    // Play sound only if sound is enabled AND the audio context is ready
    if (soundEnabled && isAudioReady) { 
      if (nextStep.comparing && nextStep.comparing.length > 0) {
        playSound(nextStep.array[nextStep.comparing[0]], numElements);
      } else if (nextStep.swapping && nextStep.swapping.length > 0) {
        playSound(nextStep.array[nextStep.swapping[0]], numElements);
      }
    }
    
    const speed = calculateAnimationSpeed();
    animationSpeedRef.current = speed;

    animationTimeoutRef.current = setTimeout(() => {
      if (document.visibilityState === 'visible') {
        requestAnimationFrame(animateSort);
      } else {
        pauseSorting();
      }
    }, speed);

  }, [soundEnabled, isAudioReady, playSound, numElements, pauseSorting]);
  
  // Calculate animation speed (Adjusted for faster speed)
  const calculateAnimationSpeed = () => {
    const baseSpeed = 25; // Reduced base speed (was 50)
    // Speed factor scales less aggressively, making it faster overall
    const speedFactor = Math.max(0.4, 100 / numElements); 
    // Adjusted bounds (min 5ms, max 150ms)
    return Math.max(5, Math.min(baseSpeed * speedFactor, 150)); 
  };
  
  return (
    <div className="flex flex-col lg:flex-row w-full gap-8 min-h-[600px] p-4 bg-gray-100">
      <ConfigPanel
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        numElements={numElements}
        setNumElements={setNumElements}
        distribution={distribution}
        setDistribution={setDistribution}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        isRunning={isRunning}
        resetArray={resetSorting}
      />
      <VisualizationPanel
        array={array}
        currentStep={visualSteps[currentStepIndex]}
        algorithm={algorithm}
        numElements={numElements}
        comparisons={comparisons}
        timeElapsed={timeElapsed}
        isRunning={isRunning}
        isPaused={isPaused}
        isSortingComplete={isSortingComplete}
        startSorting={startSorting}
        pauseSorting={pauseSorting}
        resetSorting={resetSorting}
      />
    </div>
  );
};

export default SortingVisualizer;