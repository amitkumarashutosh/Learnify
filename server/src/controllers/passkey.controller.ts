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
import {
  generateOtpEmailTemplate,
  generatePasskeyEmail,
  transporter,
} from "../utils/nodemailer";

type UserInfo = IUserDocument | null;
type ChallengeInfo = IChallenge | null;
type PasskeyInfo = IPasskey | null;

const aaguidMap: Record<string, string> = {
  "fbfc3007-154e-4ecc-8c0b-6e020557d7bd": "Macbook",
  "08987058-cadc-4b81-b6e1-30de50dcbe96": "YubiKey",
  "1203d68d-37d7-47ea-a9f5-979c11e1ef67": "Windows",
  "ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4": "Google",
  "adce0002-35bc-c60a-648b-0b25f1f05503": "Chrome",
  // Add more mappings from the AAGUID registry
};

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

    const { aaguid } = verificationResult.registrationInfo;
    const deviceName = aaguidMap[aaguid] || "Unknown";

    const passkey: IPasskey = await Passkey.create({
      userId,
      deviceInfo: {
        aaguid,
        deviceName,
      },
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

    //send email if user has registered and verified passkey successfully
    const info = await transporter.sendMail({
      to: user.email,
      subject: "🔐 Passkey Registered Successfully",
      html: generatePasskeyEmail(user.username),
    });

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
    passkey.updatedAt = new Date();
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

export const getUserPasskeys = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req._id!;
    const user: UserInfo = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const passkeys: IPasskey[] = await Passkey.find({ userId });
    res.status(200).json({ passkeys, success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get user passkeys" });
  }
};

export const deletePasskey = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req._id!;
    const { passkeyId } = req.body;
    const user: UserInfo = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const passkey: PasskeyInfo = await Passkey.findById(passkeyId);
    if (!passkey) {
      return res
        .status(404)
        .json({ message: "Passkey not found", success: false });
    }

    await Passkey.findByIdAndDelete({ _id: passkeyId });

    res
      .status(200)
      .json({ message: "Passkey deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete user passkeys" });
  }
};
