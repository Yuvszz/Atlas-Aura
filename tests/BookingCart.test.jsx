import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import BookingCart from "../src/components/BookingCart";
import bookingReducer from "../src/store/bookingSlice";

function renderBookingCart(cart = []) {
  const store = configureStore({
    reducer: {
      booking: bookingReducer,
    },
    preloadedState: {
      booking: {
        cart,
      },
    },
  });

  const onRemove = jest.fn();
  const onClose = jest.fn();
  const onCheckout = jest.fn();

  render(
    <Provider store={store}>
      <BookingCart
        onRemove={onRemove}
        onClose={onClose}
        onCheckout={onCheckout}
      />
    </Provider>
  );

  return {
    store,
    onRemove,
    onClose,
    onCheckout,
  };
}

describe("BookingCart", () => {

  test("shows empty cart message when there are no bookings", () => {
    renderBookingCart([]);

    expect(
      screen.getByText("Your cart is empty")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Add a journey to start planning."
      )
    ).toBeInTheDocument();
  });


  test("displays booking details", () => {
    const cart = [
      {
        id: 1,
        name: "Paris Escape",
        emoji: "🗼",
        price: 50000,
        travelers: 2,
        travelDate: "2026-12-20",
      },
    ];

    renderBookingCart(cart);

    expect(
      screen.getByText("Paris Escape")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/2026-12-20/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/2\s*travelers/)
    ).toBeInTheDocument();
  });


  test("calculates total cost correctly", () => {
    const cart = [
      {
        id: 1,
        name: "Paris Escape",
        emoji: "🗼",
        price: 50000,
        travelers: 2,
        travelDate: "2026-12-20",
      },
      {
        id: 2,
        name: "Bali Adventure",
        emoji: "🌴",
        price: 30000,
        travelers: 1,
        travelDate: "2027-01-10",
      },
    ];

    renderBookingCart(cart);

    expect(
      screen.getByText("₹130,000")
    ).toBeInTheDocument();
  });


  test("removes a booking from the cart", async () => {
    const user = userEvent.setup();

    const cart = [
      {
        id: 1,
        name: "Paris Escape",
        emoji: "🗼",
        price: 50000,
        travelers: 2,
        travelDate: "2026-12-20",
      },
    ];

    const { onRemove, store } =
      renderBookingCart(cart);

    const removeButton =
      document.querySelector(".remove-button");

    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledWith(1);

    expect(
      store.getState().booking.cart
    ).toHaveLength(0);
  });


  test("calls checkout when checkout button is clicked", async () => {
    const user = userEvent.setup();

    const cart = [
      {
        id: 1,
        name: "Paris Escape",
        emoji: "🗼",
        price: 50000,
        travelers: 1,
        travelDate: "2026-12-20",
      },
    ];

    const { onCheckout } =
      renderBookingCart(cart);

    const checkoutButton =
      screen.getByRole("button", {
        name: /Continue to checkout/i,
      });

    await user.click(checkoutButton);

    expect(onCheckout).toHaveBeenCalled();
  });


  test("calls close when close button is clicked", async () => {
    const user = userEvent.setup();

    const cart = [
      {
        id: 1,
        name: "Paris Escape",
        emoji: "🗼",
        price: 50000,
        travelers: 1,
        travelDate: "2026-12-20",
      },
    ];

    const { onClose } =
      renderBookingCart(cart);

    const closeButton =
      screen.getByRole("button", {
        name: /Close booking cart/i,
      });

    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

});