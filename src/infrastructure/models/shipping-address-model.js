import mongoose from 'mongoose';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[+]?[0-9]{1,4}[-\s\./0-9]*$/;

const ShippingAddressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [10, 'Name name can\'t exceed 10 characters'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name can\'t exceed 50 characters'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name can\'t exceed 50 characters'],
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        minlength: [2, 'Country name must be at least 2 characters long'],
        maxlength: [100, 'Country name can\'t exceed 100 characters'],
    },
    town: {
        type: String,
        required: [true, 'Town is required'],
        trim: true,
        minlength: [2, 'Town name must be at least 2 characters long'],
        maxlength: [100, 'Town name can\'t exceed 100 characters'],
    },
    street: {
        type: String,
        required: [true, 'Street is required'],
        trim: true,
        minlength: [2, 'Street name must be at least 2 characters long'],
        maxlength: [200, 'Street name can\'t exceed 200 characters'],
    },
    apartment: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        minlength: [2, 'State name must be at least 2 characters long'],
        maxlength: [100, 'State name can\'t exceed 100 characters'],
    },
    zip: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
        minlength: [5, 'Zip code must be at least 5 characters long'],
        maxlength: [10, 'Zip code can\'t exceed 10 characters'],
    },
    emailAddress: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        match: [emailRegex, 'Please enter a valid email address'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [phoneRegex, 'Please enter a valid phone number'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'User ID is required'],
    }
}, {timestamps: true});

const ShippingAddressModel = mongoose.model('ShippingAddressModel', ShippingAddressSchema);
export default ShippingAddressModel;
