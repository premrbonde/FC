const mongoose = require('mongoose');

const DeliverySettingsSchema = new mongoose.Schema(
  {
    baseCharge: {
      type: Number,
      required: true,
      default: 50.0,
    },
    freeDeliveryThreshold: {
      type: Number,
      required: true,
      default: 500.0,
    },
    chargePerKm: {
      type: Number,
      required: true,
      default: 5.0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DeliverySettings', DeliverySettingsSchema);
