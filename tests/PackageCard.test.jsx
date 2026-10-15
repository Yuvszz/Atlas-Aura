import { render, screen, fireEvent } from "@testing-library/react";
import PackageCard from "../src/components/PackageCard";

const packageData = {
  emoji: "🏖️",
  tag: "Popular",
  destination: "Goa",
  country: "India",
  name: "Goa Beach Escape",
  rating: 4.8,
  duration: 5,
  description: "Enjoy the beautiful beaches of Goa.",
  price: 15000,
};

describe("PackageCard Component", () => {

  test("displays travel package information correctly", () => {
    render(
      <PackageCard
        packageData={packageData}
        travelDate=""
        setTravelDate={() => {}}
        onViewDetails={() => {}}
        onAddToCart={() => {}}
      />
    );

    expect(
      screen.getByText("Goa Beach Escape")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Goa, India/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/4.8/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/5 Days/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Enjoy the beautiful beaches of Goa."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("₹15,000")
    ).toBeInTheDocument();
  });


  test("allows the user to select a travel date", () => {
    const setTravelDate = jest.fn();

    render(
      <PackageCard
        packageData={packageData}
        travelDate=""
        setTravelDate={setTravelDate}
        onViewDetails={() => {}}
        onAddToCart={() => {}}
      />
    );

    const dateInput = document.querySelector(".date-input");

    fireEvent.change(dateInput, {
      target: {
        value: "2026-12-20",
      },
    });

    expect(setTravelDate).toHaveBeenCalledWith(
      "2026-12-20"
    );
  });


  test("calls view details when Details button is clicked", () => {
    const onViewDetails = jest.fn();

    render(
      <PackageCard
        packageData={packageData}
        travelDate=""
        setTravelDate={() => {}}
        onViewDetails={onViewDetails}
        onAddToCart={() => {}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /View details for Goa Beach Escape/i,
      })
    );

    expect(onViewDetails).toHaveBeenCalledWith(
      packageData
    );
  });


  test("calls add to cart with package and travel date", () => {
    const onAddToCart = jest.fn();

    render(
      <PackageCard
        packageData={packageData}
        travelDate="2026-12-20"
        setTravelDate={() => {}}
        onViewDetails={() => {}}
        onAddToCart={onAddToCart}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Add Goa Beach Escape to booking cart/i,
      })
    );

    expect(onAddToCart).toHaveBeenCalledWith(
      packageData,
      "2026-12-20"
    );
  });

});