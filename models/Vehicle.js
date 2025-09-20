import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
      minlength: [2, "Vehicle name must be at least 2 characters long"],
    },
    available: {
      type: Number,
      required: true,
      min: [0, "Available vehicles cannot be negative"],
      default: 0,
    },
    photo: {
      type: String,
      required: [true, "Vehicle photo URL is required"],
      validate: {
        validator: function (v) {
          // ✅ Allow http/https URLs ending with image extensions, optionally with query string
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v);
        },
        message: "Must be a valid image URL",
      },
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;