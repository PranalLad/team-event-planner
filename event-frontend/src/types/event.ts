// frontend/src/types/event.ts
export interface Attendee {
  name: string;
  email: string;
}

export interface EventPayload {
  name: string;
  venue: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  attendees: Attendee[];
}

export interface CreateEventFormProps {
  onCreated?: () => void;
}
