import mongoose from "mongoose";

// Define the cart item schema
const cartItemSchema = new mongoose.Schema(
  {
    productId: { // Reference to the Product model
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    mainPhotoUrl: { type: String }, // Main photo URL for the product
    artisanId: { // Reference to the Artisan model
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artisan",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    itemSubtotal: { type: Number, required: true },
  },
  { _id: false }
);

// Define the cart schema
const cartSchema = new mongoose.Schema(
  {
    clientId: { // Reference to the Client model
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      unique: true,
    },
    items: [cartItemSchema], // Array of cart items
    estimatedTotalItemsPrice: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: "creationDate",
      updatedAt: "lastModificationDate",
    },
  }
); // Add timestamps for creation and last modification

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
