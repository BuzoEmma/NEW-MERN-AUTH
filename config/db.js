import mongoose from "mongoose";

const connetMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "MernAuth",
    });
    console.log(`MONGODB server is connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connetMongoDB;
