<script lang="ts">
  import type { ExerciseProgression, ProcessedWorkoutData, WorkoutEntry } from '$lib/types';
  import WorkoutChart from '$lib/WorkoutChart.svelte';
  import {
    getExerciseProgression,
    getExercises,
    loadWorkoutData,
    processWorkoutData
  } from '$lib/workoutData';
  import { onMount } from 'svelte';

  let workoutData: WorkoutEntry[] = [];
  let processedData: ProcessedWorkoutData[] = [];
  let exercises: string[] = [];
  let selectedExercise = '';
  let selectedChartType: 'weight' | 'volume' | 'reps' | '1rm' = '1rm';
  let currentProgression: ExerciseProgression | null = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      loading = true;
      workoutData = await loadWorkoutData();
      
      if (workoutData.length === 0) {
        error = 'No workout data found';
        return;
      }
      
      processedData = processWorkoutData(workoutData);
      exercises = getExercises(workoutData);
      
      if (exercises.length > 0) {
        selectedExercise = exercises[0];
        updateProgression();
      }
    } catch (err) {
      console.error("Error in onMount:", err);
      error = 'Failed to load workout data';
    } finally {
      loading = false;
    }
  });

  function updateProgression() {
    if (selectedExercise) {
      currentProgression = getExerciseProgression(processedData, selectedExercise);
    }
  }

  $: if (selectedExercise) {
    updateProgression();
  }
</script>

<svelte:head>
  <title>Workout Progress Tracker</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <header class="text-center mb-12">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 md:p-12 mb-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">💪 Workout Progress Tracker</h1>
        <p class="text-xl opacity-90">Visualize your fitness journey and track your progress over time</p>
      </div>
    </header>

    {#if loading}
      <div class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-lg text-gray-600">Loading your workout data...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-700 font-medium">{error}</p>
      </div>
    {:else}
      <!-- Controls -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label for="exercise" class="block text-sm font-semibold text-gray-700">
              Exercise:
            </label>
            <select 
              id="exercise" 
              bind:value={selectedExercise}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {#each exercises as exercise}
                <option value={exercise}>{exercise}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-2">
            <label for="chart-type" class="block text-sm font-semibold text-gray-700">
              Chart Type:
            </label>
            <select 
              id="chart-type" 
              bind:value={selectedChartType}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="1rm">Estimated 1RM</option>
              <option value="weight">Max Weight</option>
              <option value="volume">Total Volume</option>
              <option value="reps">Average Reps</option>
            </select>
          </div>
        </div>
      </div>

      {#if currentProgression && currentProgression.data.length > 0}
        <!-- Chart Section -->
        <div class="space-y-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <WorkoutChart progression={currentProgression} chartType={selectedChartType} />
          </div>
          
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Total Sessions
              </h3>
              <p class="text-3xl font-bold text-gray-900">{currentProgression.data.length}</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Best {selectedChartType === 'weight' ? 'Weight' : selectedChartType === 'volume' ? 'Volume' : selectedChartType === '1rm' ? '1RM' : 'Reps'}
              </h3>
              <p class="text-3xl font-bold text-gray-900">
                {selectedChartType === 'weight' 
                  ? Math.max(...currentProgression.data.map(d => d.maxWeight)).toFixed(1) + ' lbs'
                  : selectedChartType === 'volume'
                  ? Math.max(...currentProgression.data.map(d => d.totalVolume)).toFixed(0) + ' lbs'
                  : selectedChartType === '1rm'
                  ? Math.max(...currentProgression.data.map(d => d.estimated1RM)).toFixed(1) + ' lbs'
                  : Math.max(...currentProgression.data.map(d => d.avgReps)).toFixed(1)
                }
              </p>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Progress Period
              </h3>
              <p class="text-lg font-semibold text-gray-900">
                {new Date(Math.min(...currentProgression.data.map(d => d.date.getTime()))).toLocaleDateString()} - 
                {new Date(Math.max(...currentProgression.data.map(d => d.date.getTime()))).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      {:else if selectedExercise}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p class="text-lg text-gray-600">No data available for {selectedExercise}</p>
        </div>
      {/if}
    {/if}
  </div>
</main>
