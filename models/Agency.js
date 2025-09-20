import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Agency name is required"],
      trim: true,
      minlength: [3, "Agency name must be at least 3 characters long"],
      maxlength: [100, "Agency name cannot exceed 100 characters"],
      unique: true,
    },
    slogan: {
      type: String,
      trim: true,
      maxlength: [200, "Slogan cannot exceed 200 characters"],
    },
    backgroundImg: {
      type: String,
      required: [true, "Background image URL is required"],
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/, "Must be a valid image URL"],
    },
    flagImg: {
      type: String,
      required: [true, "Flag image URL is required"],
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/, "Must be a valid image URL"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    bases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Base",
      },
    ],
  },
  { timestamps: true }
);

const Agency = mongoose.model("Agency", agencySchema);
export default Agency;