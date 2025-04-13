export type AlgorithmName =
  | 'Bubble Sort'
  | 'Selection Sort'
  | 'Insertion Sort'
  | 'Merge Sort'
  | 'Quick Sort'
  | 'Heap Sort'
  | 'Counting Sort'
  | 'Radix Sort'
  | 'Bucket Sort'
  | 'Shell Sort'
  | 'Tim Sort'
  | 'Comb Sort'
  | 'Pigeonhole Sort'
  | 'Cycle Sort'
  | 'Strand Sort'
  | 'Bitonic Sort'
  | 'Pancake Sort'
  | 'Bogo Sort'
  | 'Gnome Sort'
  | 'Stooge Sort'
  | 'Odd-Even Sort';

export type ElementDistribution =
  | 'Random'
  | 'Ascending'
  | 'Descending'
  | 'Split Ascending'
  | 'Split Descending';

export interface SortStep {
  array: number[];
  comparing?: [number, number];
  swapping?: [number, number];
}

export interface SortingResult {
  sortedArray: number[];
  steps: SortStep[];
  comparisons: number;
}

// Helper function to create a visual step
function createStep(
  array: number[],
  comparing?: [number, number],
  swapping?: [number, number]
): SortStep {
  return {
    array: [...array],
    comparing,
    swapping,
  };
}

// Helper to generate arrays based on distribution
export function generateArray(
  size: number,
  distribution: ElementDistribution
): number[] {
  // Create array of 1 to size
  const array = Array.from({ length: size }, (_, i) => i + 1);
  
  switch (distribution) {
    case 'Random':
      return shuffleArray([...array]);
    case 'Ascending':
      return [...array];
    case 'Descending':
      return [...array].reverse();
    case 'Split Ascending':
      const halfSize = Math.floor(size / 2);
      return [...array.slice(halfSize), ...array.slice(0, halfSize)];
    case 'Split Descending':
      const halfSizeDesc = Math.floor(size / 2);
      return [
        ...array.slice(halfSizeDesc).reverse(),
        ...array.slice(0, halfSizeDesc).reverse(),
      ];
    default:
      return shuffleArray([...array]);
  }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Bubble Sort
export function bubbleSort(array: number[]): SortingResult {
  const steps: SortStep[] = [];
  let comparisons = 0;
  const arr = [...array];
  
  steps.push(createStep(arr));
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push(createStep(arr, [j, j + 1]));
      comparisons++;
      
      if (arr[j] > arr[j + 1]) {
        steps.push(createStep(arr, undefined, [j, j + 1]));
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push(createStep(arr));
      }
    }
  }
  
  return {
    sortedArray: arr,
    steps,
    comparisons,
  };
}

// Selection Sort
export function selectionSort(array: number[]): SortingResult {
  const steps: SortStep[] = [];
  let comparisons = 0;
  const arr = [...array];
  
  steps.push(createStep(arr));
  
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < arr.length; j++) {
      steps.push(createStep(arr, [minIndex, j]));
      comparisons++;
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      steps.push(createStep(arr, undefined, [i, minIndex]));
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      steps.push(createStep(arr));
    }
  }
  
  return {
    sortedArray: arr,
    steps,
    comparisons,
  };
}

// Insertion Sort
export function insertionSort(array: number[]): SortingResult {
  const steps: SortStep[] = [];
  let comparisons = 0;
  const arr = [...array];
  
  steps.push(createStep(arr));
  
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0) {
      steps.push(createStep(arr, [j, i]));
      comparisons++;
      
      if (arr[j] > key) {
        steps.push(createStep(arr, undefined, [j, j + 1]));
        arr[j + 1] = arr[j];
        steps.push(createStep(arr));
        j--;
      } else {
        break;
      }
    }
    
    if (j + 1 !== i) {
      arr[j + 1] = key;
      steps.push(createStep(arr));
    }
  }
  
  return {
    sortedArray: arr,
    steps,
    comparisons,
  };
}

