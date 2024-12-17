import mongoose from 'mongoose';

const Role = {
    admin: 'admin',
    client: 'client',
};

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    phoneNumber: {
        type: String,
        match: [/^\+?\d{1,3}[- ]?\d{4,14}$/, 'Please enter a valid phone number'],
        required: false,
        default: ''
    },
    photoURL: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
        default: Role.client,
        validate: {
            validator: function (value) {
                return Object.values(Role).includes(value);
            },
            message: 'Invalid role'
        }
    },
    verifiedUser: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
