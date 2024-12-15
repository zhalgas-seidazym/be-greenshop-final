import UserModel from "../models/user-model.js";

class UserRepository {
    async findById(id) {
        const user = await UserModel.findById(id);
        return user ? user : null;
    }

    async findByEmail(email) {
        return UserModel.findOne({email});
    }

    async findByPhoneNumber(phoneNumber) {
        return UserModel.findOne({phoneNumber});
    }

    async create(user) {
        const newUser = new UserModel(user);
        return await newUser.save();
    }

    async update(id, updateData) {
        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
            new: true, runValidators: true,
        });
        return updatedUser ? updatedUser : null;
    }

    async delete(id) {
        return UserModel.findByIdAndDelete(id);
    }
}

export default UserRepository;
