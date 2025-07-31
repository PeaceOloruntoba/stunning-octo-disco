import { useState } from "react";
import { Alert } from "react-native";
import { usePaymentSheet } from "@stripe/stripe-react-native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const useStripePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const handlePayment = async (
    event: { price: string; clubName: string; id: string },
    user: { uid: string } | null,
    addParticipatedEvent: (
      eventId: string,
      status: string,
      paymentDetails: any
    ) => Promise<boolean>,
    participateError: string | null
  ) => {
    if (!user) {
      Alert.alert(
        "Anmeldung erforderlich",
        "Bitte melden Sie sich an, um an Events teilzunehmen."
      );
      console.log("[Stripe] User not authenticated");
      return false;
    }

    if (hasPaid) {
      Alert.alert("Fehler", "Du hast bereits für dieses Event bezahlt.");
      console.log("[Stripe] Payment already exists for event", event.id);
      return false;
    }

    if (!process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY) {
      Alert.alert("Fehler", "Zahlungskonfiguration fehlt.");
      console.log("[Stripe] Stripe secret key missing from environment");
      return false;
    }

    setPaymentLoading(true);
    try {
      console.log("[Stripe] Initializing payment for event", event.id);
      const amount = Math.round(
        parseFloat(event.price.replace(/[^0-9.]/g, "")) * 100
      );
      console.log("[Stripe] Calculated amount:", amount, "cents");

      console.log("[Stripe] Creating Payment Intent");
      const params = new URLSearchParams();
      params.append("amount", amount.toString());
      params.append("currency", "eur");
      params.append("payment_method_types[]", "card");

      const response = await fetch(
        "https://api.stripe.com/v1/payment_intents",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY}`, // INSECURE: FOR EDUCATIONAL PURPOSES ONLY
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      const paymentIntentData = await response.json();
      console.log("[Stripe] Payment Intent response:", paymentIntentData);

      if (paymentIntentData.error) {
        console.log(
          "[Stripe] Payment Intent creation failed:",
          paymentIntentData.error.message
        );
        Alert.alert(
          "Fehler",
          `Zahlungserstellung fehlgeschlagen: ${paymentIntentData.error.message}`
        );
        return false;
      }

      const { client_secret: clientSecret } = paymentIntentData;

      if (!clientSecret) {
        console.log(
          "[Stripe] Failed to retrieve client_secret from Payment Intent"
        );
        Alert.alert("Fehler", "Zahlung konnte nicht initialisiert werden.");
        return false;
      }

      console.log("[Stripe] Initializing PaymentSheet with clientSecret");
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Eventura",
        returnURL: "eventura://stripe-redirect",
      });

      if (initError) {
        console.log(
          "[Stripe] PaymentSheet initialization failed:",
          initError.message
        );
        Alert.alert(
          "Fehler",
          `Zahlung initialisieren fehlgeschlagen: ${initError.message}`
        );
        return false;
      }

      console.log("[Stripe] Presenting PaymentSheet");
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.log(
          "[Stripe] PaymentSheet presentation failed:",
          paymentError.message
        );
        Alert.alert(
          "Fehler",
          `Zahlung fehlgeschlagen: ${paymentError.message}`
        );
        return false;
      }

      console.log(
        "[Stripe] Payment succeeded, storing payment details in Firebase"
      );
      const paymentDocRef = doc(db, "payments", clientSecret);
      await setDoc(paymentDocRef, {
        paymentId: clientSecret,
        userId: user.uid,
        eventId: event.id,
        amount: amount / 100,
        currency: "eur",
        status: "succeeded",
        timestamp: new Date().toISOString(),
      });
      console.log("[Firebase] Payment stored with ID:", clientSecret);

      console.log(
        "[Firebase] Adding event",
        event.id,
        "to participated events"
      );
      const success = await addParticipatedEvent(event.id, "upcoming", {
        paymentId: clientSecret,
        amount: amount / 100,
        currency: "eur",
        status: "succeeded",
      });

      if (success) {
        console.log(
          "[Firebase] Event",
          event.id,
          "added to participated events"
        );
        Alert.alert(
          "Erfolg",
          "Du nimmst jetzt an diesem Event teil! Es wurde zu deinem Kalender hinzugefügt."
        );
        setHasPaid(true);
        return true;
      } else {
        console.log(
          "[Firebase] Failed to add event to participated events:",
          participateError
        );
        Alert.alert(
          "Fehler",
          participateError || "Teilnahme konnte nicht hinzugefügt werden."
        );
        return false;
      }
    } catch (err) {
      console.log("[Stripe] Payment process failed:", (err as Error).message);
      Alert.alert(
        "Fehler",
        `Zahlungsprozess fehlgeschlagen: ${(err as Error).message}`
      );
      return false;
    } finally {
      setPaymentLoading(false);
      console.log("[Stripe] Payment flow completed");
    }
  };

  return { handlePayment, paymentLoading, hasPaid };
};
