import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: [true, 'Sender name is required'],
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
    },
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

export default mongoose.model('Message', messageSchema);
