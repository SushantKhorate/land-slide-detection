const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// -------- DATA --------
let sensorData = {
  soil1: 0,
  soil2: 0,
  dist1: 0,
  dist2: 0,
  tiltX: 0,
  tiltY: 0,
  tiltZ: 0,
  buzzer: 0
};

// -------- ROUTES --------

// ESP32 → send data
app.post("/update", (req, res) => {
  const d = req.body;

  sensorData.soil1 = d.soil1 ?? sensorData.soil1;
  sensorData.soil2 = d.soil2 ?? sensorData.soil2;
  sensorData.dist1 = d.dist1 ?? sensorData.dist1;
  sensorData.dist2 = d.dist2 ?? sensorData.dist2;
  sensorData.tiltX = d.tiltX ?? sensorData.tiltX;
  sensorData.tiltY = d.tiltY ?? sensorData.tiltY;
  sensorData.tiltZ = d.tiltZ ?? sensorData.tiltZ;

  console.log("Updated:", sensorData);
  res.send("OK");
});

// Website → get data
app.get("/data", (req, res) => {
  res.json(sensorData);
});

// Website → control buzzer
app.post("/buzzer", (req, res) => {
  const state = req.body.state;

  if (state === 0 || state === 1) {
    sensorData.buzzer = state;
    res.send("Updated");
  } else {
    res.status(400).send("Invalid");
  }
});

// ESP32 → read buzzer state
app.get("/buzzer", (req, res) => {
  res.json({ buzzer: sensorData.buzzer });
});

// -------- START --------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
