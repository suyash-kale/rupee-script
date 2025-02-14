import mongoose, { Mongoose } from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

let connection: Mongoose;

if (!MONGO_URL) {
  throw new Error('Please define MONGO_URL environment variable.');
}

// establish connection with MongoDB
const connect = async () => {
  if (!connection) {
    connection = await mongoose.connect(MONGO_URL);
  }
  return connection;
};

export default connect;
