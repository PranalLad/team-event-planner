import React from "react";
import CreateEventForm from "../components/EventForm";
import { setTenantId } from "../services/api";

const tenantId = process.env.REACT_APP_TENANT_ID ?? "11111111-1111-1111-1111-111111111111";
setTenantId(tenantId);

export default function EventsPage() {
  const handleCreated = () => alert("Event created successfully!");

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🗓 Events</h1>
      <CreateEventForm onCreated={handleCreated} />
    </div>
  );
}
