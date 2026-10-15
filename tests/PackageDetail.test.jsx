import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import PackageDetail from "../src/components/PackageDetail";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPackageById,
  getPackageAvailability,
} from "../src/services/api";


// =========================
// MOCK REDUX
// =========================

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));


// =========================
// MOCK ROUTER
// =========================

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));


// =========================
// MOCK API
// =========================

jest.mock("../src/services/api", () => ({
  getPackageById: jest.fn(),
  getPackageAvailability: jest.fn(),
}));


// =========================
// MOCK PACKAGE DATA
// =========================

const packageData = {
  id: "1",
  emoji: "🏖️",
  tag: "Popular",
  name: "Goa Beach Escape",
  destination: "Goa",
  country: "India",
  rating: 4.8,
  duration: 5,
  availability: 10,
  price: 15000,
  description:
    "Enjoy the beautiful beaches of Goa.",
  travelInfo: {
    bestTime: "October to March",
    transport: "Private vehicle",
    accommodation: "Beach Resort",
  },
};


// =========================
// TESTS
// =========================

describe("PackageDetail Component", () => {

  const dispatch = jest.fn();
  const navigate = jest.fn();


  beforeEach(() => {

    jest.clearAllMocks();

    useDispatch.mockReturnValue(dispatch);

    useNavigate.mockReturnValue(navigate);

    useParams.mockReturnValue({
      id: "1",
    });

    useSelector.mockImplementation(
      (selector) =>
        selector({
          booking: {
            packageCache: {},
          },
        })
    );

    getPackageById.mockResolvedValue(
      packageData
    );

    getPackageAvailability.mockResolvedValue({
      availableSlots: 8,
      travelInfo: packageData.travelInfo,
    });

  });


  test("displays package details after loading", async () => {

    render(
      <PackageDetail
        travelDates={{
          1: "2026-12-20",
        }}
        onAddToCart={jest.fn()}
      />
    );

    expect(
      screen.getByText(
        "Loading your journey..."
      )
    ).toBeInTheDocument();

    await waitFor(() => {

      expect(
        screen.getByText(
          "Goa Beach Escape"
        )
      ).toBeInTheDocument();

    });

    expect(
      screen.getByText(/Goa, India/)
    ).toBeInTheDocument();

    // FIX:
    // There are two "5 Days" texts in PackageDetail.
    // We check specifically inside .detail-meta.
    const metaSection =
      document.querySelector(".detail-meta");

    expect(metaSection).toHaveTextContent(
      "5 Days"
    );

    expect(
      screen.getByText(
        "Enjoy the beautiful beaches of Goa."
      )
    ).toBeInTheDocument();

  });


  test("displays package price and availability", async () => {

    render(
      <PackageDetail
        travelDates={{}}
        onAddToCart={jest.fn()}
      />
    );

    await waitFor(() => {

      expect(
        screen.getByText("₹15,000")
      ).toBeInTheDocument();

    });

    expect(
      screen.getByText(
        /8 slots available/
      )
    ).toBeInTheDocument();

  });


  test("displays selected travel date", async () => {

    render(
      <PackageDetail
        travelDates={{
          1: "2026-12-20",
        }}
        onAddToCart={jest.fn()}
      />
    );

    await waitFor(() => {

      expect(
        screen.getByText(
          "📅 2026-12-20"
        )
      ).toBeInTheDocument();

    });

  });


  test("adds package to booking cart", async () => {

    const onAddToCart = jest.fn();

    render(
      <PackageDetail
        travelDates={{
          1: "2026-12-20",
        }}
        onAddToCart={onAddToCart}
      />
    );

    await waitFor(() => {

      expect(
        screen.getByRole("button", {
          name: /Add to Booking Cart/i,
        })
      ).toBeInTheDocument();

    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Add to Booking Cart/i,
      })
    );

    expect(dispatch).toHaveBeenCalled();

    expect(onAddToCart).toHaveBeenCalledWith(
      packageData,
      "2026-12-20"
    );

  });


  test("navigates back to packages", async () => {

    render(
      <PackageDetail
        travelDates={{}}
        onAddToCart={jest.fn()}
      />
    );

    await waitFor(() => {

      expect(
        screen.getByRole("button", {
          name: /Back to Packages/i,
        })
      ).toBeInTheDocument();

    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Back to Packages/i,
      })
    );

    expect(navigate).toHaveBeenCalledWith(
      "/packages"
    );

  });

});