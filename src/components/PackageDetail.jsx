import { useEffect, useState } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  setSelectedPackage,
  setTravelDate,
  setTravelers,
  addToCart,
  cachePackage,
} from "../store/bookingSlice";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPackageById,
  getPackageAvailability,
} from "../services/api";


function PackageDetail({
  travelDates,
  onAddToCart,
}) {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();


  // =========================
  // REDUX PACKAGE CACHE
  // =========================

  const cachedPackage = useSelector(
    (state) =>
      state.booking.packageCache?.[id]
  );


  // =========================
  // PACKAGE STATES
  // =========================

  const [packageDetails, setPackageDetails] =
    useState(cachedPackage || null);

  const [availability, setAvailability] =
    useState(null);

  const [loading, setLoading] =
    useState(!cachedPackage);

  const [error, setError] =
    useState("");


  // =========================
  // SELECTED TRAVEL DATE
  // =========================

  const selectedDate =
    travelDates?.[id];


  // =========================
  // FETCH PACKAGE DETAILS
  // =========================

  useEffect(() => {

    const fetchPackageDetails = async () => {

      try {

        setError("");


        let details;


        // =========================
        // CHECK REDUX CACHE
        // =========================

        if (cachedPackage) {

          // Package already exists
          // in Redux cache

          details = cachedPackage;

          setPackageDetails(
            cachedPackage
          );

          dispatch(
            setSelectedPackage(
              cachedPackage
            )
          );

        } else {

          // =========================
          // FETCH FROM API
          // =========================

          setLoading(true);

          details =
            await getPackageById(id);

          setPackageDetails(details);


          // Store selected package
          // in Redux

          dispatch(
            setSelectedPackage(
              details
            )
          );


          // =========================
          // CACHE PACKAGE
          // =========================

          dispatch(
            cachePackage(details)
          );

        }


        // =========================
        // GET AVAILABILITY
        // =========================

        const availabilityData =
          await getPackageAvailability(id);

        setAvailability(
          availabilityData
        );


      } catch (err) {

        console.error(
          "Failed to load package details:",
          err
        );

        setError(
          "Unable to load package details."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchPackageDetails();

  }, [
    id,
    dispatch,
    cachedPackage,
  ]);


  // =========================
  // STORE TRAVEL DATE IN REDUX
  // =========================

  useEffect(() => {

    if (selectedDate) {

      dispatch(
        setTravelDate(
          selectedDate
        )
      );

    }

  }, [
    selectedDate,
    dispatch,
  ]);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <main className="package-detail-page">

        <div className="detail-loading">

          <div className="loading-icon">
            ✈️
          </div>

          <h2>
            Loading your journey...
          </h2>

          <p>
            Fetching the latest travel
            information.
          </p>

        </div>

      </main>

    );

  }


  // =========================
  // ERROR
  // =========================

  if (
    error ||
    !packageDetails
  ) {

    return (

      <main className="package-detail-page">

        <div className="detail-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Package not found
          </h2>

          <p>
            {error ||
              "The selected travel package could not be found."}
          </p>

          <button
            className="back-button"
            onClick={() =>
              navigate("/packages")
            }
          >
            ← Back to Packages
          </button>

        </div>

      </main>

    );

  }


  const travelInfo =
    availability?.travelInfo ||
    packageDetails.travelInfo;


  return (

    <main className="package-detail-page">


      {/* =========================
          TOP NAVIGATION
      ========================= */}

      <div className="detail-topbar">

        <button
          className="back-button"
          onClick={() =>
            navigate("/packages")
          }
        >
          ← Back to Packages
        </button>

        <span>
          Atlas Aura / Package Details
        </span>

      </div>


      {/* =========================
          MAIN DETAIL CARD
      ========================= */}

      <section className="package-detail-container">


        {/* =========================
            HERO SECTION
        ========================= */}

        <div className="detail-hero">

          <div className="detail-hero-icon">

            {packageDetails.emoji}

          </div>


          <div className="detail-hero-content">

            <p className="detail-label">

              {packageDetails.tag ||
                "TRAVEL EXPERIENCE"}

            </p>


            <h1>

              {packageDetails.name}

            </h1>


            <p className="detail-location">

              📍 {packageDetails.destination},{" "}
              {packageDetails.country}

            </p>


            <div className="detail-meta">

              <span>

                ⭐{" "}
                {packageDetails.rating}

                <small>
                  / 5
                </small>

              </span>


              <span>

                🕒{" "}

                {packageDetails.duration}

                {" "}Days

              </span>


              <span>

                🎟️{" "}

                {packageDetails.availability}

                {" "}Slots

              </span>

            </div>

          </div>

        </div>


        {/* =========================
            CONTENT
        ========================= */}

        <div className="detail-content">


          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="detail-main">


            {/* ABOUT THE JOURNEY */}

            <section className="detail-section">

              <p className="section-label">

                ABOUT THE JOURNEY

              </p>


              <h2>

                Your next escape starts here

              </h2>


              <p className="detail-description">

                {packageDetails.description}

              </p>


              <p className="detail-description">

                Discover the highlights of{" "}

                {packageDetails.destination}

                {" "}with a carefully planned
                travel experience designed
                for comfort, exploration and
                memorable moments.

              </p>

            </section>


            {/* TRIP HIGHLIGHTS */}

            <section className="detail-section">

              <p className="section-label">

                TRIP HIGHLIGHTS

              </p>


              <h2>

                What makes this journey special

              </h2>


              <div className="highlight-grid">


                <div className="highlight-card">

                  <span>
                    🌍
                  </span>

                  <div>

                    <strong>
                      Destination
                    </strong>

                    <p>

                      {packageDetails.destination}

                    </p>

                  </div>

                </div>


                <div className="highlight-card">

                  <span>
                    🗓️
                  </span>

                  <div>

                    <strong>
                      Duration
                    </strong>

                    <p>

                      {packageDetails.duration} Days

                    </p>

                  </div>

                </div>


                <div className="highlight-card">

                  <span>
                    ⭐
                  </span>

                  <div>

                    <strong>
                      Guest Rating
                    </strong>

                    <p>

                      {packageDetails.rating}
                      / 5

                    </p>

                  </div>

                </div>


                <div className="highlight-card">

                  <span>
                    🎫
                  </span>

                  <div>

                    <strong>
                      Availability
                    </strong>

                    <p>

                      {packageDetails.availability}{" "}
                      slots remaining

                    </p>

                  </div>

                </div>


              </div>

            </section>


            {/* TRAVEL INFORMATION */}

            <section className="detail-section">

              <p className="section-label">

                TRAVEL INFORMATION

              </p>


              <h2>

                Everything you need to know

              </h2>


              <div className="travel-info-grid">


                <div className="travel-info-item">

                  <span>
                    📅
                  </span>

                  <div>

                    <small>
                      BEST TIME TO VISIT
                    </small>

                    <strong>

                      {travelInfo?.bestTime ||
                        "Available throughout the year"}

                    </strong>

                  </div>

                </div>


                <div className="travel-info-item">

                  <span>
                    🚗
                  </span>

                  <div>

                    <small>
                      TRANSPORT
                    </small>

                    <strong>

                      {travelInfo?.transport ||
                        "Local transport"}

                    </strong>

                  </div>

                </div>


                <div className="travel-info-item">

                  <span>
                    🏨
                  </span>

                  <div>

                    <small>
                      ACCOMMODATION
                    </small>

                    <strong>

                      {travelInfo?.accommodation ||
                        "Comfortable stay"}

                    </strong>

                  </div>

                </div>


                <div className="travel-info-item">

                  <span>
                    🛡️
                  </span>

                  <div>

                    <small>
                      BOOKING STATUS
                    </small>

                    <strong>

                      Available for booking

                    </strong>

                  </div>

                </div>


              </div>

            </section>


          </div>


          {/* =========================
              RIGHT SIDE BOOKING CARD
          ========================= */}

          <aside className="booking-summary-card">


            <p className="section-label">

              PLAN YOUR JOURNEY

            </p>


            <h2>

              Ready to explore?

            </h2>


            {/* PRICE */}

            <div className="detail-price">

              <small>
                Starting from
              </small>


              <strong>

                ₹

                {Number(
                  packageDetails.price
                ).toLocaleString()}

              </strong>


              <span>
                per traveler
              </span>

            </div>


            {/* AVAILABILITY */}

            <div className="availability-box">

              <span>
                🎟️
              </span>


              <div>

                <strong>

                  {availability?.availableSlots ??
                    packageDetails.availability}{" "}
                  slots available

                </strong>


                <p>

                  Secure your preferred
                  travel date early.

                </p>

              </div>

            </div>


            {/* SELECTED DATE */}

            {selectedDate && (

              <div className="selected-date">

                <small>

                  SELECTED TRAVEL DATE

                </small>


                <strong>

                  📅 {selectedDate}

                </strong>

              </div>

            )}


            {/* =========================
                REDUX BOOKING CART
            ========================= */}

            <button
              className="detail-book-button"
              onClick={() => {

                // =========================
                // SAVE TRAVEL DATE
                // =========================

                if (selectedDate) {

                  dispatch(
                    setTravelDate(
                      selectedDate
                    )
                  );

                }


                // =========================
                // SAVE SELECTED PACKAGE
                // =========================

                dispatch(
                  setSelectedPackage(
                    packageDetails
                  )
                );


                // =========================
                // DEFAULT TRAVELERS
                // =========================

                dispatch(
                  setTravelers(1)
                );


                // =========================
                // ADD TO REDUX CART
                // =========================

                dispatch(
                  addToCart({

                    ...packageDetails,

                    travelDate:
                      selectedDate || "",

                    travelers: 1,

                  })
                );


                // =========================
                // OPEN CART
                // =========================

                onAddToCart(
                  packageDetails,
                  selectedDate
                );

              }}
            >

              Add to Booking Cart →

            </button>


            <p className="booking-note">

              🔐 Login or Sign In is required
              before booking.

            </p>


          </aside>


        </div>


      </section>


    </main>

  );

}


export default PackageDetail;