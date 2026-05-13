const express = require("express");
const {
  getReports,
  updateReportStatus,
  deleteReport,
  getReportsStats, 
  getReportsTimeSeries,
  getHeatmapData,
  getReportDetails,
  getAnalytics,
} = require("../controllers/adminController");

const {
  getAllDrones,
  createDrone,
  updateDroneStatus,
  deleteDrone,
  launchDrone,
  getDroneDetails,
  getDroneReports,
  getDroneStats,
} = require("../controllers/adminDroneController");

const { verifyToken } = require("../middleware/authMiddleware");


const router = express.Router();

// جميعها تتطلب تسجيل دخول
router.get("/reports", verifyToken, getReports);
router.patch("/reports/:id/status", verifyToken, updateReportStatus);
router.delete("/reports/:id", verifyToken, deleteReport);
router.get("/reports/stats", verifyToken, getReportsStats);
router.get("/analytics", verifyToken, getAnalytics);
router.get("/analytics/timeseries", verifyToken, getReportsTimeSeries);
router.get("/analytics/heatmap", verifyToken, getHeatmapData);
router.get("/reports/:id", verifyToken, getReportDetails);

// Drone management routes
router.get("/drones", verifyToken, getAllDrones);
router.post("/drones", verifyToken, createDrone);
router.patch("/drones/:id/status", verifyToken, updateDroneStatus);
router.delete("/drones/:id", verifyToken, deleteDrone);


// Advanced Drone Controls
router.patch("/drones/:id/launch", verifyToken, launchDrone);
router.get("/drones/:id", verifyToken, getDroneDetails);
router.get("/drones/:id/reports", verifyToken, getDroneReports);
router.get("/drones/:id/stats", verifyToken, getDroneStats);

module.exports = router;

