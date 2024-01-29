<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  let canvas: HTMLCanvasElement;
  let isLoading = true;
  onMount(async () => {
    const response = await fetch(
      `http://localhost:3001/road_counts_by_maxspeed`,
    );
    const speeds = ["20", "30", "50", "70", "80", "90", "110", "130"];
    const newData = await response.json();
    isLoading = false;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: speeds,
            datasets: [
              {
                label: "Total Number of Roads by MaxSpeed",
                data: speeds.map((e) => {
                  return newData[e];
                }),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }
  });
</script>

{#if isLoading}
  <div>Loading...</div>
{/if}
<div class="chart-container">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  canvas {
    width: 800px;
    height: 600px;
  }
</style>
