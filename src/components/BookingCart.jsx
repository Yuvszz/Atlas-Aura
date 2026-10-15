import { useSelector, useDispatch } from "react-redux";

import { removeFromCart } from "../store/bookingSlice";


function BookingCart({
  onRemove,
  onClose,
  onCheckout,
}) {

  // =========================
  // GET CART FROM REDUX
  // =========================

  const cart = useSelector(
    (state) => state.booking.cart
  );

  const dispatch = useDispatch();


  // =========================
  // CALCULATE TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.travelers || 1),
    0
  );


  // =========================
  // REMOVE ITEM
  // =========================

  const handleRemove = (id) => {

    dispatch(
      removeFromCart(id)
    );

    if (onRemove) {
      onRemove(id);
    }
  };


  return (
    <div
      className="cart-overlay"
      role="presentation"
    >

      <div
        className="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-cart-title"
      >


        {/* =========================
            CART HEADER
        ========================= */}

        <div className="cart-header">

          <div>

            <p>
              YOUR JOURNEY
            </p>

            <h2 id="booking-cart-title">
              Booking Cart
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking cart"
          >
            ✕
          </button>

        </div>


        {/* =========================
            EMPTY CART
        ========================= */}

        {cart.length === 0 ? (

          <div className="empty-cart">

            <span
              role="img"
              aria-label="Travel luggage"
            >
              🧳
            </span>

            <h3>
              Your cart is empty
            </h3>

            <p>
              Add a journey to start planning.
            </p>

          </div>

        ) : (

          <>


            {/* =========================
                CART ITEMS
            ========================= */}

            <div
              className="cart-items"
              aria-label="Selected travel packages"
            >

              {cart.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >


                  {/* PACKAGE EMOJI */}

                  <span
                    className="cart-emoji"
                    role="img"
                    aria-label={`${item.name} travel`}
                  >
                    {item.emoji}
                  </span>


                  {/* PACKAGE DETAILS */}

                  <div>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      📅{" "}
                      <span>
                        {item.travelDate ||
                          "Date not selected"}
                      </span>
                    </p>

                    <p>
                      👥{" "}
                      {item.travelers || 1}
                      {" "}
                      traveler
                      {(item.travelers || 1) > 1
                        ? "s"
                        : ""}
                    </p>

                    <strong>
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.travelers || 1)
                      ).toLocaleString()}
                    </strong>

                  </div>


                  {/* REMOVE BUTTON */}

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      handleRemove(item.id)
                    }
                    aria-label={`Remove ${item.name} from booking cart`}
                  >
                    ✕
                  </button>


                </div>

              ))}

            </div>


            {/* =========================
                CART TOTAL
            ========================= */}

            <div
              className="cart-total"
              aria-label={`Total booking amount ₹${total.toLocaleString()}`}
            >

              <span>
                Total
              </span>

              <strong>
                ₹{total.toLocaleString()}
              </strong>

            </div>


            {/* =========================
                CHECKOUT
            ========================= */}

            <button
              type="button"
              className="checkout-button"
              onClick={onCheckout}
              aria-label="Continue to checkout"
            >
              Continue to Checkout →
            </button>


          </>

        )}

      </div>

    </div>
  );
}


export default BookingCart;