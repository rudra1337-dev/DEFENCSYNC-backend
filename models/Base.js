import mongoose from "mongoose";

const baseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Base name is required"],
      trim: true,
    },
    // changed: agency is now a string and restricted to Army, Navy, Airforce
    agency: {
      type: String,
      enum: {
        values: ["Army", "Navy", "Airforce"],
        message: "Agency must be one of: Army, Navy, Airforce",
      },
      required: [true, "Base must belong to an agency"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: [3, "Location must be at least 3 characters long"],
    },
    photo: {
      type: String,
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/, "Must be a valid image URL"],
    },
    availSoldiers: {
      type: Number,
      required: true,
      min: [0, "Available soldiers cannot be negative"],
      default: 0,
    },
    availMedkits: {
      type: Number,
      required: true,
      min: [0, "Available medkits cannot be negative"],
      default: 0,
    },
    weapons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Weapon",
      },
    ],
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
  },
  { timestamps: true }
);

const Base = mongoose.model("Base", baseSchema);
export default Base;