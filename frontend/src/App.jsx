
import { useState } from "react";
import "./App.css";

// Temporary campus slot data; later connect to the backend/Firebase.
const slots = [
  { id: "A-01", type: "Car", status: "Available" },
  { id: "A-02", type: "Bike", status: "Occupied" },
  { id: "A-03", type: "Bike", status: "Available" },
];

function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState("");

  // Home screen: select a parking mode.
  if (page === "home") {
    return (
      <main className="container">
        <h1>ParkSmart</h1>
        <p>AI-Enabled Smart Parking Management System</p>
        <h2>Select Parking Mode</h2>

        <div className="cards">
          <button onClick={() => setPage("roles")}>
            <h2>🎓 Campus Parking</h2>
            <p>For students, faculty and visitors</p>
            <strong>Get Started →</strong>
          </button>

          <button disabled>
            <h2>🚘 Public Parking</h2>
            <p>Booking, queue and payment</p>
            <strong>In Progress</strong>
          </button>
        </div>
      </main>
    );
  }

  // Campus screen: choose the user role.
  if (page === "roles") {
    return (
      <main className="container">
        <button className="back" onClick={() => setPage("home")}>
          ← Back
        </button>

        <h1>Campus Parking</h1>
        <p>Select your role to continue.</p>

        <div className="cards">
          {["Student", "Faculty", "Visitor"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setRole(item);
                setPage("dashboard");
              }}
            >
              <h2>{item}</h2>
              <strong>Continue →</strong>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // Campus dashboard: display slot information.
  return (
    <main className="container">
      <button className="back" onClick={() => setPage("roles")}>
        ← Change Role
      </button>

      <h1>Campus Parking</h1>
      <p>Welcome, {role}</p>
      <p className="notice">
        Demo data only — login and verification are not connected yet.
      </p>

      <div className="stats">
        <div>Total Slots: {slots.length}</div>
        <div>
          Available: {slots.filter((s) => s.status === "Available").length}
        </div>
        <div>
          Occupied: {slots.filter((s) => s.status === "Occupied").length}
        </div>
      </div>

      <h2>Campus Parking Slots</h2>

      <div className="cards">
        {slots.map((slot) => (
          <div className="slot" key={slot.id}>
            <h3>{slot.id}</h3>
            <p>{slot.type} Parking</p>
            <span className={slot.status === "Available" ? "available" : "occupied"}>
              {slot.status}
            </span>
          </div>
        ))}
      </div>

      <p className="notice">
        Campus parking does not require booking or payment.
      </p>
    </main>
  );
}

export default App;
