import mongoose, { Schema, Document } from "mongoose";

export interface IPasskey extends Document {
  userId: mongoose.Types.ObjectId;
  credentialID: string;
  publicKey: Buffer;
  transports?: AuthenticatorTransport[];
  counter: number;
  deviceInfo: {
    aaguid: string;
    deviceName: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PasskeySchema = new Schema<IPasskey>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    credentialID: { type: String, required: true, unique: true },
    publicKey: { type: Buffer, required: true },
    transports: {
      type: [String],
      enum: ["usb", "nfc", "ble", "internal", "hybrid"],
    },
    counter: { type: Number, required: true, default: 0 },
    deviceInfo: {
      aaguid: { type: String, required: true },
      deviceName: { type: String, required: true },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Passkey = mongoose.model<IPasskey>("Passkey", PasskeySchema);
