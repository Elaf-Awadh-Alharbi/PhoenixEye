const Report = require("../models/Report");

function buildImageUrlFromFile(file) {
  if (!file) return null;
  // نخزن مسار قابل للعرض
  return `/uploads/reports/${file.filename}`;
}

exports.createDroneReport = async (req, res) => {
  try {
    const { latitude, longitude, image_url } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Location is required" });
    }

    const uploadedPath = buildImageUrlFromFile(req.file);
    const finalImageUrl = uploadedPath || image_url || null;

    const report = await Report.create({
      drone_id: req.drone.drone_id,
      latitude,
      longitude,
      image_url: finalImageUrl,
      status: "PENDING",
      source: "DRONE",
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating drone report" });
  }
};

exports.createCitizenReport = async (req, res) => {
  try {
    const { latitude, longitude, image_url } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Location is required" });
    }

    if (!req.file && !image_url) {
      return res.status(400).json({ error: "Image is required" });
    }

    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
      return res.status(400).json({ error: "Invalid latitude or longitude" });
    }

    const uploadedPath = buildImageUrlFromFile(req.file);
    const finalImageUrl = uploadedPath || image_url || null;

    const report = await Report.create({
      drone_id: null,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      image_url: finalImageUrl,
      status: "PENDING",
      source: "CITIZEN",
    });

    res.status(201).json({
      message: "Citizen report submitted successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating citizen report" });
  }
};

