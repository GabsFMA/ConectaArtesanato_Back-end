import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Reuse the address schema from Client model
const addressSchema = new mongoose.Schema(  
    { 
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    type: String,
    reference: String
  },
  { _id: false }
);

// Define the artisan schema
const artisanSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  brandName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  profilePictureURL: { type: String }, // Optional profile picture URL
  personalData: { // Collection of personal data
    cpf_cnpj: { type: String, required: true, unique: true },
    birthDate: { type: Date },
    phone: [{ type: String }],
  },
  story: { type: String },
  artInfo: { type: String },
  addresses: [addressSchema], // Array of addresses
  registeredProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference to the Product model
  averageProductRating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'registrationDate', updatedAt: 'lastUpdate' } }); // Add timestamps for registration and last update

// Pre-save hook to hash the password before saving
artisanSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, cimatec);
  next();
});

const Artisan = mongoose.model('Artisan', artisanSchema);
export default Artisan;