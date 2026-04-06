import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: typeof mongoose | undefined;
}

async function connectMongo(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }
  if (global.mongooseConn?.connection?.readyState === 1) {
    return global.mongooseConn;
  }
  const conn = await mongoose.connect(MONGODB_URI);
  global.mongooseConn = conn;
  return conn;
}

export { connectMongo, MONGODB_URI };
