import mongoose, { Schema, Document } from "mongoose";

export interface IPasskey extends Document {
  userId: mongoose.Types.ObjectId;
  credentialID: string;
  publicKey: Buffer;
  transports?: AuthenticatorTransport[];
  counter: number;
}

const PasskeySchema = new Schema<IPasskey>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  credentialID: { type: String, required: true, unique: true },
  publicKey: { type: Buffer, required: true },
  transports: {
    type: [String],
    enum: ["usb", "nfc", "ble", "internal", "hybrid"],
  },
  counter: { type: Number, required: true, default: 0 },
});

export const Passkey = mongoose.model<IPasskey>("Passkey", PasskeySchema);
