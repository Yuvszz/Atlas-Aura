import {
  useEffect,
  useState,
} from "react";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import TravelerForm from "./TravelerForm";

import {
  updateCartItem,
  clearCart,
} from "../store/bookingSlice";

import {
  createBooking,
} from "../services/api";


function Checkout({
  traveler,
  setTraveler,
  onBack,
}) {

  const [bookingStatus, setBookingStatus] =
    useState("pending");

  const [bookingId, setBookingId] =
    useState(null);

  const [apiError, setApiError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // NEW:
  // Stores the confirmed booking before cart is cleared
  const [confirmedBooking, setConfirmedBooking] =
    useState(null);


  // =========================
  // REDUX CART
  // =========================

  const cart = useSelector(
    (state) => state.booking.cart
  );

  const dispatch = useDispatch();


  // =========================
  // TRAVELER COUNT
  // =========================

  const travelerCount =
    Number(traveler.travelers) || 1;


  // =========================
  // UPDATE CART TRAVELERS
  // =========================

  useEffect(() => {

    cart.forEach((item) => {

      if (
        Number(item.travelers) !==
        travelerCount
      ) {

        dispatch(
          updateCartItem({
            id: item.id,
            travelers: travelerCount,
          })
        );

      }

    });

  }, [
    travelerCount,
    cart,
    dispatch,
  ]);


  // =========================
  // PACKAGE COST
  // =========================

  const packageCost =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.travelers || 1),
      0
    );


  // =========================
  // DISCOUNT
  // =========================

  const discount =
    packageCost >= 20000
      ? packageCost * 0.10
      : 0;


  // =========================
  // AMOUNT AFTER DISCOUNT
  // =========================

  const discountedAmount =
    packageCost - discount;


  // =========================
  // TAX
  // =========================

  const tax =
    discountedAmount * 0.05;


  // =========================
  // FINAL AMOUNT
  // =========================

  const finalAmount =
    discountedAmount + tax;


  // =====================================================
  // CONFIRM BOOKING
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setApiError("");


    // =========================
    // VALIDATION
    // =========================

    if (cart.length === 0) {

      alert(
        "Please select a travel package."
      );

      return;
    }


    if (!traveler.name.trim()) {

      alert(
        "Traveler name is required."
      );

      return;
    }


    if (
      !/^[A-Za-z ]+$/.test(
        traveler.name
      )
    ) {

      alert(
        "Enter a valid traveler name."
      );

      return;
    }


    if (
      !traveler.travelers ||
      Number(traveler.travelers) < 1
    ) {

      alert(
        "Number of travelers must be at least 1."
      );

      return;
    }


    if (!traveler.email) {

      alert(
        "Email is required."
      );

      return;
    }


    if (
      !/\S+@\S+\.\S+/.test(
        traveler.email
      )
    ) {

      alert(
        "Enter a valid email address."
      );

      return;
    }


    if (!traveler.phone) {

      alert(
        "Phone number is required."
      );

      return;
    }


    if (
      !/^[0-9]{10}$/.test(
        traveler.phone
      )
    ) {

      alert(
        "Phone number must contain exactly 10 digits."
      );

      return;
    }


    const missingDate =
      cart.some(
        (item) =>
          !item.travelDate
      );


    if (missingDate) {

      alert(
        "Please select a travel date."
      );

      return;
    }


    if (!traveler.paymentMethod) {

      alert(
        "Please select a payment method."
      );

      return;
    }


    if (!traveler.cardNumber) {

      alert(
        "Card number is required."
      );

      return;
    }


    if (!traveler.expiry) {

      alert(
        "Expiry date is required."
      );

      return;
    }


    if (!traveler.cvv) {

      alert(
        "CVV is required."
      );

      return;
    }


    // =====================================================
    // CREATE BOOKING
    // =====================================================

    try {

      setLoading(true);

      setBookingStatus("processing");


      // Create booking data
      const bookingData = {

        name: traveler.name,

        email: traveler.email,

        phone: traveler.phone,

        travelers: travelerCount,

        paymentMethod:
          traveler.paymentMethod,

        packages: cart.map(
          (item) => ({
            packageId: item.id,

            packageName: item.name,

            travelDate:
              item.travelDate,

            travelers:
              Number(
                item.travelers ||
                travelerCount
              ),

            price:
              Number(
                item.price || 0
              ),

            image:
              item.image || "🌍",
          })
        ),

        packageCost:
          packageCost,

        discount:
          discount,

        tax:
          tax,

        finalAmount:
          finalAmount,
      };


      // Send POST request
      const response =
        await createBooking(
          bookingData
        );


      // =================================================
      // SAVE CONFIRMED BOOKING
      // =================================================

      setBookingId(
        response.id
      );


      // IMPORTANT:
      // Save all booking information BEFORE
      // clearing the Redux cart.

      setConfirmedBooking({
        ...bookingData,

        id: response.id,

        packages: bookingData.packages,
      });


      // Booking successful
      setBookingStatus(
        "confirmed"
      );


      // Now it is safe to clear the cart
      dispatch(
        clearCart()
      );


    } catch (error) {

      console.error(
        "Booking API Error:",
        error
      );


      setBookingStatus(
        "pending"
      );


      setApiError(
        "Unable to complete booking. Please make sure the backend server is running."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // CONFIRMED BOOKING PAGE
  // =====================================================

  if (
    bookingStatus ===
      "confirmed" &&
    confirmedBooking
  ) {

    return (

      <div className="confirmation-page">

        <div className="confirmation-card">

          <div className="success-icon">
            ✓
          </div>

          <p className="confirmation-label">
            BOOKING CONFIRMED
          </p>

          <h1>
            Booking Confirmed!
          </h1>

          <p className="confirmation-text">
            Your travel booking has been
            successfully confirmed.
          </p>

          <div className="status-badge">
            Confirmed
          </div>


          {/* =========================
              BOOKING ID
          ========================= */}

          <div className="summary-row">

            <span>
              Booking ID
            </span>

            <strong>
              #{confirmedBooking.id}
            </strong>

          </div>


          {/* =========================
              TRAVELER DETAILS
          ========================= */}

          <div className="confirmation-details">

            <div>

              <span>
                Traveler
              </span>

              <strong>
                {confirmedBooking.name}
              </strong>

            </div>


            <div>

              <span>
                Email
              </span>

              <strong>
                {confirmedBooking.email}
              </strong>

            </div>


            <div>

              <span>
                Phone
              </span>

              <strong>
                {confirmedBooking.phone}
              </strong>

            </div>


            <div>

              <span>
                Travelers
              </span>

              <strong>
                {confirmedBooking.travelers}
              </strong>

            </div>

          </div>


          {/* =========================
              BOOKED PACKAGES
          ========================= */}

          <h3>
            Booked Packages
          </h3>


          <div className="confirmed-packages">

            {confirmedBooking.packages.map(
              (item) => (

                <div
                  className="confirmed-package"
                  key={item.packageId}
                >

                  <span>
                    {item.image || "🌍"}
                  </span>


                  <div>

                    <strong>
                      {item.packageName}
                    </strong>

                    <p>
                      📅{" "}
                      {item.travelDate}
                    </p>

                    <p>
                      👥{" "}
                      {item.travelers}{" "}
                      traveler(s)
                    </p>

                  </div>

                </div>

              )
            )}

          </div>


          {/* =========================
              PACKAGE COST
          ========================= */}

          <div className="summary-row">

            <span>
              Package Cost
            </span>

            <strong>
              ₹
              {confirmedBooking.packageCost.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </strong>

          </div>


          {/* =========================
              DISCOUNT
          ========================= */}

          <div className="summary-row">

            <span>
              Discount
            </span>

            <strong>
              - ₹
              {confirmedBooking.discount.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </strong>

          </div>


          {/* =========================
              TAX
          ========================= */}

          <div className="summary-row">

            <span>
              Tax (5%)
            </span>

            <strong>
              ₹
              {confirmedBooking.tax.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </strong>

          </div>


          {/* =========================
              FINAL AMOUNT
          ========================= */}

          <div className="summary-row total-row">

            <span>
              Final Amount
            </span>

            <strong>
              ₹
              {confirmedBooking.finalAmount.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </strong>

          </div>


         <div
  style={{
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "20px",
    flexWrap: "wrap",
  }}
>

  <button
    className="confirm-button"
    onClick={() =>
      window.location.href = "/bookings"
    }
  >
    View Booking History
  </button>

  <button
    className="checkout-button"
    onClick={onBack}
  >
    Back to Packages
  </button>

</div>

        </div>

      </div>

    );

  }


  // =====================================================
  // CHECKOUT PAGE
  // =====================================================

  return (

    <div className="checkout-page">

      <div className="checkout-container">


        {/* =========================
            BACK BUTTON
        ========================= */}

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>


        {/* =========================
            HEADING
        ========================= */}

        <div className="checkout-heading">

          <p>
            COMPLETE YOUR JOURNEY
          </p>

          <h1>
            Traveler Information
          </h1>

          <span>
            Enter your details to complete
            your travel booking.
          </span>

        </div>


        <div className="checkout-grid">


          {/* =========================
              TRAVELER FORM
          ========================= */}

          <div className="traveler-form">

            <TravelerForm
              traveler={traveler}
              setTraveler={setTraveler}
            />

          </div>


          {/* =========================
              BOOKING SUMMARY
          ========================= */}

          <div className="summary-box">

            <div className="summary-heading">

              <div>

                <p>
                  BOOKING SUMMARY
                </p>

                <h2>
                  Your Trip
                </h2>

              </div>

              <span className="pending-badge">

                {loading
                  ? "Processing"
                  : "Pending"}

              </span>

            </div>


            {cart.length === 0 ? (

              <p>
                No travel package selected.
              </p>

            ) : (

              <>

                {/* =========================
                    PACKAGE DETAILS
                ========================= */}

                {cart.map((item) => (

                  <div
                    className="summary-package"
                    key={item.id}
                  >

                    <div className="summary-package-icon">

                      {item.image || "🌍"}

                    </div>


                    <div className="summary-package-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        📅{" "}
                        {item.travelDate}
                      </p>

                      <p>
                        👥{" "}
                        {item.travelers ||
                          travelerCount}{" "}
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
                          item.travelers ||
                            travelerCount
                        )
                      ).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 0,
                        }
                      )}

                    </strong>

                  </div>

                ))}


                {/* =========================
                    PACKAGE COST
                ========================= */}

                <div className="summary-row">

                  <span>
                    Package Cost
                  </span>

                  <strong>
                    ₹
                    {packageCost.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </strong>

                </div>


                {/* =========================
                    DISCOUNT
                ========================= */}

                <div className="summary-row">

                  <span>
                    Discount
                  </span>

                  <strong>
                    - ₹
                    {discount.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </strong>

                </div>


                {/* =========================
                    TAX
                ========================= */}

                <div className="summary-row">

                  <span>
                    Tax (5%)
                  </span>

                  <strong>
                    ₹
                    {tax.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </strong>

                </div>


                {/* =========================
                    FINAL AMOUNT
                ========================= */}

                <div className="summary-row total-row">

                  <span>
                    Final Amount
                  </span>

                  <strong>
                    ₹
                    {finalAmount.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </strong>

                </div>

              </>

            )}

          </div>

        </div>


        {/* =========================
            API ERROR
        ========================= */}

        {apiError && (

          <p
            style={{
              color: "red",
              textAlign: "center",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            {apiError}
          </p>

        )}


        {/* =========================
            BUTTONS
        ========================= */}

        <div className="checkout-actions">

          <button
            className="back-button"
            onClick={onBack}
            disabled={loading}
          >
            ← Back
          </button>


          <button
            className="confirm-button"
            onClick={handleSubmit}
            disabled={loading}
          >

            {loading
              ? "Booking..."
              : "Confirm Booking →"}

          </button>

        </div>


        {/* =========================
            STATUS
        ========================= */}

        <p className="booking-status">

          Status:{" "}

          <strong>
            {bookingStatus}
          </strong>

        </p>

      </div>

    </div>

  );

}


export default Checkout;