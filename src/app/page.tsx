'use client';

import SortingVisualizer from '@/components/SortingVisualizer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Sorting Algorithm Visualizer</h1>
      <SortingVisualizer />
    </main>
  );
} 