# Sorting Algorithm Visualizer with Cursor AI
A web application built with Next.js and TypeScript to visualize how different sorting algorithms work.

## Blog Post
This repo is part of a blog post that can be found [here:](https://medium.com/@wjleon/the-new-google-firebase-studio-gave-me-vibes-of-2010-the-vibe-coding-battle-b568d51d4ed1)

## You can see and use the deployed app
[Click here to open the app](https://sorting-algorithms-cursor-ai.vercel.app/)

## Features

- Visualize 20+ different sorting algorithms
- Configure number of elements (10-200)
- Choose from different initial distributions
- Real-time metrics (comparisons and time)
- Audio feedback with enable/disable option
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (16.x or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sorting-visualizer.git
cd sorting-visualizer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Select a sorting algorithm from the dropdown menu
2. Adjust the number of elements (10-200)
3. Choose the initial distribution of the elements
4. Click "Start" to begin the visualization
5. Use "Pause" and "Reset" buttons to control the animation
6. Toggle audio feedback on/off as desired

### Troubleshooting

#### Animation Issues

If the animation is not working:

- Make sure your browser supports requestAnimationFrame and CSS transitions
- Try reducing the number of elements to 50 or less
- Ensure the browser tab is visible (animations pause when tab is not visible)
- Try disabling any browser extensions that might interfere with JavaScript execution
- Clear your browser cache and reload the page

#### Sound Issues

If sound is not working:

- Click on the "Start" button to trigger user interaction (needed for browser audio policies)
- Make sure your browser's sound is not muted
- Verify that the "Enable Sound" checkbox is checked
- Try using a different browser (Chrome is recommended)
- Some browsers require explicit user interaction before audio can play

## Implementation Details

### Visual Representation

- Each number in the array is represented by a vertical bar
- The height of each bar corresponds to its value
- Comparing elements are highlighted in yellow
- Swapping elements are highlighted in red
- Sorted array is displayed in green

### Sound Feedback

- The application uses the Web Audio API to generate tones
- Each comparison plays a tone with a frequency based on the element's value
- Higher values produce higher pitches

## Implemented Sorting Algorithms

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort

Additional algorithms are included as placeholders and can be fully implemented in the future.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Web Audio API (for sound generation)

## License

This project is open source and available under the [MIT License](LICENSE). 
