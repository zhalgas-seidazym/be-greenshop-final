import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddressModel',
        default: function () {
            return this.billingAddress;
        }
    },
    orderNotes: {
        type: String,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        priceAtPurchase: {
            type: Number,
            required: true,
            min: 0
        },
        discountApplied: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

const OrderModel = mongoose.model('Order', OrderSchema);
export default OrderModel;
