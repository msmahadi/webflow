
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.resolve("./test-1.js"); // মূল ফাইলের লোকেশন

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to load script" });
      return;
    }

    res.setHeader("Content-Type", "application/javascript");
    res.status(200).send(data);
  });
}
