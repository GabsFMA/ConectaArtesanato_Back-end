import mongoose from 'mongoose';

// Define the order item schema
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to the Product model
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan' }, // Reference to the Artisan model
  productName: { type: String, required: true },
  mainPhotoURL: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  itemSubtotal: { type: Number, required: true },
}, { _id: false });

// Define the shipping address schema
const shippingAddressSchema = new mongoose.Schema({
  recipientName: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
}, { _id: false });

// Define the order schema
const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // Reference to the Client model
  orderItems: [orderItemSchema],
  shippingAddress: { type: shippingAddressSchema, required: true },
  totalOrderAmount: { type: Number, required: true },
  orderStatus: { type: String, enum: ['Aguardando Pagamento', 'Em Preparação', 'Enviado', 'Entregue', 'Cancelado'], default: 'Aguardando Pagamento' },
  paymentInfo: { // Collection of payment information
    paymentMethod: { type: String },
    gatewayPaymentStatus: { type: String },
  },
  estimatedDeliveryDate: { type: Date },
  actualDeliveryDate: { type: Date },
}, { timestamps: { createdAt: 'orderDate' } }); // Add timestamps for order creation

const Order = mongoose.model('Order', orderSchema);
export default Order;