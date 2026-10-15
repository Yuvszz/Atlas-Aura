function BookingSummary({ cart, traveler }) {
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * (Number(traveler.travelers) || 1),
    0
  );

  return (
    <div className="booking-summary">
      <h2>Booking Summary</h2>

      {cart.map((item) => (
        <div key={item.id} className="summary-item">
          <h3>{item.name}</h3>

          <p>📍 {item.destination}</p>

          <p>📅 {item.travelDate}</p>

          <p>👥 {traveler.travelers} Travelers</p>

          <strong>
            ₹{item.price.toLocaleString()}
          </strong>
        </div>
      ))}

      <div className="summary-total">
        <span>Total</span>

        <strong>
          ₹{total.toLocaleString()}
        </strong>
      </div>
    </div>
  );
}

export default BookingSummary;