const mongoose = require('mongoose');
const { Schema } = mongoose;

const GeoJSONFeatureSchema = new Schema({
  type: { type: String, required: true },
  geometry: {
    type: { type: String, required: true },
    coordinates: { type: [[Number]], required: true }
  },
  properties: Schema.Types.Mixed
});

GeoJSONFeatureSchema.index({ geometry: '2dsphere' });
GeoJSONFeatureSchema.index({ "geometry.coordinates": "2dsphere" });

const GeoJSONFeature = mongoose.model('GeoJSONFeature', GeoJSONFeatureSchema);

module.exports = GeoJSONFeature;
