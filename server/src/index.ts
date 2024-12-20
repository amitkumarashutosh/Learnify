import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/db";
import userRouter from "./routes/user.route";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/user", userRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ message: "Health OK!" });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
