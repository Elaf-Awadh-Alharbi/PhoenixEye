
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, "..", "data", "users.json");

async function readUsersFile() {
  const fileContent = await fs.readFile(usersFilePath, "utf-8");
  return JSON.parse(fileContent); 
}


router.get("/", async (req, res) => {
  try {
    const users = await readUsersFile();
    res.json({ users }); 
  } catch (err) {
    console.error("Error reading users.json:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

export default router;
