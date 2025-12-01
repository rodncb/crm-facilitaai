import mongoose from 'mongoose';

// Modelo para armazenar relacionamento entre Cliente e Stripe Customer
const stripeCustomerSchema = new mongoose.Schema({
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true,
        unique: true
    },
    stripeCustomerId: {
        type: String,
        required: true
    },
    stripePaymentMethods: [{
        type: String
    }],
    defaultPaymentMethod: {
        type: String
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

stripeCustomerSchema.index({ clienteId: 1 });
stripeCustomerSchema.index({ stripeCustomerId: 1 });

const StripeCustomer = mongoose.model('StripeCustomer', stripeCustomerSchema);

export default StripeCustomer;
