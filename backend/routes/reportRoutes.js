import express from "express";

const router = express.Router();


let reports = [
  {
    id: "1",
    title: "Dead animal on highway",
    description: "Near exit 5, right lane",
    status: "pending",
    location: "Riyadh - Highway 40",
  },
  {
    id: "2",
    title: "Road obstruction",
    description: "Tree branch blocking part of the road",
    status: "in-progress",
    location: "Riyadh - King Fahd Road",
  },
];


router.get("/", (req, res) => {
  res.json(reports);
});


router.post("/", (req, res) => {
  const { title, description, status, location } = req.body;

  const newReport = {
    id: Date.now().toString(),
    title,
    description: description || "",
    status: status || "pending",
    location: location || "",
  };

  reports.unshift(newReport);
  res.status(201).json(newReport);
});


router.put("/:id", (req, res) => {
  const { id } = req.params;
  const idx = reports.findIndex((r) => r.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: "Report not found" });
  }

  reports[idx] = { ...reports[idx], ...req.body };
  res.json(reports[idx]);
});


router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const before = reports.length;
  reports = reports.filter((r) => r.id !== id);

  if (reports.length === before) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.json({ message: "Report deleted" });
});

export default router;
