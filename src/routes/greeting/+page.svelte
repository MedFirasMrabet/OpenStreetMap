<script>
  import Layout from "../../components/Layout.svelte";
</script>



<Layout>
  <main class="greeting">
    <h1>Hello my name is Firas and I want to tell you :</h1>
    <p>
      Throughout my recent project, I embraced a variety of web technologies,
      showcasing my adaptability and eagerness to tackle complex challenges. My
      experience included integrating Mapbox GL JS with Svelte, effectively managing
      asynchronous functions and mastering conditional rendering. In the backend, I
      efficiently handled GeoJSON data using Node.js and MongoDB, and implemented
      caching strategies to optimize performance. My project also involved utilizing
      Chart.js for data visualization, demonstrating my ability to present complex
      data in an accessible manner. This journey significantly enhanced my skills
      and understanding of web applications. I am passionate about learning and
      committed to delivering high-quality work, qualities I believe are crucial in
      a startup environment. I look forward to contributing my skills and enthusiasm
      to your team, and to the opportunities for growth and innovation that a
      startup environment offers.
    </p>
  </main>
</Layout>

<style>
  .greeting {
    margin-top: 30px !important;
    text-align: center;
    padding: 2em;
    margin: auto;
    max-width: 800px; /* Adjust for a wider text area */
    background-color: #f3f3f3; /* Light background for the text area */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
    font-family: "Arial", sans-serif; /* Change as per preference */
  }

  .greeting h1 {
    color: #333; /* Dark color for the heading */
    margin-bottom: 1em;
  }

  .greeting p {
    font-size: 1.1em; /* Slightly larger text for better readability */
    line-height: 1.6; /* Improved line height for readability */
    color: #555; /* Slightly softer color than pure black */
  }
</style>
