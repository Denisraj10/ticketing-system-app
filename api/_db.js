import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  // Allow deployments where the env var is not yet set — connection will fail later.
  console.warn('MONGO_URI is not defined');
}

let cached = global._mongo;
if (!cached) cached = global._mongo = { conn: null, promise: null };

export default async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {})
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
