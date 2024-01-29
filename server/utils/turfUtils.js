const turf = require('@turf/turf');

function calculateRoadLengthsBySpeed(roadSegments) {
  let roadLengthsBySpeed = {};

  roadSegments.forEach(segment => {
    const line = turf.lineString(segment.geometry.coordinates);
    const length = turf.length(line, { units: 'kilometers' });
    const maxspeed = segment.properties.maxspeed;

    roadLengthsBySpeed[maxspeed] = (roadLengthsBySpeed[maxspeed] || 0) + length;
  });

  return roadLengthsBySpeed;
}

module.exports = {
  calculateRoadLengthsBySpeed,
};
