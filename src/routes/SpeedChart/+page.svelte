<script>
  import LengthChart from "./chartLength.svelte";
  import CountChart from "./chartCount.svelte";
  import Layout from "../../components/Layout.svelte";
</script>

<Layout>
  <main>
    <h1>Welcome to the Chart Page</h1>
  </main>

  <div class="chart-wrapper">
    <div class="chart-container">
      <h3>Total Length of Roads by MaxSpeed</h3>
      <LengthChart />
    </div>

    <div class="chart-container">
      <h3>Total Number of Roads by MaxSpeed</h3>
      <CountChart />
    </div>
  </div>
</Layout>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  .chart-wrapper {
    display: flex;
    justify-content: space-around;
  }

  .chart-container {
    flex: 1;
    display: flex;
    flex-direction: column; 
    align-items: center;
    margin: 10px;
  }

  .chart-container > h3 {
    margin-bottom: 20px;
  }
</style>
