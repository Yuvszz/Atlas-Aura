function TravelerForm({
  traveler,
  setTraveler,
}) {

  const handleChange = (e) => {

    setTraveler({
      ...traveler,
      [e.target.name]: e.target.value,
    });

  };

  return (

    <div className="traveler-form">

      <h2>
        Traveler Information
      </h2>

      <p className="form-subtitle">
        Enter your details before confirming
        the booking.
      </p>

      <div className="form-grid">

        {/* NAME */}

        <label>

          Full Name

          <input
            type="text"
            name="name"
            value={traveler.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />

        </label>

        {/* TRAVELERS */}

        <label>

          Number of Travelers

          <input
            type="number"
            name="travelers"
            min="1"
            value={traveler.travelers}
            onChange={handleChange}
          />

        </label>

        {/* EMAIL */}

        <label>

          Email Address

          <input
            type="email"
            name="email"
            value={traveler.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />

        </label>

        {/* PHONE */}

        <label>

          Phone Number

          <input
            type="tel"
            name="phone"
            value={traveler.phone}
            onChange={handleChange}
            placeholder="10 digit phone number"
          />

        </label>

      </div>

      {/* PAYMENT */}

      <h3 className="form-section-title">
        💳 Payment Details
      </h3>

      <div className="form-grid">

        {/* PAYMENT METHOD */}

        <label>

          Payment Method

          <select
            name="paymentMethod"
            value={traveler.paymentMethod}
            onChange={handleChange}
          >

            <option value="">
              Select payment method
            </option>

            <option value="card">
              Credit / Debit Card
            </option>

            <option value="upi">
              UPI
            </option>

            <option value="netbanking">
              Net Banking
            </option>

          </select>

        </label>

        {/* CARD NUMBER */}

        <label className="full-width">

          Card Number

          <input
            type="text"
            name="cardNumber"
            value={traveler.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
          />

        </label>

        {/* EXPIRY */}

        <label>

          Expiry Date

          <input
            type="text"
            name="expiry"
            value={traveler.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
          />

        </label>

        {/* CVV */}

        <label>

          CVV

          <input
            type="password"
            name="cvv"
            value={traveler.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="3"
          />

        </label>

      </div>

    </div>

  );
}

export default TravelerForm;