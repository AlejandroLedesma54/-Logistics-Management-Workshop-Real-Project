const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const shipmentsFilePath = path.join(__dirname, "../../data/shipments.json");
const warehousesFilePath = path.join(__dirname, "../../data/warehouses.json");

const readShipments = () => {
  const shipmentsData = fs.readFileSync(shipmentsFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(shipmentsData); // Retornar los datos en formato JSON.
};

const writeShipments = (shipments) => {
  fs.writeFileSync(shipmentsFilePath, JSON.stringify(shipments, null, 2)); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
};
const readWarehouses = () => {
  const warehousesData = fs.readFileSync(warehousesFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
  return JSON.parse(warehousesData); // Retornar los datos en formato JSON.
};

// Crear
router.post("/", (req, res) => {
  const shipments = readShipments();
  const warehouses = readWarehouses();

  const newshipment = {
    id: shipments.length + 1,
    item: req.body.item,
    quantity: req.body.quantity,
    warehouseId: req.body.warehouseId,
  };
  const warehouseIdToCheck = req.body.warehouseId;
  const warehouseIdExists = warehouses.some(
    (w) => w.warehouseId === warehouseIdToCheck
  );

  if (!warehouseIdExists)
    return res.status(404).json({ message: "Warehouse has been not found" });

  shipments.push(newshipment);
  writeShipments(shipments);
  res.status(201).json({ message: "shipment created successfully!", shipment: newshipment });
});

// GET
router.get("/", (req, res) => {
  const shipments = readShipments();
  res.json(shipments);
});

// GET per ID
router.get("/:id", (req, res) => {
  const shipments = readShipments();
  const shipment = shipments.find((t) => t.id === parseInt(req.params.id));
  if (!shipment) {
    return res.status(404).json({ message: "shipment not found" });
  }
  res.json(shipment);
});

// UPDATE per ID
router.put("/:id", (req, res) => {
  const shipments = readShipments();
  const shipmentIndex = shipments.findIndex(
    (t) => t.id === parseInt(req.params.id)
  );
  if (shipmentIndex === -1) {
    return res.status(404).json({ message: "shipment not found" });
  }
  const updatedshipment = {
    ...shipments[shipmentIndex],
    item: req.body.item,
    quantity: req.body.quantity,
  };

  shipments[shipmentIndex] = updatedshipment;
  writeShipments(shipments);
  res.json({
    message: "shipment has been updated sucessfully!",
    shipment: updatedshipment,
  });
});

// Delete per ID
router.delete("/:id", (req, res) => {
  const shipments = readShipments();
  const newshipments = shipments.filter(
    (t) => t.id !== parseInt(req.params.id)
  );
  if (shipments.length === newshipments.length) {
    return res.status(404).json({ message: "shipment not found" });
  }
  writeShipments(newshipments);
  res.json({ message: "shipment eliminada exitosamente" });
});

module.exports = router;
