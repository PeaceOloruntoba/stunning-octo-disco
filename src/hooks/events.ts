import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { User } from "firebase/auth";
import { UserProfile } from "./userProfile";

export interface Event {
  id: string;
  clubName: string;
  eventType: string;
  price: string;
  duration: string;
  distance: string;
  rating: number;
  reviewCount: number;
  image: string;
  firstDrinkFree: boolean;
  locationName: string;
  latitude: number;
  longitude: number;
  conditions: string[];
  organizerId: string;
  description: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Organizer {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  profilePic: string;
  reviews: Review[];
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const eventsCollectionRef = collection(db, "events");

    const unsubscribe = onSnapshot(
      eventsCollectionRef,
      (snapshot) => {
        const fetchedEvents: Event[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(fetchedEvents);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching events:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  return { events, loading, error };
};

export const useEvent = (eventId: string | string[] | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId || typeof eventId !== "string") {
      setEvent(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const eventDocRef = doc(db, "events", eventId);

    const unsubscribe = onSnapshot(
      eventDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
        } else {
          setEvent(null);
          setError("Event not found.");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching event:", err);
      }
    );

    return () => unsubscribe();
  }, [eventId]);

  return { event, loading, error };
};

export const useOrganizer = (organizerId: string | string[] | undefined) => {
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizerId || typeof organizerId !== "string") {
      setOrganizer(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const organizerDocRef = doc(db, "organizers", organizerId);

    const unsubscribe = onSnapshot(
      organizerDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setOrganizer({ id: docSnap.id, ...docSnap.data() } as Organizer);
        } else {
          setOrganizer(null);
          setError("Organizer not found.");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching organizer:", err);
      }
    );

    return () => unsubscribe();
  }, [organizerId]);

  return { organizer, loading, error };
};

export const useFavorites = (user: User | null) => {
  const [favoriteEventIds, setFavoriteEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setFavoriteEventIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const userDocRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as UserProfile;
          setFavoriteEventIds(userData.favoriteEventIds || []);
        } else {
          setFavoriteEventIds([]);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching user favorites:", err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const toggleFavorite = async (eventId: string) => {
    if (!user) {
      setError("User not logged in to manage favorites.");
      return false;
    }
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const isCurrentlyFavorite = favoriteEventIds.includes(eventId);

      if (isCurrentlyFavorite) {
        await updateDoc(userDocRef, {
          favoriteEventIds: arrayRemove(eventId),
        });
        console.log(`Removed ${eventId} from favorites.`);
      } else {
        await updateDoc(userDocRef, {
          favoriteEventIds: arrayUnion(eventId),
        });
        console.log(`Added ${eventId} to favorites.`);
      }
      setError(null);
      return true;
    } catch (err) {
      setError((err as Error).message);
      console.error("Error toggling favorite:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { favoriteEventIds, loading, error, toggleFavorite };
};

export const useAddReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addReview = async (organizerId: string, review: Omit<Review, "id">) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const organizerRef = doc(db, "organizers", organizerId);

      const reviewId = doc(collection(db, "reviews")).id;

      const newReview: Review = {
        id: reviewId,
        ...review,
        timestamp: new Date().toISOString(),
      };

      await updateDoc(organizerRef, {
        reviews: arrayUnion(newReview),
      });

      setSuccess(true);
      console.log("Review added successfully:", newReview);
      return true;
    } catch (err) {
      setError((err as Error).message);
      console.error("Error adding review:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addReview, loading, error, success };
};
