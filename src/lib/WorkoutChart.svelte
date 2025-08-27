<script lang="ts">
  import { Chart, registerables } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  import { onDestroy } from 'svelte';
  import type { ExerciseProgression } from './types';

  Chart.register(...registerables);

  export let progression: ExerciseProgression;
  export let chartType: 'weight' | 'volume' | 'reps' = 'weight';

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  $: if (progression && canvas) {
    updateChart();
  }

  function updateChart() {
    if (chart) {
      chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = progression.data.map(d => d.date);
    const data = progression.data.map(d => {
      switch (chartType) {
        case 'weight':
          return d.maxWeight;
        case 'volume':
          return d.totalVolume;
        case 'reps':
          return d.avgReps;
        default:
          return d.maxWeight;
      }
    });

    const chartTitle = {
      weight: 'Max Weight (lbs)',
      volume: 'Total Volume (lbs)',
      reps: 'Average Reps'
    }[chartType];

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: chartTitle,
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${progression.exerciseName} - ${chartTitle}`,
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#374151'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM dd'
              }
            },
            title: {
              display: true,
              text: 'Date',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: chartTitle,
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBackgroundColor: 'rgb(59, 130, 246)',
            hoverBorderColor: '#fff'
          }
        }
      }
    });
  }

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="relative h-96 w-full">
  <canvas bind:this={canvas}></canvas>
</div>
