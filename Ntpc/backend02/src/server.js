import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

const NTPC="NTPC";

dotenv.config();

mongoose.connect(`${process.env.MONGO_URI}/${NTPC}`)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch(err => console.log(err));