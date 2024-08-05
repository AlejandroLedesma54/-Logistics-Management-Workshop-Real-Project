const express = require('express'); 
const warehousesRoutes = require("./routes/warehouses");
const errorHandler = require('./middlewares/errorHandler');
const shipmentsRoutes = require("./routes/shipments")
const driversRoutes = require("./routes/shipments")

const app = express(); 
const PORT = 3000; 
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next(); // Pasar al siguiente middleware o ruta
  });
  
app.use(express.json()); 
app.use(errorHandler);
app.use("/warehouses", warehousesRoutes); 
app.use("/shipments", shipmentsRoutes);
app.use("/drivers", driversRoutes);
app.get('/api', (req, res) => {
    res.json({ message: 'API endpoint' });
  });
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
