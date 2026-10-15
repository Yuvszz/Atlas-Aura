import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TravelerForm from "../src/components/TravelerForm";

describe("TravelerForm", () => {
  const traveler = {
    name: "",
    travelers: 1,
    email: "",
    phone: "",
    paymentMethod: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  };

  test("renders traveler form fields", () => {
    const setTraveler = jest.fn();

    render(
      <TravelerForm
        traveler={traveler}
        setTraveler={setTraveler}
      />
    );

    expect(
      screen.getByText("Traveler Information")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter full name")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("example@email.com")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("10 digit phone number")
    ).toBeInTheDocument();
  });

  test("updates traveler name", async () => {
    const user = userEvent.setup();
    const setTraveler = jest.fn();

    render(
      <TravelerForm
        traveler={traveler}
        setTraveler={setTraveler}
      />
    );

    const nameInput =
      screen.getByPlaceholderText("Enter full name");

    await user.type(nameInput, "Yuva");

    expect(setTraveler).toHaveBeenCalled();

    expect(
      setTraveler.mock.calls.some(
        (call) => call[0].name === "Y"
      )
    ).toBe(true);

    expect(
      setTraveler.mock.calls.some(
        (call) => call[0].name === "u"
      )
    ).toBe(true);

    expect(
      setTraveler.mock.calls.some(
        (call) => call[0].name === "v"
      )
    ).toBe(true);

    expect(
      setTraveler.mock.calls.some(
        (call) => call[0].name === "a"
      )
    ).toBe(true);
  });

  test("updates number of travelers", async () => {
    const user = userEvent.setup();
    const setTraveler = jest.fn();

    render(
      <TravelerForm
        traveler={traveler}
        setTraveler={setTraveler}
      />
    );

    const travelerInput =
      screen.getByDisplayValue("1");

    await user.clear(travelerInput);
    await user.type(travelerInput, "3");

    expect(setTraveler).toHaveBeenCalled();
  });

  test("updates email and phone number", async () => {
    const user = userEvent.setup();
    const setTraveler = jest.fn();

    render(
      <TravelerForm
        traveler={traveler}
        setTraveler={setTraveler}
      />
    );

    const emailInput =
      screen.getByPlaceholderText("example@email.com");

    const phoneInput =
      screen.getByPlaceholderText(
        "10 digit phone number"
      );

    await user.type(
      emailInput,
      "yuva@gmail.com"
    );

    await user.type(
      phoneInput,
      "9876543210"
    );

    expect(setTraveler).toHaveBeenCalled();
  });

  test("selects payment method", async () => {
    const user = userEvent.setup();
    const setTraveler = jest.fn();

    render(
      <TravelerForm
        traveler={traveler}
        setTraveler={setTraveler}
      />
    );

    const paymentSelect =
      screen.getByRole("combobox");

    await user.selectOptions(
      paymentSelect,
      "upi"
    );

    expect(
      setTraveler
    ).toHaveBeenLastCalledWith({
      ...traveler,
      paymentMethod: "upi",
    });
  });

  test("updates card details", async () => {
    const user = userEvent.setup();
    const setTraveler = jest.fn();

    render(
      <TravelerForm
        traveler={traveler}
        setTraveler={setTraveler}
      />
    );

    const cardInput =
      screen.getByPlaceholderText(
        "1234 5678 9012 3456"
      );

    const expiryInput =
      screen.getByPlaceholderText("MM/YY");

    const cvvInput =
      screen.getByPlaceholderText("123");

    await user.type(
      cardInput,
      "1234567890123456"
    );

    await user.type(
      expiryInput,
      "12/28"
    );

    await user.type(
      cvvInput,
      "123"
    );

    expect(setTraveler).toHaveBeenCalled();
  });
});