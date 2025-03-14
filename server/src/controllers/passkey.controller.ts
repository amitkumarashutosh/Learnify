import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  PublicKeyCredentialCreationOptionsJSON,
  AuthenticationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  RegistrationResponseJSON,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from "@simplewebauthn/server";
import { IUserDocument, User } from "../models/user.model";
import { Challenge, IChallenge } from "../models/challenge.model";
import { isoUint8Array } from "@simplewebauthn/server/helpers";
import { AuthRequest } from "../middlewares/auth";
import { Response } from "express";
import { IPasskey, Passkey } from "../models/passkey.model";

type UserInfo = IUserDocument | null;
type ChallengeInfo = IChallenge | null;
type PasskeyInfo = IPasskey | null;

export const registerPasskey = async (req: AuthRequest, res: Response) => {
  try {
    const userId: string = req._id!;
    const user: UserInfo = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const userPasskeys: IPasskey[] = await Passkey.find({ userId });

    const options: PublicKeyCredentialCreationOptionsJSON =
      await generateRegistrationOptions({
        rpName: process.env.RP_NAME as string,
        rpID: process.env.RP_ID as string,
        userID: isoUint8Array.fromUTF8String(userId),
        userName: user.username,
        excludeCredentials: userPasskeys.map((passkey) => ({
          id: passkey.credentialID,
        })),
      });

    //delete if challenge already exist
    await Challenge.findOneAndDelete({ userId });

    //expires after 5 min
    await Challenge.create({
      userId,
      payload: options.challenge,
    });

    res.status(200).json({ options, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register passkey" });
  }
};

export const verifyPasskey = async (req: AuthRequest, res: Response) => {
  try {
    const { credential }: { credential: RegistrationResponseJSON } = req.body;

    const userId: string = req._id!;

    const user: UserInfo = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const challenge: ChallengeInfo = await Challenge.findOne({ userId });
    if (!challenge) {
      return res
        .status(404)
        .json({ message: "Challenge not found or expired!", success: false });
    }

    const verificationResult: VerifiedRegistrationResponse =
      await verifyRegistrationResponse({
        response: credential,
        expectedChallenge: challenge.payload,
        expectedOrigin: process.env.ORIGIN!,
        expectedRPID: process.env.RP_ID!,
      });

    if (!verificationResult.verified || !verificationResult.registrationInfo) {
      return res
        .status(400)
        .json({ message: "Verification failed", success: false });
    }

    const { id, publicKey, counter, transports } =
      verificationResult.registrationInfo.credential;

    const passkey: IPasskey = await Passkey.create({
      userId,
      credentialID: id,
      publicKey: Buffer.from(publicKey),
      counter: counter,
      transports: transports,
    });

    //delete challenge
    await Challenge.findOneAndDelete({ userId });

    if (!passkey) {
      return res
        .status(404)
        .json({ message: "Passkey not found", success: false });
    }

    user.passkeys?.push(passkey.id);
    await user.save();

    res.status(200).json({
      message: "Registration successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to verify  passkey" });
  }
};

export const loginWithPasskey = async (req: AuthRequest, res: Response) => {
  try {
    const userId: string = req._id!;
    const user: UserInfo = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const userPasskeys: IPasskey[] = await Passkey.find({ userId });

    const options: PublicKeyCredentialRequestOptionsJSON =
      await generateAuthenticationOptions({
        rpID: process.env.RP_ID!,
        allowCredentials: userPasskeys.map((passkey) => ({
          id: passkey.credentialID,
          transports: passkey.transports,
        })),
      });

    //delete if challenge already exist
    await Challenge.findOneAndDelete({ userId });

    await Challenge.create({
      userId,
      payload: options.challenge,
    });

    res.status(200).json({ options, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to  login with registered passkey",
    });
  }
};

export const verifyWithPasskey = async (req: AuthRequest, res: Response) => {
  try {
    const { credential }: { credential: AuthenticationResponseJSON } = req.body;
    const userId = req._id!;

    const user: UserInfo = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const challenge: ChallengeInfo = await Challenge.findOne({ userId });
    if (!challenge) {
      return res
        .status(404)
        .json({ message: "Challenge not found or expired!" });
    }

    const passkey: PasskeyInfo = await Passkey.findOne({
      userId,
      credentialID: credential.id,
    });
    if (!passkey) {
      return res
        .status(404)
        .json({ message: "Passkey not found", success: false });
    }

    const verificationResult: VerifiedAuthenticationResponse =
      await verifyAuthenticationResponse({
        expectedChallenge: challenge.payload,
        expectedOrigin: process.env.ORIGIN!,
        expectedRPID: process.env.RP_ID!,
        response: credential,
        credential: {
          id: passkey.credentialID,
          publicKey: new Uint8Array(Buffer.from(passkey.publicKey)),
          counter: passkey.counter,
          transports: passkey.transports,
        },
      });

    if (!verificationResult.verified) {
      return res
        .status(400)
        .json({ message: "Authentication failed", success: false });
    }

    // Prevent replay attacks using counter
    if (
      verificationResult.authenticationInfo?.newCounter > 0 &&
      verificationResult.authenticationInfo.newCounter <= passkey.counter
    ) {
      return res
        .status(400)
        .json({ message: "Counter replay detected", success: false });
    }

    // Update stored counter with the new counter from the authenticator
    passkey.counter = verificationResult.authenticationInfo.newCounter;
    await passkey.save();

    await Challenge.findOneAndDelete({ userId });

    const token: string = await user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({
        message: "Login successful with passkey",
        success: true,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to verify login user passkey" });
  }
};
