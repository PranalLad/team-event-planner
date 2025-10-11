import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import ReportsPage from './pages/ReportsPage';

const App: React.FC = () => (
  <Router>
    <header style={{
      backgroundColor: "#f8f9fa", // Light gray / off-white
      color: "#333",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
      flexWrap: "wrap",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Team Event Planner – Reports Edition</h1>
      <nav style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        {["Events", "Reports"].map((item) => {
          const path = item === "Events" ? "/" : "/reports";
          return (
            <NavLink
              key={item}
              to={path}
              style={({ isActive }) => ({
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                backgroundColor: isActive ? "#007bff" : "transparent",
                color: isActive ? "#fff" : "#555",
                textDecoration: "none",
                fontWeight: isActive ? "bold" : "normal",
                transition: "all 0.2s ease",
              })}
              className="nav-link"
            >
              {item}
            </NavLink>
          );
        })}
      </nav>
    </header>

    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </main>
  </Router>
);

export default App;
