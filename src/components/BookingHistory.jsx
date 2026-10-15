import { useEffect, useState } from "react";

import {
  getBookings,
  updateBooking,
  deleteBooking,
} from "../services/api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editBooking, setEditBooking] = useState(null);

  // GET BOOKING HISTORY
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBookings();

      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Failed to load booking history.");
    } finally {
      setLoading(false);
    }
  };

  // LOAD BOOKINGS
  useEffect(() => {
    fetchBookings();
  }, []);

  // START EDIT
  const handleEdit = (booking) => {
    const firstPackage = booking.packages?.[0];

    setEditingId(booking.id);

    setEditBooking({
      name: booking.name || "",
      email: booking.email || "",
      phone: booking.phone || "",

      travelers:
        booking.travelers ||
        firstPackage?.travelers ||
        1,

      travelDate:
        firstPackage?.travelDate || "",

      paymentMethod:
        booking.paymentMethod || "",

      cardNumber:
        booking.cardNumber || "",

      expiry:
        booking.expiry || "",

      cvv:
        booking.cvv || "",
    });
  };

  // HANDLE EDIT CHANGE
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditBooking((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // UPDATE BOOKING
  const handleUpdate = async (booking) => {
    if (!editBooking) {
      return;
    }

    // VALIDATE NAME
    if (!editBooking.name.trim()) {
      alert("Name is required.");
      return;
    }

    // VALIDATE EMAIL
    if (!editBooking.email.trim()) {
      alert("Email is required.");
      return;
    }

    // VALIDATE TRAVEL DATE
    if (!editBooking.travelDate) {
      alert("Please select a travel date.");
      return;
    }

    // VALIDATE TRAVELERS
    const travelerCount =
      Number(editBooking.travelers);

    if (!travelerCount || travelerCount < 1) {
      alert(
        "Number of travelers must be at least 1."
      );
      return;
    }

    try {
      // UPDATE ALL PACKAGE DETAILS
      const updatedPackages =
        (booking.packages || []).map((item) => ({
          ...item,

          travelDate:
            editBooking.travelDate,

          travelers:
            travelerCount,
        }));

      // CALCULATE PACKAGE COST
      const packageCost =
        updatedPackages.reduce(
          (total, item) =>
            total +
            Number(item.price || 0) *
              travelerCount,
          0
        );

      // KEEP OLD DISCOUNT AND TAX
      const discount =
        Number(booking.discount || 0);

      const tax =
        Number(booking.tax || 0);

      // FINAL AMOUNT
      const updatedFinalAmount =
        packageCost -
        discount +
        tax;

      // DATA SENT TO BACKEND
      const bookingData = {
        name: editBooking.name.trim(),

        email: editBooking.email.trim(),

        phone: editBooking.phone.trim(),

        travelers: travelerCount,

        paymentMethod:
          editBooking.paymentMethod,

        cardNumber:
          editBooking.cardNumber,

        expiry:
          editBooking.expiry,

        cvv:
          editBooking.cvv,

        packageCost:
          packageCost,

        discount:
          discount,

        tax:
          tax,

        finalAmount:
          updatedFinalAmount,

        packages:
          updatedPackages,
      };

      console.log(
        "PUT DATA:",
        bookingData
      );

      // SEND UPDATE REQUEST
      const updatedBooking =
        await updateBooking(
          booking.id,
          bookingData
        );

      console.log(
        "UPDATED BOOKING FROM SERVER:",
        updatedBooking
      );

      // UPDATE SCREEN
      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id
            ? updatedBooking
            : item
        )
      );

      // EXIT EDIT MODE
      setEditingId(null);
      setEditBooking(null);

      alert(
        "Booking updated successfully!"
      );

    } catch (err) {
      console.error(
        "Update booking error:",
        err
      );

      console.error(
        "Server response:",
        err.response?.data
      );

      alert(
        err.response?.data?.message ||
          "Failed to update booking."
      );
    }
  };

  // CANCEL BOOKING
  const handleCancel = async (id) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmCancel) {
      return;
    }

    try {
      await deleteBooking(id);

      setBookings((current) =>
        current.filter(
          (booking) =>
            booking.id !== id
        )
      );

      alert(
        "Booking cancelled successfully!"
      );
    } catch (err) {
      console.error(
        "Cancel booking error:",
        err
      );

      alert(
        "Failed to cancel booking."
      );
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="booking-history">
        <h1>Booking History</h1>

        <p>
          Loading bookings...
        </p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="booking-history">
        <h1>Booking History</h1>

        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>

        <button
          className="checkout-button"
          onClick={fetchBookings}
        >
          Try Again
        </button>
      </div>
    );
  }

  // BOOKING HISTORY
  return (
    <div className="booking-history">

      <div className="booking-history-header">

        <p>
          YOUR JOURNEY
        </p>

        <h1>
          Booking History
        </h1>

        <span>
          View and manage your travel bookings.
        </span>

      </div>

      {bookings.length === 0 ? (

        <div className="booking-empty">

          <h2>
            No Bookings Yet
          </h2>

          <p>
            Your confirmed bookings will
            appear here.
          </p>

        </div>

      ) : (

        <div className="booking-list">

          {bookings.map((booking) => {

            const isEditing =
              editingId === booking.id;

            const editedTravelerCount =
              Number(
                editBooking?.travelers ||
                  booking.travelers ||
                  1
              );

            const editedFinalAmount =
              (booking.packages || []).reduce(
                (total, item) =>
                  total +
                  Number(item.price || 0) *
                    editedTravelerCount,
                0
              );

            return (

              <div
                className="booking-card"
                key={booking.id}
              >

                {/* BOOKING HEADER */}

                <div className="booking-card-header">

                  <div>

                    <p>
                      BOOKING ID
                    </p>

                    <h2>
                      #{booking.id}
                    </h2>

                  </div>

                  <span className="status-badge">

                    {booking.status ||
                      "Confirmed"}

                  </span>

                </div>

                {/* TRAVELER DETAILS */}

                <h3>
                  Traveler Details
                </h3>

                {isEditing ? (

                  <div className="booking-info">

                    <label>
                      Full Name

                      <input
                        type="text"
                        name="name"
                        value={
                          editBooking?.name ||
                          ""
                        }
                        onChange={
                          handleEditChange
                        }
                        placeholder="Full name"
                      />
                    </label>

                    <label>
                      Email

                      <input
                        type="email"
                        name="email"
                        value={
                          editBooking?.email ||
                          ""
                        }
                        onChange={
                          handleEditChange
                        }
                        placeholder="Email address"
                      />
                    </label>

                    <label>
                      Phone

                      <input
                        type="tel"
                        name="phone"
                        value={
                          editBooking?.phone ||
                          ""
                        }
                        onChange={
                          handleEditChange
                        }
                        placeholder="Phone number"
                      />
                    </label>

                    <label>
                      Number of Travelers

                      <input
                        type="number"
                        name="travelers"
                        min="1"
                        value={
                          editBooking?.travelers ||
                          1
                        }
                        onChange={
                          handleEditChange
                        }
                      />
                    </label>

                  </div>

                ) : (

                  <div className="booking-info">

                    <div>
                      <span>
                        Traveler
                      </span>

                      <strong>
                        {booking.name}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Email
                      </span>

                      <strong>
                        {booking.email}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Phone
                      </span>

                      <strong>
                        {booking.phone ||
                          "Not provided"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Travelers
                      </span>

                      <strong>
                        {booking.travelers}
                      </strong>
                    </div>

                  </div>

                )}

                {/* PAYMENT DETAILS */}

                {isEditing && (

                  <>
                    <h3>
                      💳 Payment Details
                    </h3>

                    <div className="booking-info">

                      <label>
                        Payment Method

                        <select
                          name="paymentMethod"
                          value={
                            editBooking?.paymentMethod ||
                            ""
                          }
                          onChange={
                            handleEditChange
                          }
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

                      <label>
                        Card Number

                        <input
                          type="text"
                          name="cardNumber"
                          value={
                            editBooking?.cardNumber ||
                            ""
                          }
                          onChange={
                            handleEditChange
                          }
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />

                      </label>

                      <label>
                        Expiry Date

                        <input
                          type="text"
                          name="expiry"
                          value={
                            editBooking?.expiry ||
                            ""
                          }
                          onChange={
                            handleEditChange
                          }
                          placeholder="MM/YY"
                        />

                      </label>

                      <label>
                        CVV

                        <input
                          type="password"
                          name="cvv"
                          value={
                            editBooking?.cvv ||
                            ""
                          }
                          onChange={
                            handleEditChange
                          }
                          placeholder="123"
                          maxLength="3"
                        />

                      </label>

                    </div>
                  </>
                )}

                {/* TRAVEL PACKAGES */}

                <h3>
                  Travel Packages
                </h3>

                {(booking.packages || []).map(
                  (item, index) => (

                    <div
                      className="booking-package"
                      key={index}
                    >

                      <div>

                        <strong>
                          {item.packageName}
                        </strong>

                        {isEditing ? (

                          <label>
                            Travel Date

                            <input
                              type="date"
                              name="travelDate"
                              value={
                                editBooking?.travelDate ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                            />
                          </label>

                        ) : (

                          <p>
                            📅{" "}
                            {item.travelDate}
                          </p>

                        )}

                        <p>
                          👥{" "}
                          {isEditing
                            ? editedTravelerCount
                            : item.travelers}{" "}
                          traveler(s)
                        </p>

                      </div>

                      <strong>

                        ₹
                        {(
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            isEditing
                              ? editedTravelerCount
                              : item.travelers || 1
                          )
                        ).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}

                      </strong>

                    </div>

                  )
                )}

                {/* TOTAL */}

                <div className="booking-total">

                  <span>
                    Final Amount
                  </span>

                  <strong>

                    ₹
                    {(
                      isEditing
                        ? editedFinalAmount
                        : Number(
                            booking.finalAmount ||
                              0
                          )
                    ).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}

                  </strong>

                </div>

                {/* ACTIONS */}

                <div className="booking-actions">

                  {isEditing ? (

                    <>

                      <button
                        type="button"
                        className="confirm-button"
                        onClick={() =>
                          handleUpdate(
                            booking
                          )
                        }
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        className="back-button"
                        onClick={() => {

                          setEditingId(null);

                          setEditBooking(null);

                        }}
                      >
                        Cancel Edit
                      </button>

                    </>

                  ) : (

                    <button
                      type="button"
                      className="confirm-button"
                      onClick={() =>
                        handleEdit(
                          booking
                        )
                      }
                    >
                      Update Booking
                    </button>

                  )}

                  <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                      handleCancel(
                        booking.id
                      )
                    }
                  >
                    Cancel Booking
                  </button>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default BookingHistory;