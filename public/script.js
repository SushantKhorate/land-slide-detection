let buzzerState = 0;

// -------- LOAD DATA --------
async function loadData() {
  try {
    const res = await fetch("/data");
    const data = await res.json();

    document.getElementById("soil1").innerText = data.soil1;
    document.getElementById("soil2").innerText = data.soil2;

    document.getElementById("dist1").innerText = data.dist1;
    document.getElementById("dist2").innerText = data.dist2;

    document.getElementById("tiltX").innerText = data.tiltX;
    document.getElementById("tiltY").innerText = data.tiltY;
    document.getElementById("tiltZ").innerText = data.tiltZ;

    buzzerState = data.buzzer;
    updateButton();

  } catch (err) {
    console.log("Error:", err);
  }
}

// -------- TOGGLE BUZZER --------
async function toggleBuzzer() {
  buzzerState = buzzerState === 1 ? 0 : 1;

  await fetch("/buzzer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ state: buzzerState })
  });

  updateButton();
}

// -------- BUTTON UI --------
function updateButton() {
  const btn = document.getElementById("buzzerBtn");

  if (buzzerState === 1) {
    btn.innerText = "Buzzer ON 🔴";
    btn.style.backgroundColor = "red";
    btn.style.color = "white";
  } else {
    btn.innerText = "Buzzer OFF 🟢";
    btn.style.backgroundColor = "green";
    btn.style.color = "white";
  }
}

// -------- AUTO REFRESH --------
async function init() {
  try {
    // Get buzzer state first
    const res = await fetch("/buzzer");
    const data = await res.json();

    buzzerState = data.buzzer;
    updateButton();

  } catch (err) {
    console.log("Init error:", err);
  }

  // Then start normal updates
  loadData();
  setInterval(loadData, 1000);
}

init();
