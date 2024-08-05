const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const warehousesFilePath = path.join(__dirname, "../../data/warehouses.json");

const readWarehouses = () => {
  const warehousesData = fs.readFileSync(warehousesFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(warehousesData); // Retornar los datos en formato JSON.
};

const writeWarehouses = (warehouses) => {
  fs.writeFileSync(warehousesFilePath, JSON.stringify(warehouses, null, 2)); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
};

// Crear 
router.post("/", (req, res) => {
    const warehouses = readWarehouses();
    const newWarehouse = {
      id: warehouses.length + 1,
      name: req.body.name,
      location: req.body.location,
    };
    warehouses.push(newWarehouse);
    writeWarehouses(warehouses);
    res.status(201).json({ message: "Warehouse created successfully!", warehouse: newWarehouse });
  });

// GET
router.get("/", (req, res) => {
  const warehouses = readWarehouses();
  res.json(warehouses);
});

// GET per ID
router.get("/:id", (req, res) => {
  const warehouses = readWarehouses();
  const warehouse = warehouses.find((t) => t.id === parseInt(req.params.id));
  if (!warehouse) {
    return res.status(404).json({ message: "warehouse not found" });
  }
  res.json(warehouse);
});

// UPDATE per ID
router.put("/:id", (req, res) => {
  const warehouses = readWarehouses();
  const WarehouseIndex = warehouses.findIndex(
    (t) => t.id === parseInt(req.params.id)
  );
  if (WarehouseIndex === -1) {
    return res.status(404).json({ message: "warehouse not found" });
  }
  const updatedWarehouse = {
    ...warehouses[WarehouseIndex],
    name: req.body.name,
    location: req.body.location,
  };
  warehouses[WarehouseIndex] = updatedWarehouse;
  writeWarehouses(warehouses);
  res.json({
    message: "warehouse has been updated sucessfully!",
    Warehouse: updatedWarehouse,
  });
});

// Delete per ID
router.delete("/:id", (req, res) => {
  const warehouses = readWarehouses();
  const newwarehouses = warehouses.filter(
    (t) => t.id !== parseInt(req.params.id)
  );
  if (warehouses.length === newwarehouses.length) {
    return res.status(404).json({ message: "warehouse not found" });
  }
  writeWarehouses(newwarehouses);
  res.json({ message: "warehouse eliminada exitosamente" });
});

module.exports = router;
