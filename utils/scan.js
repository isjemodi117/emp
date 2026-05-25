// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Database openen
const db = new sqlite3.Database('meds.db');

// Endpoint om cliënt op te zoeken
app.get('/api/client/:szf_number', (req, res) => {
  const szf_number = req.params.szf_number;

  db.get("SELECT id, name FROM Clients WHERE szf_number = ?", [szf_number], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
