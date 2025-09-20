import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    baseNameTo: {
      type: String,
      required: [true, "Destination base name is required"],
      trim: true,
      minlength: [2, "Base name must be at least 2 characters long"],
    },
    agencyNameTo: {
      type: String,
      required: [true, "Destination agency name is required"],
      trim: true,
      minlength: [2, "Agency name must be at least 2 characters long"],
    },
    baseNameFrom: {
      type: String,
      required: [true, "Source base name is required"],
      trim: true,
      minlength: [2, "Base name must be at least 2 characters long"],
    },
    agencyNameFrom: {
      type: String,
      required: [true, "Source agency name is required"],
      trim: true,
      minlength: [2, "Agency name must be at least 2 characters long"],
    },
    locationFrom: {
      type: String,
      required: [true, "Source location is required"],
      trim: true,
      minlength: [3, "Location must be at least 3 characters long"],
    },
    reason: {
      type: String,
      required: [true, "Reason for request is required"],
      trim: true,
      minlength: [5, "Reason must be at least 5 characters long"],
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },
    requiredWeapons: {
      type: Map,
      of: {
        type: Number,
        min: [1, "Weapon units must be at least 1"],
        max: [10000, "Weapon units cannot exceed 10,000"],
      },
      default: {},
    },
    requiredVehicles: {
      type: Map,
      of: {
        type: Number,
        min: [1, "Vehicle units must be at least 1"],
        max: [10000, "Vehicle units cannot exceed 10,000"],
      },
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Optional: custom validation to ensure at least one of weapons or vehicles exists
requestSchema.pre("validate", function (next) {
  if (
    (!this.requiredWeapons || this.requiredWeapons.size === 0) &&
    (!this.requiredVehicles || this.requiredVehicles.size === 0)
  ) {
    // It's ok, both empty → optional
    next();
  } else {
    next();
  }
});

const Request = mongoose.model("Request", requestSchema);
export default Request;