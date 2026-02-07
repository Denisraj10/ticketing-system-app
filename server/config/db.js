import mongoose from 'mongoose';

const connectWithUri = async (uri) => {
  // mongoose options object updated for Mongoose 6+ (deprecated options removed)
  await mongoose.connect(uri);
};

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = 'mongodb://localhost:27017/ticketing_db';

  if (!primaryUri) {
    console.warn('MONGO_URI not set — attempting local MongoDB at', fallbackUri);
  }

  try {
    const uriToTry = primaryUri || fallbackUri;
    await connectWithUri(uriToTry);
    console.log('✓ MongoDB connected successfully to', uriToTry);
  } catch (primaryError) {
    console.error('✗ MongoDB primary connection failed:', primaryError.message);

    if (primaryUri) {
      // try fallback local DB
      try {
        await connectWithUri(fallbackUri);
        console.log('✓ MongoDB connected successfully to local fallback', fallbackUri);
        return;
      } catch (fallbackError) {
        console.error('✗ Local MongoDB fallback connection failed:', fallbackError.message);
      }
    }

    console.warn('Proceeding without a MongoDB connection. Some features may not work until a database is available.');
    // Do not exit the process — keep server running for frontend development and quicker iteration.
  }
};
