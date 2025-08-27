<script lang="ts">
  import type { ExerciseProgression, ProcessedWorkoutData, WorkoutEntry } from '$lib/types';
  import WorkoutChart from '$lib/WorkoutChart.svelte';
  import {
    getExerciseProgression,
    getExercises,
    loadWorkoutData,
    parseCSVData,
    processWorkoutData
  } from '$lib/workoutData';
  import { onMount } from 'svelte';

  let workoutData: WorkoutEntry[] = [];
  let processedData: ProcessedWorkoutData[] = [];
  let exercises: string[] = [];
  let selectedExercise = '';
  let selectedChartType: 'weight' | 'volume' | 'reps' | '1rm' = '1rm';
  let currentProgression: ExerciseProgression | null = null;
  let loading = false;
  let error = '';
  let fileInput: HTMLInputElement;
  let hasData = false;

  onMount(async () => {
    try {
      loading = true;
      workoutData = await loadWorkoutData();
      
      if (workoutData.length > 0) {
        hasData = true;
        processedData = processWorkoutData(workoutData);
        exercises = getExercises(workoutData);
        
        if (exercises.length > 0) {
          selectedExercise = exercises[0];
          updateProgression();
        }
      }
    } catch (err) {
      console.error("Error in onMount:", err);
      // Don't set error here, just show upload interface
    } finally {
      loading = false;
    }
  });

  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      error = 'Please select a CSV file';
      return;
    }
    
    try {
      loading = true;
      error = '';
      
      const text = await file.text();
      workoutData = parseCSVData(text);
      
      if (workoutData.length === 0) {
        error = 'No valid workout data found in the CSV file';
        return;
      }
      
      hasData = true;
      processedData = processWorkoutData(workoutData);
      exercises = getExercises(workoutData);
      
      if (exercises.length > 0) {
        selectedExercise = exercises[0];
        updateProgression();
      }
    } catch (err) {
      console.error("Error processing CSV:", err);
      error = 'Failed to process the CSV file. Please check the file format.';
    } finally {
      loading = false;
    }
  }

  function updateProgression() {
    if (selectedExercise) {
      currentProgression = getExerciseProgression(processedData, selectedExercise);
    }
  }

  function resetData() {
    workoutData = [];
    processedData = [];
    exercises = [];
    selectedExercise = '';
    currentProgression = null;
    hasData = false;
    error = '';
    if (fileInput) {
      fileInput.value = '';
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
        <p class="text-lg text-gray-600">Processing your workout data...</p>
      </div>
    {:else if !hasData}
      <!-- File Upload Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
        <div class="max-w-md mx-auto">
          <div class="mb-6">
            <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Upload Your Workout Data</h2>
            <p class="text-gray-600 mb-6">Upload a CSV file exported from the Strong app to visualize your workout progress</p>
          </div>
          
          <div class="space-y-4">
            <input
              bind:this={fileInput}
              type="file"
              accept=".csv"
              on:change={handleFileUpload}
              class="hidden"
              id="csv-upload"
            />
            <label
              for="csv-upload"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Choose CSV File
            </label>
            
            {#if error}
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-700 text-sm">{error}</p>
              </div>
            {/if}
            
            <div class="text-sm text-gray-500">
              <p class="mb-2">Expected CSV format from Strong app:</p>
              <ul class="text-left space-y-1">
                <li>• Date, Workout Name, Exercise Name</li>
                <li>• Set Order, Weight, Reps</li>
                <li>• Distance, Seconds (for cardio)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-700 font-medium">{error}</p>
      </div>
    {:else}
      <!-- Controls -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Chart Controls</h2>
          <button
            on:click={resetData}
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Upload New File
          </button>
        </div>
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
