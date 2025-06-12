import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    type: {
      type: String,
      enum: ["Residencial", "Comercial"],
      default: "Comercial",
    },
    reference: { type: String },
  },
  { _id: false }
);

const artisanSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    brandName: { type: String, required: true },
    cpf_cnpj: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    profilePictureURL: { type: String }, // Optional profile picture URL
    personalData: {
      // Personal data with required fields
      birthDate: { type: Date, required: true },
      phone: [{ type: String, required: true }],
    },
    story: { type: String },
    artInfo: { type: String, required: true },
    description: { type: String, required: true },
    addresses: [addressSchema], // Array of addresses using the addressSchema defined above
    registeredProducts: [
      // Array of ObjectIds referencing the Product model
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
    averageProductRating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    role: {
      // Enum for role with default value
      type: String,
      required: true,
      enum: ["client", "artisan"],
      default: "artisan",
    },
  },
  { timestamps: { createdAt: "registrationDate", updatedAt: "lastUpdate" } } // Add timestamps for registration and last update
);

artisanSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Artisan = mongoose.model("Artisan", artisanSchema);
export default Artisan;
