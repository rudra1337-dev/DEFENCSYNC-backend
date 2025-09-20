import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    available: {
      type: Number,
      required: true,
      min: [0, "Available count cannot be negative"],
      default: 0,
    },
    photo: {
      type: String,
      required: [true, "Photo URL is required"],
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

const Weapon = mongoose.model("Weapon", itemSchema); // or "Vehicle" for vehicles
export default Weapon;