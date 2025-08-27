# 💪 Workout Progress Tracker

A modern web application built with SvelteKit and Tailwind CSS to visualize your workout progression over time. The app reads workout data from a CSV file and provides interactive charts to track your fitness journey.

## Features

- 📊 **Interactive Charts**: Visualize your progress with beautiful line charts
- 🎯 **Multiple Metrics**: Track max weight, total volume, and average reps
- 🔍 **Filter by Workout Type**: Focus on specific workout routines
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Fast & Modern**: Built with SvelteKit for optimal performance

## Hosted Version

The app is hosted at [https://ryanmaxin.github.io/Workout-Graphs/](https://ryanmaxin.github.io/Workout-Graphs/).

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with date-fns adapter
- **Data Processing**: PapaParse for CSV parsing

## Usage

1. **Upload Your CSV File**: Begin by uploading your workout CSV file through the app interface.
2. **Pick an Exercise**: Select the exercise you want to track.
3. **Choose Chart Type**: View max weight, total volume, or average reps.
4. **Analyze Progress**: The chart shows your progression over time with key statistics.

## Data Format

The app expects a CSV file with the following columns:

- `Date`: Workout date and time
- `Workout Name`: Name of the workout routine
- `Duration`: Workout duration
- `Exercise Name`: Name of the exercise
- `Set Order`: Set number
- `Weight`: Weight used (in lbs)
- `Reps`: Number of repetitions
- `Distance`: Distance (if applicable)
- `Seconds`: Time duration (if applicable)
- `RPE`: Rate of perceived exertion

## Development

- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Check types**: `npm run check`

## License

MIT License - feel free to use this project for your own workout tracking needs!
