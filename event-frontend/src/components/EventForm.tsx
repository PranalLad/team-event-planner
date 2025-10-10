import React, { useState } from "react";
import api from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../EventForm.css"; // import the custom CSS

export interface Attendee {
  name: string;
  email: string;
}

interface CreateEventFormProps {
  onCreated?: () => void;
}

export default function CreateEventForm({ onCreated }: CreateEventFormProps) {
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addAttendee = () => setAttendees(prev => [...prev, { name: "", email: "" }]);
  const updateAttendee = (i: number, field: keyof Attendee, value: string) =>
    setAttendees(prev => prev.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) return setError("Please select start and end date/time");

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await api.post("/api/Events", {
        name,
        venue,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        attendees,
      });

      setMessage("✅ Event created successfully!");
      setName(""); setVenue(""); setStart(null); setEnd(null); setAttendees([]);
      onCreated?.();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <h2 className="form-title">➕ Create Event</h2>

      {message && <p className="form-message success">{message}</p>}
      {error && <p className="form-message error">{error}</p>}

      <form onSubmit={submit} className="event-form">
        <input
          placeholder="Event Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="form-input"
        />

        <div className="date-picker-row">
          <div className="date-picker-wrapper">
            <label>Start Date & Time</label>
            <DatePicker
              selected={start}
              onChange={(date: Date | null) => date && setStart(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select start date & time"
              required
              className="form-input datepicker-input"
            />
          </div>

          <div className="date-picker-wrapper">
            <label>End Date & Time</label>
            <DatePicker
              selected={end}
              onChange={(date: Date | null) => date && setEnd(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select end date & time"
              required
              className="form-input datepicker-input"
            />
          </div>
        </div>

        <input
          placeholder="Venue"
          value={venue}
          onChange={e => setVenue(e.target.value)}
          required
          className="form-input"
        />

        <div>
          <h3>Attendees</h3>
          {attendees.map((a, i) => (
            <div key={i} className="attendee-row">
              <input
                placeholder="Name"
                value={a.name}
                onChange={e => updateAttendee(i, "name", e.target.value)}
                required
                className="form-input attendee-input"
              />
              <input
                placeholder="Email"
                type="email"
                value={a.email}
                onChange={e => updateAttendee(i, "email", e.target.value)}
                required
                className="form-input attendee-input"
              />
            </div>
          ))}
          <button type="button" onClick={addAttendee} className="btn-add-attendee">
            + Add Attendee
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
