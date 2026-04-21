const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// -------- GLOBAL DATA --------
let sensorData = {
  soil1: 0,
  soil2: 0,
  dist1: 0,
  dist2: 0,
  tiltX: 0,
  tiltY: 0,
  buzzer: 0
};

// -------- ROUTES --------

// ESP32 sends sensor data
app.post("/update", (req, res) => {
  try {
    const data = req.body;

    sensorData.soil1 = data.soil1 ?? sensorData.soil1;
    sensorData.soil2 = data.soil2 ?? sensorData.soil2;
    sensorData.dist1 = data.dist1 ?? sensorData.dist1;
    sensorData.dist2 = data.dist2 ?? sensorData.dist2;
    sensorData.tiltX = data.tiltX ?? sensorData.tiltX;
    sensorData.tiltY = data.tiltY ?? sensorData.tiltY;
    sensorData.tiltZ = data.tiltZ ?? sensorData.tiltZ;

    console.log("Updated Data:", sensorData);

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// Website fetches live data
app.get("/data", (req, res) => {
  res.json(sensorData);
});

// Website button → control buzzer
app.post("/buzzer", (req, res) => {
  try {
    const state = req.body.state;

    if (state === 0 || state === 1) {
      sensorData.buzzer = state;
      console.log("Buzzer set to:", state);
      res.send("Buzzer Updated");
    } else {
      res.status(400).send("Invalid State");
    }
  } catch (err) {
    res.status(500).send("Error");
  }
});

// ESP32 reads buzzer state
app.get("/buzzer", (req, res) => {
  res.json({ buzzer: sensorData.buzzer });
});

// -------- START SERVER --------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
