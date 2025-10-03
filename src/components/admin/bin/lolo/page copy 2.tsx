import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;

// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { createPaymentIntent } from "./payment";

// // Charger Stripe avec la clé publique
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
// );

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     setError(null);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: "http://localhost:3000/success", // Remplace par ton URL
//       },
//     });

//     if (error) {
//       setError(error.message || "Une erreur est survenue");
//     } else {
//       console.log("Paiement en cours de traitement...");
//     }

//     setLoading(false);
//   };

//   //   const handleSubmit = async (event: React.FormEvent) => {
//   //     event.preventDefault();
//   //     if (!stripe || !elements) return;

//   //     setLoading(true);
//   //     setError(null);

//   //     const { error, paymentIntent } = await stripe.confirmPayment({
//   //       elements,
//   //       confirmParams: {
//   //         return_url: "http://localhost:3000/success", // Remplace par ton URL
//   //       },
//   //     });

//   //     if (error) {
//   //       setError(error.message || "Une erreur est survenue");
//   //     } else {
//   //       console.log("Paiement réussi:", paymentIntent);
//   //     }

//   //     setLoading(false);
//   //   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <PaymentElement />
//       <button type="submit" disabled={!stripe || loading}>
//         {loading ? "Paiement en cours..." : "Payer"}
//       </button>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </form>
//   );
// };

// const CheckoutPage = () => {
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   console.log("🚀 ~ CheckoutPage ~ clientSecret:", clientSecret)

//   useEffect(() => {
//     createPaymentIntent().then((data) => {
//       if (data.clientSecret) {
//         setClientSecret(data.clientSecret);
//       }
//     });
//   }, []);

//   if (!clientSecret) return <p>Chargement...</p>;

//   return (
//     <Elements stripe={stripePromise} options={{ clientSecret }}>
//       <h1>Checkout</h1>
//       <CheckoutForm />
//     </Elements>
//   );
// };

// export default CheckoutPage;
