import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.json({ message: "Health OK!" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