// Merge Sort
export function mergeSort(array: number[]): SortingResult {
  const steps: SortStep[] = [];
  let comparisons = 0;
  const arr = [...array];
  
  steps.push(createStep(arr));
  
  const merge = (left: number, mid: number, right: number) => {
    const leftSize = mid - left + 1;
    const rightSize = right - mid;
    
    const leftArray = new Array(leftSize);
    const rightArray = new Array(rightSize);
    
    for (let i = 0; i < leftSize; i++) {
      leftArray[i] = arr[left + i];
    }
    
    for (let i = 0; i < rightSize; i++) {
      rightArray[i] = arr[mid + 1 + i];
    }
    
    let i = 0, j = 0, k = left;
    
    while (i < leftSize && j < rightSize) {
      steps.push(createStep(arr, [left + i, mid + 1 + j]));
      comparisons++;
      
      if (leftArray[i] <= rightArray[j]) {
        steps.push(createStep(arr, undefined, [k, left + i]));
        arr[k] = leftArray[i];
        i++;
      } else {
        steps.push(createStep(arr, undefined, [k, mid + 1 + j]));
        arr[k] = rightArray[j];
        j++;
      }
      
      steps.push(createStep(arr));
      k++;
    }
    
    while (i < leftSize) {
      steps.push(createStep(arr, undefined, [k, left + i]));
      arr[k] = leftArray[i];
      steps.push(createStep(arr));
      i++;
      k++;
    }
    
    while (j < rightSize) {
      steps.push(createStep(arr, undefined, [k, mid + 1 + j]));
      arr[k] = rightArray[j];
      steps.push(createStep(arr));
      j++;
      k++;
    }
  };
  
  const mergeSortHelper = (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor(left + (right - left) / 2);
      
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      
      merge(left, mid, right);
    }
  };
  
  mergeSortHelper(0, arr.length - 1);
  
  return {
    sortedArray: arr,
    steps,
    comparisons,
  };
}

// Quick Sort
export function quickSort(array: number[]): SortingResult {
  const steps: SortStep[] = [];
  let comparisons = 0;
  const arr = [...array];
  
  steps.push(createStep(arr));
  
  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      steps.push(createStep(arr, [j, high]));
      comparisons++;
      
      if (arr[j] < pivot) {
        i++;
        steps.push(createStep(arr, undefined, [i, j]));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push(createStep(arr));
      }
    }
    
    steps.push(createStep(arr, undefined, [i + 1, high]));
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push(createStep(arr));
    
    return i + 1;
  };
  
  const quickSortHelper = (low: number, high: number) => {
    if (low < high) {
      const pivotIndex = partition(low, high);
      
      quickSortHelper(low, pivotIndex - 1);
      quickSortHelper(pivotIndex + 1, high);
    }
  };
  
  quickSortHelper(0, arr.length - 1);
  
  return {
    sortedArray: arr,
    steps,
    comparisons,
  };
}

// Heap Sort
export function heapSort(array: number[]): SortingResult {
  const steps: SortStep[] = [];
  let comparisons = 0;
  const arr = [...array];
  
  steps.push(createStep(arr));
  
  const heapify = (n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n) {
      steps.push(createStep(arr, [largest, left]));
      comparisons++;
      
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
    
    if (right < n) {
      steps.push(createStep(arr, [largest, right]));
      comparisons++;
      
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }
    
    if (largest !== i) {
      steps.push(createStep(arr, undefined, [i, largest]));
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push(createStep(arr));
      
      heapify(n, largest);
    }
  };
  
  // Build heap
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr.length, i);
  }
  
  // Extract elements from heap
  for (let i = arr.length - 1; i > 0; i--) {
    steps.push(createStep(arr, undefined, [0, i]));
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push(createStep(arr));
    
    heapify(i, 0);
  }
  
  return {
    sortedArray: arr,
    steps,
    comparisons,
  };
}

// Get sorting function by algorithm name
export function getSortingFunction(algorithmName: AlgorithmName) {
  const sortingFunctions: Record<AlgorithmName, (arr: number[]) => SortingResult> = {
    'Bubble Sort': bubbleSort,
    'Selection Sort': selectionSort,
    'Insertion Sort': insertionSort,
    'Merge Sort': mergeSort,
    'Quick Sort': quickSort,
    'Heap Sort': heapSort,
    'Counting Sort': bubbleSort, // Placeholder
    'Radix Sort': bubbleSort, // Placeholder
    'Bucket Sort': bubbleSort, // Placeholder
    'Shell Sort': bubbleSort, // Placeholder
    'Tim Sort': bubbleSort, // Placeholder
    'Comb Sort': bubbleSort, // Placeholder
    'Pigeonhole Sort': bubbleSort, // Placeholder
    'Cycle Sort': bubbleSort, // Placeholder
    'Strand Sort': bubbleSort, // Placeholder
    'Bitonic Sort': bubbleSort, // Placeholder
    'Pancake Sort': bubbleSort, // Placeholder
    'Bogo Sort': bubbleSort, // Placeholder
    'Gnome Sort': bubbleSort, // Placeholder
    'Stooge Sort': bubbleSort, // Placeholder
    'Odd-Even Sort': bubbleSort, // Placeholder
  };
  
  return sortingFunctions[algorithmName];
} 