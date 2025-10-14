import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import ReportsPage from './pages/ReportsPage';
import BoldReportsPage from './pages/BoldReportsPage';
import BoldReportsPageNew from "./components/ReportViewerNew";

const navItems = [
  { name: 'Events', path: '/' },
  { name: 'Reports', path: '/reports' },
  // { name: 'Bold Reports', path: '/BoldReportsPage' },
  { name: 'Reports View', path: '/BoldReportsPageNew' },
];

const App: React.FC = () => (
  <Router>
    <header style={{
      backgroundColor: "#f8f9fa",
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
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              backgroundColor: isActive ? "#007bff" : "transparent",
              color: isActive ? "#fff" : "#555",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
              transition: "all 0.2s ease",
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </header>

    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        {/* <Route path="/BoldReportsPage" element={<BoldReportsPage />} /> */}
        <Route path="/BoldReportsPageNew" element={<BoldReportsPageNew />} />
      </Routes>
    </main>
  </Router>
);

export default App;
