const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");


const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    drone_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "VERIFIED", "ASSIGNED", "REMOVED"),
      defaultValue: "PENDING",
    },
    source: {
      type: DataTypes.ENUM("DRONE", "CITIZEN"),
      allowNull: false,
    },
  },
  {
    tableName: "roadkill_reports",
    timestamps: true,
    paranoid: true, // لأنه عندك deleted_at
    underscored: true,
  }
);


module.exports = Report;