const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let sensorData = {
  soil1: 0,
  soil2: 0,
  dist1: 0,
  dist2: 0,
  tiltX: 0,
  tiltY: 0,
  buzzer: 0
};

// ESP32 sends data here
app.post("/update", (req, res) => {
  sensorData = { ...sensorData, ...req.body };
  res.send("OK");
});

// Website fetches data
app.get("/data", (req, res) => {
  res.json(sensorData);
});

// Button control
app.post("/buzzer", (req, res) => {
  sensorData.buzzer = req.body.state;
  res.send("Buzzer Updated");
});

// ESP32 reads buzzer state
app.get("/buzzer", (req, res) => {
  res.json({ buzzer: sensorData.buzzer });
});

app.listen(3000, () => console.log("Server running"));
