'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  // State to track if the context has been successfully initialized by user interaction
  const [isContextReady, setIsContextReady] = useState<boolean>(false);

  // Function to attempt initializing or resuming the AudioContext
  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      try {
        console.log('Attempting to create new AudioContext...');
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Check state immediately after creation
        console.log(`AudioContext created. Initial state: ${audioContextRef.current.state}`);
        // Add state change listener
        audioContextRef.current.onstatechange = () => {
          console.log(`AudioContext state changed to: ${audioContextRef.current?.state}`);
          if (audioContextRef.current?.state === 'running') {
            setIsContextReady(true);
          }
        };
        // If already running (some browsers might auto-start), set ready
        if (audioContextRef.current.state === 'running') {
          setIsContextReady(true);
        }
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
        return false;
      }
    }

    // If context exists but is suspended, try to resume it
    if (audioContextRef.current.state === 'suspended') {
      console.log('AudioContext suspended. Attempting to resume...');
      try {
        await audioContextRef.current.resume();
        console.log('AudioContext resumed successfully.');
        setIsContextReady(true);
        return true;
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
        setIsContextReady(false); // Ensure state reflects failure
        return false;
      }
    }

    // If context is running, we are ready
    if (audioContextRef.current.state === 'running') {
      // console.log('AudioContext is running.');
      setIsContextReady(true);
      return true;
    }

    // If closed or in an unknown state, something is wrong
    console.warn(`AudioContext is in an unexpected state: ${audioContextRef.current.state}`);
    setIsContextReady(false);
    return false;
  }, []);

  // Effect to add interaction listeners
  useEffect(() => {
    const handleInteraction = () => {
      console.log('User interaction detected, ensuring audio context...');
      ensureAudioContext();
      // Clean up listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    // Add listeners for common interactions
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      // Clean up listeners
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);

      // Clean up AudioContext
      if (audioContextRef.current) {
        console.log('Closing AudioContext.');
        audioContextRef.current.close().catch(err => {
          console.error('Error closing audio context:', err);
        });
        audioContextRef.current = null; // Clear ref
      }
    };
  }, [ensureAudioContext]);

  // Function to play a single tone
  const playTone = useCallback((frequency: number, duration: number = 0.05) => {
    // Only play if context is ready and running
    if (!audioContextRef.current || audioContextRef.current.state !== 'running') {
      // console.warn('AudioContext not ready or not running, skipping tone.');
      return;
    }

    try {
      const context = audioContextRef.current;
      const currentTime = context.currentTime;

      // Create oscillator and gain nodes
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.type = 'sine'; // Simple sine wave
      oscillator.frequency.setValueAtTime(frequency, currentTime);
      
      // Start with low volume and ramp up slightly for softer sound
      gainNode.gain.setValueAtTime(0.001, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.01); // Quick ramp up
      
      oscillator.start(currentTime);
      
      // Schedule fade out and stop
      gainNode.gain.linearRampToValueAtTime(0.001, currentTime + duration * 0.9); // Start fade before end
      oscillator.stop(currentTime + duration);

      // Disconnect nodes after stop to allow garbage collection
      oscillator.onended = () => {
        try {
          oscillator.disconnect();
          gainNode.disconnect();
        } catch (e) { /* Ignore errors if already disconnected */ }
      };

    } catch (error) {
      console.error('Error playing tone:', error);
    }
  }, []); // No dependency on isContextReady here, check is done inside

  // Function to play sound based on array value
  const playSound = useCallback((value: number, max: number) => {
    if (!isContextReady) {
        // console.log("Context not ready, attempting to ensure...");
        ensureAudioContext(); // Try to resume/start if needed
        return; // Don't play sound this time, wait for context ready
    }
    // Map array value to frequency (e.g., 200Hz to 1000Hz)
    const minFreq = 200;
    const maxFreq = 1000;
    const normalizedValue = Math.max(0, Math.min(1, (value - 1) / (max - 1 || 1))); // Normalize 0-1
    const frequency = minFreq + normalizedValue * (maxFreq - minFreq);
    
    playTone(frequency, 0.05); // Shorter duration for sorting sounds
  }, [isContextReady, playTone, ensureAudioContext]); // Added ensureAudioContext

  // Return necessary functions and state
  return { playSound, isAudioReady: isContextReady, ensureAudioContext };
} 