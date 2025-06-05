import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


// Define the address schema
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  type: { type: String, enum: ['Residencial', 'Comercial'], default: 'Residencial' },
  reference: { type: String },
}, { _id: false });

// Define the wishlist schema
const wishlistSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } // Reference to the Product model
}, { _id: false });


// Define the client schema
const clientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  profilePictureURL: { type: String }, // Optional profile picture URL
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  phone: [{ type: String }], // Array of phone numbers
  addresses: [addressSchema], // Array of addresses
  wishlist: [wishlistSchema], // Array of wishlist items
  isActive: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'registrationDate', updatedAt: 'lastUpdate' } }); // Add timestamps for registration and last update


// Pre-save hook to hash the password before saving
clientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, cimatec);
  next();
});

const Client = mongoose.model('Client', clientSchema);
export default Client;