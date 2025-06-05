import mongoose from 'mongoose';

// Define the cart item schema
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
  productName: { type: String, required: true },
  mainPhotoUrl: { type: String }, // Main photo URL for the product
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', required: true }, // Reference to the Artisan model
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  itemSubtotal: { type: Number, required: true },
}, { _id: false });

// Define the cart schema
const cartSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, unique: true }, // Reference to the Client model
  items: [cartItemSchema], // Array of cart items
  estimatedTotalItemsPrice: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'lastModificationDate' } }); // Add timestamps for creation and last modification

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;