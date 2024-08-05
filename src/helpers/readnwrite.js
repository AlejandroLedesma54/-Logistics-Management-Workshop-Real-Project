const fs = require("fs");
const path = require("path");


const warehousesFilePath = path.join(__dirname, "../../data/warehouses.json");
const driversFilePath = path.join(__dirname, "../../data/drivers.json");
const shipmentsFilePath = path.join(__dirname, "../../data/shipments.json");
const vehiclesFilePath = path.join(__dirname, "../../data/vehicles.json");

const writeFile = (path, entity) => {
    fs.writeFileSync(path, JSON.stringify(entity, null, 2));
};

const readfile = (path) => {
   try{
    const entity = fs.readFileSync(path);
return JSON.parse(entity);   }
catch (err){
    throw new Error(`File not found${err}`)
}
};