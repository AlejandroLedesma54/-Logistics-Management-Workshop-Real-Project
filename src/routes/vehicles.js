const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const vehiclesFilePath = path.join(__dirname, "../../data/vehicles.json");
const driversFilePath = path.join(__dirname, "../../data/drivers.json");

const readvehicles = () => {
  const vehiclesData = fs.readFileSync(vehiclesFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(vehiclesData); // Retornar los datos en formato JSON.
};

const writevehicles = (vehicles) => {
  fs.writeFileSync(vehiclesFilePath, JSON.stringify(vehicles, null, 2)); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
};
const readdrivers = () => {
  const driversData = fs.readFileSync(driversFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(driversData); // Retornar los datos en formato JSON.
};

// Crear
router.post("/", (req, res) => {
  const vehicles = readvehicles();
  const drivers = readdrivers();

  const newvehicle = {
    id: vehicles.length + 1,
    item: req.body.item,
    quantity: req.body.quantity,
    driverId: req.body.driverId,
  };
  const driverIdToCheck = req.body.driverId;
  const driverIdExists = drivers.some(w => w.driverId === driverIdToCheck);

  if (driverIdExists) {
    vehicles.push(newvehicle);
  writevehicles(vehicles);
  res
    .status(201)
    .json({ message: "vehicle created successfully!", vehicle: newvehicle })
  } else { 
    return res.status(404).json({ message: "driver has been not found" });
}
});

// GET
router.get("/", (req, res) => {
  const vehicles = readvehicles();
  res.json(vehicles);
});

// GET per ID
router.get("/:id", (req, res) => {
  const vehicles = readvehicles();
  const vehicle = vehicles.find((t) => t.id === parseInt(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ message: "vehicle not found" });
  }
  res.json(vehicle);
});

// UPDATE per ID
router.put("/:id", (req, res) => {
  const vehicles = readvehicles();
  const vehicleIndex = vehicles.findIndex(
    (t) => t.id === parseInt(req.params.id)
  );
  if (vehicleIndex === -1) {
    return res.status(404).json({ message: "vehicle not found" });
  }
  const updatedvehicle = {
    ...vehicles[vehicleIndex],
    item: req.body.item,
    quantity: req.body.quantity,
  };

  vehicles[vehicleIndex] = updatedvehicle;
  writevehicles(vehicles);
  res.json({
    message: "vehicle has been updated sucessfully!",
    vehicle: updatedvehicle,
  });
});

// Delete per ID
router.delete("/:id", (req, res) => {
  const vehicles = readvehicles();
  const newvehicles = vehicles.filter(
    (t) => t.id !== parseInt(req.params.id)
  );
  if (vehicles.length === newvehicles.length) {
    return res.status(404).json({ message: "vehicle not found" });
  }
  writevehicles(newvehicles);
  res.json({ message: "vehicle eliminada exitosamente" });
});

module.exports = router;


