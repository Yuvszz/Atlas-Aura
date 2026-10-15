import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import FilterPanel from "../src/components/FilterPanel";


describe("FilterPanel Component", () => {

  const setup = () => {

    const setDestination = jest.fn();
    const setDuration = jest.fn();
    const setBudget = jest.fn();
    const setRating = jest.fn();

    render(
      <FilterPanel
        destination="all"
        setDestination={setDestination}
        duration="all"
        setDuration={setDuration}
        budget="all"
        setBudget={setBudget}
        rating="all"
        setRating={setRating}
      />
    );

    return {
      setDestination,
      setDuration,
      setBudget,
      setRating,
    };
  };


  test("displays destination filter options", () => {

    setup();

    expect(
      screen.getByText("All destinations")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Munnar")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Bali")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Dubai")
    ).toBeInTheDocument();

  });


  test("changes destination filter", () => {

    const {
      setDestination,
    } = setup();

    const selects =
      screen.getAllByRole("combobox");

    fireEvent.change(selects[0], {
      target: {
        value: "Munnar",
      },
    });

    expect(
      setDestination
    ).toHaveBeenCalledWith("Munnar");

  });


  test("displays budget filter options", () => {

    setup();

    expect(
      screen.getByText("Any budget")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₹10,000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₹20,000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₹30,000")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₹40,000")
    ).toBeInTheDocument();

  });


  test("changes maximum budget filter", () => {

    const {
      setBudget,
    } = setup();

    const selects =
      screen.getAllByRole("combobox");

    fireEvent.change(selects[2], {
      target: {
        value: "20000",
      },
    });

    expect(
      setBudget
    ).toHaveBeenCalledWith("20000");

  });


  test("changes duration filter", () => {

    const {
      setDuration,
    } = setup();

    const selects =
      screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: {
        value: "5",
      },
    });

    expect(
      setDuration
    ).toHaveBeenCalledWith("5");

  });


  test("changes rating filter", () => {

    const {
      setRating,
    } = setup();

    const selects =
      screen.getAllByRole("combobox");

    fireEvent.change(selects[3], {
      target: {
        value: "4.5",
      },
    });

    expect(
      setRating
    ).toHaveBeenCalledWith("4.5");

  });

});