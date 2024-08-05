const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const driversFilePath = path.join(__dirname, "../../data/drivers.json");

const readDrivers = () => {
  const driversData = fs.readFileSync(driversFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(driversData); // Retornar los datos en formato JSON.
};

const writeDrivers = (drivers) => {
  fs.writeFileSync(driversFilePath, JSON.stringify(drivers, null, 2)); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
};

// Crear 
router.post("/", (req, res) => {
    const drivers = readDrivers();
    const newdriver = {
      id: drivers.length + 1,
      name: req.body.name,
    };
    drivers.push(newdriver);
    writeDrivers(drivers);
    res.status(201).json({ message: "driver created successfully!", driver: newdriver });
  });

// GET
router.get("/", (req, res) => {
  const drivers = readDrivers();
  res.json(drivers);
});

// GET per ID
router.get("/:id", (req, res) => {
  const drivers = readDrivers();
  const driver = drivers.find((t) => t.id === parseInt(req.params.id));
  if (!driver) {
    return res.status(404).json({ message: "driver not found" });
  }
  res.json(driver);
});

// UPDATE per ID
router.put("/:id", (req, res) => {
  const drivers = readDrivers();
  const driverIndex = drivers.findIndex(
    (t) => t.id === parseInt(req.params.id)
  );
  if (driverIndex === -1) {
    return res.status(404).json({ message: "driver not found" });
  }
  const updateddriver = {
    ...drivers[driverIndex],
    name: req.body.name,
  };
  drivers[driverIndex] = updateddriver;
  writeDrivers(drivers);
  res.json({
    message: "driver has been updated sucessfully!",
    driver: updateddriver,
  });
});

// Delete per ID
router.delete("/:id", (req, res) => {
  const drivers = readDrivers();
  const newdrivers = drivers.filter(
    (t) => t.id !== parseInt(req.params.id)
  );
  if (drivers.length === newdrivers.length) {
    return res.status(404).json({ message: "driver not found" });
  }
  writeDrivers(newdrivers);
  res.json({ message: "driver eliminada exitosamente" });
});

module.exports = router;
