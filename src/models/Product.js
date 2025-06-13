import mongoose from "mongoose";

// Define the review schema
const reviewSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    }, // Reference to the Client model
    clientName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
); // Add timestamps for review creation and updates

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artisan",
      required: true,
    }, // Reference to the Artisan model
    name: { type: String, required: true },
    description: { type: String, required: true },
    photoURLs: [{ type: String }], // Array of product photo URLs
    mainCategory: { type: String, required: true },
    subCategories: [{ type: String }],
    tags: [{ type: String }], // Array of tags for search and filtering
    stockQuantity: { type: Number, required: true, min: 0 },
    reviews: [reviewSchema], // Array of reviews
    averageRating: { type: Number, default: 0 }, // Average rating calculated from reviews
    salesCount: { type: Number, default: 0 }, // Number of times the product has been sold
  },
  { timestamps: { createdAt: "creationDate", updatedAt: "lastUpdate" } }
); // Add timestamps for creation and last update

const Product = mongoose.model("Product", productSchema);
export default Product;
