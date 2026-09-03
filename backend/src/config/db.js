import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chatapp";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected (Local/Remote): ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB service not found. Initializing In-Memory Database engine...`);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory Database Connected Successfully at: ${mongoUri}`);
    } catch (memError) {
      console.error("Failed to start in-memory database fallback:", memError.message);
    }
  }
};
