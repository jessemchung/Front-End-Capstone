  import mongoose from 'mongoose';
  const { Schema } = mongoose;

  const Reviews = new Schema({
    id:  { type: Number, unique: true },
    response: { type: String, required: true },
    reviewer: {type: String, required: true },
    email: { type: String, default: 'anonymous' },
    body: { type: String, required: true },
    summary: { type: String, required: true },
    postdate: { type: Date, default: Date.now },
    helpfulness:  { type: Number, default: 0 },
    productID: { type: Number, required: true },
    recommended: { type: Boolean, default: false },
    reported: { type: Boolean, default: false },
    characteristics: {
      type: Map,
      of: { id: Number, value: Number },
    },
    ratings: { type: Number, default: 5 },
    photos: [{imageURL: String, id: Number}]

  });

//{ "Size" : { "id": 14, "value": 4 }

