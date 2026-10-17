
import { useState } from "react";
import "./App.css";

const campusSlots = [
  { id: "A-01", type: "Car", mode: "Campus", status: "Available" },
  { id: "A-02", type: "Bike", mode: "Campus", status: "Occupied" },
  { id: "A-03", type: "Bike", mode: "Campus", status: "Available" },
];

const publicSlots = [
  { id: "B-01", type: "Car", mode: "Public", status: "Available" },
  { id: "B-02", type: "Bike", mode: "Public", status: "Occupied" },
  { id: "B-03", type: "Bike", mode: "Public", status: "Available" },
];

function App() {
  const [mode, setMode] = useState(null);

  const slots = mode === "campus" ? campusSlots : publicSlots;

  if (!mode) {
    return (
      <main className="welcome-page">
        <header className="welcome-header">
          <div className="brand">
            <span className="brand-icon">P</span>
            <span>ParkSmart</span>
          </div>
          <span className="system-label">SMART PARKING SYSTEM</span>
        </header>

        <section className="welcome-content">
          <div className="eyebrow">
            <span className="live-dot" />
            SMARTER PARKING. SIMPLER JOURNEYS.
          </div>

          <h1>
            Find your space.
            <br />
            <span>Start your journey.</span>
          </h1>

          <p className="welcome-description">
            Welcome to our AI-Enabled Smart Parking Management System.
            Select your parking mode to continue.
          </p>

          <div className="mode-grid">
            <button
              className="mode-card campus-card"
              onClick={() => setMode("campus")}
            >
              <div className="mode-icon">🎓</div>
              <span className="mode-tag">CAMPUS ACCESS</span>
              <h2>Campus Parking</h2>
              <p>
                Parking for students, faculty and campus visitors.
              </p>
              <ul>
                <li>View parking availability</li>
                <li>Campus QR or ID verification</li>
                <li>No booking or parking payment</li>
              </ul>
              <span className="mode-action">
                Enter Campus Parking <span>→</span>
              </span>
            </button>

            <button
              className="mode-card public-card"
              onClick={() => setMode("public")}
            >
              <div className="mode-icon">🚘</div>
              <span className="mode-tag">PUBLIC ACCESS</span>
              <h2>Public Parking</h2>
              <p>
                Convenient paid parking for the general public.
              </p>
              <ul>
                <li>Book an available parking slot</li>
                <li>Join the waiting queue if needed</li>
                <li>Track parking and pay at exit</li>
              </ul>
              <span className="mode-action">
                Enter Public Parking <span>→</span>
              </span>
            </button>
          </div>

          <p className="welcome-footer">
            ESP32 · Firebase · AI-Assisted Parking Management
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand">
          <span className="brand-icon">P</span>
          <span>ParkSmart</span>
        </div>

        <button className="back-button" onClick={() => setMode(null)}>
          ← Change parking mode
        </button>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-heading">
          <span className="eyebrow">
            {mode === "campus" ? "CAMPUS ACCESS" : "PUBLIC ACCESS"}
          </span>
          <h1>
            {mode === "campus" ? "Campus Parking" : "Public Parking"}
          </h1>
          <p>
            {mode === "campus"
              ? "Check campus slot status and complete the required verification."
              : "Find a parking slot, manage your parking session and payment."}
          </p>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <span>Total prototype slots</span>
            <strong>{slots.length}</strong>
          </div>
          <div className="summary-card">
            <span>Available</span>
            <strong>
              {slots.filter((slot) => slot.status === "Available").length}
            </strong>
          </div>
          <div className="summary-card">
            <span>Occupied</span>
            <strong>
              {slots.filter((slot) => slot.status === "Occupied").length}
            </strong>
          </div>
        </div>

        <section className="slots-section">
          <div className="section-heading">
            <div>
              <h2>Parking slots</h2>
              <p>Prototype preview — not live sensor data.</p>
            </div>
            <span className="prototype-label">DEMO DATA</span>
          </div>

          <div className="slots-grid">
            {slots.map((slot) => (
              <article className="slot-card" key={slot.id}>
                <div className="slot-top">
                  <span className="slot-icon">
                    {slot.type === "Car" ? "🚘" : "🏍️"}
                  </span>
                  <span
                    className={
                      slot.status === "Available"
                        ? "status available"
                        : "status occupied"
                    }
                  >
                    {slot.status}
                  </span>
                </div>
                <h3>{slot.id}</h3>
                <p>{slot.type} parking</p>

                {slot.status === "Available" &&
                  mode === "public" && (
                    <button
                      className="slot-button"
                      onClick={() =>
                        alert(
                          "Booking will be connected to the backend in the next phase."
                        )
                      }
                    >
                      Book slot
                    </button>
                  )}

                {mode === "campus" && (
                  <p className="slot-note">Campus verification required</p>
                )}
              </article>
            ))}
          </div>
        </section>

        {mode === "campus" ? (
          <section className="info-panel">
            <h2>Campus parking rules</h2>
            <p>
              Campus parking does not support slot booking or paid parking.
              Students, faculty and visitors follow the campus verification
              process. Public availability is intended for visitors.
            </p>
          </section>
        ) : (
          <section className="info-panel">
            <h2>Public parking services</h2>
            <p>
              Booking, waiting queue management, parking session tracking
              and exit payment will be connected to the existing backend.
              The final fee will be based on the parking duration and
              configured rate.
            </p>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
