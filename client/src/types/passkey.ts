export type IPasskey = {
  _id: string;
  userId: string;
  credentialID: string;
  publicKey: Buffer;
  transports: string[];
  counter: number;
  deviceInfo: {
    aaguid: string;
    deviceName: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
