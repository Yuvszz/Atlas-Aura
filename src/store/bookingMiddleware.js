const bookingMiddleware = (store) => (next) => (action) => {
  console.log("🛎️ Booking Action:", action.type);

  if (action.payload) {
    console.log("📦 Booking Data:", action.payload);
  }

  const result = next(action);

  console.log(
    "🛒 Current Booking Cart:",
    store.getState().booking.cart
  );

  return result;
};

export default bookingMiddleware;