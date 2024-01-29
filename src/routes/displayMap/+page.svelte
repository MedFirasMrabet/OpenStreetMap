<script lang="ts">
  import { onMount } from "svelte";
  import mapboxgl, { type Offset } from "mapbox-gl";
  import Layout from "../../components/Layout.svelte";

  mapboxgl.accessToken = 'pk.eyJ1Ijoib29vb3Zvb29vIiwiYSI6ImNscm1kb2hmcDB1Y28yaWs0OW80cno1a2wifQ.u-1t2gFKBf20IBPxUaJv0A';
  let map: mapboxgl.Map;
  let maxspeed = 20;
  let streetName: string = "Street Name";
  let bicycleRoads = false;

  function getColorByMaxSpeed(maxspeed: number): string {
    if (maxspeed > 0 && maxspeed <= 30) {
      return "#000000";
    } else if (maxspeed > 30 && maxspeed <= 50) {
      return "#00ff00";
    } else if (maxspeed > 50 && maxspeed <= 90) {
      return "#0000ff";
    } else {
      return "#ff0000"; // Default color for speeds over 90 or unspecified
    }
  }

  // Function to update the map layer
  async function updateMapLayer(): Promise<void> {
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ].join(",");

    try {
      let url: string = "";
      let color = getColorByMaxSpeed(maxspeed);
      url = `http://localhost:3001`;

      if (bicycleRoads) {
        url += `/bicycle_roads?bbox=${bbox}`;
        color = "orange";
      } else {
        url += `/roads_by_maxspeed?bbox=${bbox}&zoom=${zoom}&maxspeed=${maxspeed}`;
      }
      const response = await fetch(url);
      const newData = await response.json();

      const source = map.getSource(
        "my-geojson-layer",
      ) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(newData);
        if (map.getLayer("lines-layer")) {
          map.setPaintProperty("lines-layer", "line-color", color);
        }
      } else {
        map.addSource("my-geojson-layer", { type: "geojson", data: newData });
        map.addLayer({
          id: "lines-layer",
          type: "line",
          source: "my-geojson-layer",
          layout: {},
          paint: { "line-color": color, "line-width": 2 },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  onMount(() => {
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [2.3522, 48.8566],
      zoom: 13,
    });
    map.on("load", updateMapLayer);
    map.on("moveend", updateMapLayer);
    map.on("click", "lines-layer", (e) => handleFeatureClick(e));
  });

  // Handle speed range changes
  function handleSpeedChange(event: Event) {
    const input = event.target as HTMLInputElement;
    maxspeed = parseInt(input.value);
    bicycleRoads = false;
    updateMapLayer();
  }
  // Handle speed range changes
  function handleBicycleRoads(event: Event) {
    bicycleRoads = true;
    updateMapLayer();
  }

  // Handle feature click events
  async function handleFeatureClick(e: mapboxgl.MapLayerMouseEvent) {
    if (e.features?.length) {
      const properties = e.features[0].properties as Record<string, any>;
      displayProperties(properties, "info");
    }
  }
  // Display feature properties
  function displayProperties(obj: Record<string, any>, containerId: string) {
    const container = document.getElementById(containerId);
    if (container) {
      streetName = obj.name;
      container.innerHTML = "";
      delete obj.name;
      delete obj.maxspeed;

      Object.entries(obj).forEach(([key, value]) => {
        const element = document.createElement("div");
        element.classList.add("property");
        element.textContent = `${key}: ${value}`;
        container.appendChild(element);
      });
    }
  }
</script>

<Layout>
  <div id="container">
    <section id="map">
      <!-- <div id="map"></div> -->
      <div class="button-container">
        <div class="speed-control">
          <input
            type="range"
            min="10"
            max="130"
            step="10"
            bind:value={maxspeed}
            on:input={handleSpeedChange}
          />
          <div class="speed-display">Max Speed: {maxspeed} km/h</div>
        </div>
        <button class="bicycle-button" on:click={handleBicycleRoads}
          >bicycle &ensp;
          <i class="fas fa-bicycle"></i>
        </button>
      </div>
    </section>
    <aside id="sidebar">
      <div class="speed-sign">
        {#if bicycleRoads}
          <div class="speed-value"><i class="fas fa-bicycle"></i></div>
        {:else if !bicycleRoads}
          <div class="speed-value">{maxspeed}</div>
        {/if}
      </div>
      <div class="street-sign">
        <span class="street-name">{streetName}</span>
      </div>
      <div id="info">Road details will appear here</div>
      <div id="legend">
        <h3>Speed Legend</h3>
        {#if !bicycleRoads}
          <div>
            <span
              style="height: 20px; width: 20px; background-color: #000000; display: inline-block; margin-right: 5px;"
            ></span>
            0 - 30 km/h
          </div>
          <div>
            <span
              style="height: 20px; width: 20px; background-color: #00ff00; display: inline-block; margin-right: 5px;"
            ></span>
            30 - 50 km/h
          </div>
          <div>
            <span
              style="height: 20px; width: 20px; background-color: #0000ff; display: inline-block; margin-right: 5px;"
            ></span>
            50 - 90 km/h
          </div>
          <div>
            <span
              style="height: 20px; width: 20px; background-color: #ff0000; display: inline-block; margin-right: 5px;"
            ></span>
            Greater than 90 km/h
          </div>
        {:else if bicycleRoads}
          <div>
            <span
              style="height: 20px; width: 20px; background-color: orange; display: inline-block; margin-right: 5px;"
            ></span>
            <i class="fas fa-bicycle"></i> Road
          </div>
        {/if}
      </div>
    </aside>
  </div>
</Layout>

<style>
  .button-container {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 1;
    display: flex; /* Add this to align items in a row */
    align-items: center; /* Aligns items vertically in the center */
  }

  .bicycle-button {
    background: rgba(255, 255, 255, 0.9);
    opacity: 80%;
    padding: 10px;
    height: 75px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: none;
    cursor: pointer;
    display: flex; /* To align icon and text */
    align-items: center; /* Center items vertically */
    margin-left: 10px;
  }

  .bicycle-button i {
    font-size: 20px;
    color: #333;
    margin-right: 5px; /* Space between icon and text */
  }
  #legend {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    margin: 30px;
  }

  .speed-sign {
    width: 120px;
    height: 120px;
    background-color: white;
    border: 25px solid red;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    margin-top: 20px;
  }

  .speed-value {
    color: black;
    font-size: 50px;
    font-weight: bold;
  }

  .street-sign {
    width: 300px;
    height: 100px;
    background-color: #004f00;
    border: solid 6px white;
    border-radius: 8px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;
  }

  .street-sign:before {
    content: "";
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border: solid 2px #00b300;
    border-radius: 10px;
    pointer-events: none;
  }

  .street-name {
    width: 300px;
    color: white;
    font-size: 32px;
    font-weight: bold;
    padding: 10px 20px;
  }

  #container {
    display: flex;
  }

  #info {
    width: 300px;
    background-color: #f8f8f8;
    padding: 10px;
    margin: 30px;
  }

  #map {
    flex-grow: 1;
    height: 100vh;
  }

  .speed-control {
    background: rgba(255, 255, 255, 0.9);
    opacity: 80%;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .speed-display {
    padding: 5px 10px;
    background: #f8f9fa;
    margin-top: 10px;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    color: #495057;
    font-size: 16px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background: #ddd;
    outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #333;
    cursor: pointer;
  }

  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #333;
    cursor: pointer;
  }

  .property {
    background: #fff;
    border: 1px solid #ddd;
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    font-size: 14px;
  }

  #info {
    background: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }

  .mapboxgl-ctrl mapboxgl-ctrl-attrib {
    display: none;
  }
</style>
