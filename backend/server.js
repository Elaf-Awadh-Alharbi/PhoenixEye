
import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 5000;


app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());


const REPORTS_FILE = "./data/reports.json";
const USERS_FILE = "./data/users.json";
const DRONES_FILE = "./data/drones.json";


const readJson = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw) return [];
  return JSON.parse(raw);
};

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


if (!fs.existsSync(REPORTS_FILE)) {
  writeJson(REPORTS_FILE, [
    {
      id: 1,
      title: "Dead animal on highway",
      description: "Near exit 5, right lane",
      status: "pending",
      location: "Riyadh - Highway 40",
    },
  ]);
}

if (!fs.existsSync(USERS_FILE)) {
  writeJson(USERS_FILE, []);
}

if (!fs.existsSync(DRONES_FILE)) {
  writeJson(DRONES_FILE, [
    {
      id: 1,
      name: "Drone A1",
      status: "available",
      battery: 92,
      mode: "idle",
      location: "Riyadh - Depot A",
    },
    {
      id: 2,
      name: "Drone B3",
      status: "busy",
      battery: 67,
      mode: "on-mission",
      location: "Riyadh - Highway 10",
    },
    {
      id: 3,
      name: "Drone C7",
      status: "available",
      battery: 80,
      mode: "idle",
      location: "Riyadh - Depot B",
    },
  ]);
}


app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running 🚀" });
});


app.get("/api/reports", (req, res) => {
  const reports = readJson(REPORTS_FILE);
  res.json(reports);
});


app.get("/api/reports/:id", (req, res) => {
  const reports = readJson(REPORTS_FILE);
  const id = parseInt(req.params.id, 10);

  const report = reports.find((r) => r.id === id);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.json(report);
});


app.put("/api/reports/:id", (req, res) => {
  const reports = readJson(REPORTS_FILE);
  const id = parseInt(req.params.id, 10);

  const idx = reports.findIndex((r) => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Report not found" });
  }

  
  reports[idx] = { ...reports[idx], ...req.body };

  writeJson(REPORTS_FILE, reports);
  res.json(reports[idx]);
});


app.post("/api/reports", (req, res) => {
  const reports = readJson(REPORTS_FILE);
  const { title, description, status, location, latitude, longitude } = req.body;

  const newReport = {
    id: Date.now(),
    title,
    description,
    status: status || "pending",
    location,
    latitude,
    longitude,
  };

  reports.push(newReport);
  writeJson(REPORTS_FILE, reports);

  res.status(201).json(newReport);
});


app.get("/api/drones", (req, res) => {
  const drones = readJson(DRONES_FILE);
  res.json(drones);
});


app.get("/api/drones/:id", (req, res) => {
  const drones = readJson(DRONES_FILE);
  const id = parseInt(req.params.id, 10);

  const drone = drones.find((d) => d.id === id);
  if (!drone) {
    return res.status(404).json({ error: "Drone not found" });
  }

  res.json(drone);
});


app.put("/api/drones/:id", (req, res) => {
  const drones = readJson(DRONES_FILE);
  const id = parseInt(req.params.id, 10);

  const idx = drones.findIndex((d) => d.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Drone not found" });
  }

  drones[idx] = { ...drones[idx], ...req.body };

  writeJson(DRONES_FILE, drones);
  res.json(drones[idx]);
});


app.post("/api/drones", (req, res) => {
  const drones = readJson(DRONES_FILE);
  const { name, status, battery, mode, location } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newDrone = {
    id: Date.now(),
    name,
    status: status || "available",
    battery: typeof battery === "number" ? battery : 100,
    mode: mode || "idle",
    location: location || "Riyadh",
  };

  drones.push(newDrone);
  writeJson(DRONES_FILE, drones);

  res.status(201).json(newDrone);
});


app.get("/api/users", (req, res) => {
  const users = readJson(USERS_FILE);
  
  res.json({ users });
});


app.get("/api/users/:id", (req, res) => {
  const users = readJson(USERS_FILE);
  const id = parseInt(req.params.id, 10);

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  });
});




app.post("/api/auth/register", (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const users = readJson(USERS_FILE);

  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    password,
    role,
  };

  users.push(newUser);
  writeJson(USERS_FILE, users);

  res.status(201).json({
    message: "User registered successfully",
    user: { id: newUser.id, fullName, email, role },
  });
});


app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const users = readJson(USERS_FILE);

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});


app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
