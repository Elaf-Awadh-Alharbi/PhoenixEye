const Drone = require("../models/Drone");
const Report = require("../models/Report");

// GET /api/admin/drones
exports.getAllDrones = async (req, res) => {
  try {
    const drones = await Drone.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(drones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching drones" });
  }
};

// POST /api/admin/drones
exports.createDrone = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Drone name is required" });
    }

    const drone = await Drone.create({
      name,
      status: "AVAILABLE",
    });

    res.status(201).json({
      message: "Drone created successfully",
      drone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating drone" });
  }
};


// PATCH /api/admin/drones/:id/status
exports.updateDroneStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
    "AVAILABLE",
    "ASSIGNED",
    "IN_MISSION",
    "OFFLINE",
    "MAINTENANCE"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const drone = await Drone.findByPk(id);

    if (!drone) {
      return res.status(404).json({ error: "Drone not found" });
    }

    drone.status = status;
    await drone.save();

    res.json({
      message: "Drone status updated successfully",
      drone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating drone status" });
  }
};


// DELETE /api/admin/drones/:id
exports.deleteDrone = async (req, res) => {
  try {
    const { id } = req.params;

    const drone = await Drone.findByPk(id);

    if (!drone) {
      return res.status(404).json({ error: "Drone not found" });
    }

    await drone.destroy(); // soft delete

    res.json({ message: "Drone deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting drone" });
  }
};

// =============================
// PATCH /api/admin/drones/:id/launch
// =============================
exports.launchDrone = async (req, res) => {
  try {
    const { id } = req.params;

    const drone = await Drone.findByPk(id);

    if (!drone) {
      return res.status(404).json({ error: "Drone not found" });
    }

    if (drone.status !== "AVAILABLE") {
      return res.status(400).json({
        error: "Drone is not available for launch",
      });
    }

    drone.status = "IN_MISSION";
    drone.is_online = true;
    drone.last_seen_at = new Date();
    await drone.save();

    res.json({
      message: "Drone launched successfully",
      drone,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error launching drone" });
  }
};


// =============================
// GET /api/admin/drones/:id
// =============================
exports.getDroneDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const drone = await Drone.findByPk(id);

    if (!drone) {
      return res.status(404).json({ error: "Drone not found" });
    }

    res.json(drone);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching drone details" });
  }
};


// =============================
// GET /api/admin/drones/:id/reports
// =============================
exports.getDroneReports = async (req, res) => {
  try {
    const { id } = req.params;

    const reports = await Report.findAll({
      where: { drone_id: id },
      order: [["createdAt", "DESC"]],
    });

    res.json(reports);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching drone reports" });
  }
};


// =============================
// GET /api/admin/drones/:id/stats
// =============================
exports.getDroneStats = async (req, res) => {
  try {
    const { id } = req.params;

    const totalReports = await Report.count({
      where: { drone_id: id },
    });

    const verifiedReports = await Report.count({
      where: {
        drone_id: id,
        status: "VERIFIED",
      },
    });

    const pendingReports = await Report.count({
      where: {
        drone_id: id,
        status: "PENDING",
      },
    });

    const removedReports = await Report.count({
      where: {
        drone_id: id,
        status: "REMOVED",
      },
    });

    res.json({
      totalReports,
      pendingReports,
      verifiedReports,
      removedReports,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching drone stats" });
  }
};
