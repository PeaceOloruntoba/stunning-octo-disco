// app/(tabs)/calendar/[id].tsx
// This file will simply redirect to the main events details page
// as the content is largely the same for event details.
// You could also duplicate/adapt EventDetailsScreen if you need
// calendar-specific details or actions here.

import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

export default function CalendarEventDetailsRedirect() {
  const { id } = useLocalSearchParams();

  // Redirect to the main events details page
  // This assumes the core event details page (app/(tabs)/events/[id].tsx)
  // is sufficient for displaying calendar event details.
  return <Redirect href={`/events/${id}`} />;
}
