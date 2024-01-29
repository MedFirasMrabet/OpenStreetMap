# Ile-de-France Vehicule & Bicycle roads

## Introduction
This project analyzes road networks using OpenStreetMap data, MongoDB, Node.js, and SvelteKit. It demonstrates handling GeoJSON data, creating interactive maps with Mapbox, and visualizing data with Chart.js.

## Prerequisites
- Node.js
- MongoDB
- Osmium Tool

## Installation

1. **Cloning the Repository**:
   ```bash
   git clone https://github.com/MedFirasMrabet/OpenStreetMap.git
   cd OpenStreetMap


### 1. Data Preparation
   - Filter OpenStreetMap data using Osmium:
     ```bash
     osmium tags-filter yourfile.osm.pbf w/highway -o roads.osm.pbf
     ```
   - Convert to GeoJSON format:
     ```bash
     osmium export roads.osm.pbf -o roads.geojson
     ```

### 2. Backend Setup
   - Navigate to the `server` directory.
   - Install dependencies:
     ```bash
     cd server
     npm install
     ```
   - Set up environment variables as per the Environment Setup section.

### 3. Frontend Setup
   - Return to the project root directory.
   - Install frontend dependencies:
     ```bash
     cd ..
     npm install
     ```
   - Set up environment variables for the frontend.

### 4. Environment Setup
   - Create `.env` files in both `server` and root directories.
   - In `server/.env`, define your DB_URI and the PORT.
   - In the root `.env`, set frontend configurations BACK_API_URL and MAP_BOX_ACCESS_TOKEN.

### 5. Running the Application
   - Start the MongoDB service.
   - Run the Node.js server:
     ```bash
     cd server
     npm start
     ```
   - Run the SvelteKit application:
     ```bash
     cd ..
     npm run dev -o
     ```

## Usage
Navigate to `http://localhost:[port]` to view the application. Use the map to explore roads and their attributes, and view the charts for data insights.

## Acknowledgements
Thanks to the OpenStreetMap contributors and the SvelteKit community.
