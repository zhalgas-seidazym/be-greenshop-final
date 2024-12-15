import mongoose from "mongoose";
import config from "../../main/config.js";


const connectToDB = async () => {
    await mongoose.connect(config.mongodb).then(() => {
        console.log("MongoDB Connected");
    }).catch((err) => {
        console.error(err);
    })
}

export default connectToDB;