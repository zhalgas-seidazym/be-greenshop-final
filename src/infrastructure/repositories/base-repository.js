class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findById(id) {
        const user = await this.model.findById(id);
        return user ? user : null;
    }

    async findAll(filter = {}, options = {}) {
        const query = this.model.find(filter, null, options);
        return await query.exec();
    }

    async create(user) {
        const newData = new this.model(user);
        return await newData.save();
    }

    async update(id, updateData) {
        const updatedData = await this.model.findByIdAndUpdate(id, updateData, {
            new: true, runValidators: true,
        });
        return updatedData ? updatedData : null;
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

export default BaseRepository;
