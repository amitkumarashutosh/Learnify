import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import connectDB from "./db/db";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import mediaRouter from "./routes/media.route";
import purchaseRouter from "./routes/purchaseCourse.route";
import courseProgressRouter from "./routes/courseProgress.route";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_BASE_URL, credentials: true }));

app.use("/api/media", mediaRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/progress", courseProgressRouter);

app.use("/health", (req: Request, res: Response) => {
  res.send("Health OK!!");
});

const reactBuildPath = path.join(__dirname, "../client");
app.use(express.static(reactBuildPath));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
