import UserModel from "../models/user-model.js";
import BaseRepository from "./base-repository.js";

class UserRepository extends BaseRepository {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email) {
        return this.model.findOne({email});
    }

    async findByPhoneNumber(phoneNumber) {
        return this.model.findOne({phoneNumber});
    }
}

export default UserRepository;
