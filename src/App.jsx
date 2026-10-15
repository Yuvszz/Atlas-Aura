import {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { useSelector, useDispatch } from "react-redux";

import "./style.css";

import { getPackages } from "./services/api";

import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// =========================
// LAZY LOADED COMPONENTS
// =========================

const Header = lazy(() =>
  import("./components/Header")
);

const Footer = lazy(() =>
  import("./components/Footer")
);

const PackageDetail = lazy(() =>
  import("./components/PackageDetail")
);

const BookingCart = lazy(() =>
  import("./components/BookingCart")
);

const Checkout = lazy(() =>
  import("./components/Checkout")
);

const BookingHistory = lazy(() =>
  import("./components/BookingHistory")
);

const ProtectedRoute = lazy(() =>
  import("./components/ProtectedRoute")
);

const Home = lazy(() =>
  import("./pages/Home")
);

const Packages = lazy(() =>
  import("./pages/Packages")
);

const About = lazy(() =>
  import("./pages/About")
);

const Login = lazy(() =>
  import("./pages/Login")
);

import { useAuth } from "./context/AuthContext";

import {
  addToCart as addToCartRedux,
  removeFromCart,
} from "./store/bookingSlice";


function App() {

  // =========================
  // AUTHENTICATION
  // =========================

  const { isAuthenticated } = useAuth();

  const dispatch = useDispatch();

  const navigate = useNavigate();


  // =========================
  // REDUX CART
  // =========================

  const cart = useSelector(
    (state) => state.booking.cart
  );


  // =========================
  // SEARCH AND FILTER STATES
  // =========================

  const [search, setSearch] = useState("");

  const [destination, setDestination] =
    useState("all");

  const [duration, setDuration] =
    useState("all");

  const [budget, setBudget] =
    useState("all");

  const [rating, setRating] =
    useState("all");


  // =========================
  // API STATES
  // =========================

  const [apiPackages, setApiPackages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================
  // FETCH PACKAGES
  // =========================

  useEffect(() => {

    const fetchPackages = async () => {

      try {

        const data =
          await getPackages();

        setApiPackages(data);

      } catch (err) {

        console.error(
          "Failed to fetch packages:",
          err
        );

        setError(
          "Failed to fetch travel packages."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchPackages();

  }, []);


  // =========================
  // TRAVEL DATE STATE
  // =========================

  const [travelDates, setTravelDates] =
    useState({});


  // =========================
  // CART UI STATE
  // =========================

  const [showCart, setShowCart] =
    useState(false);


  // =========================
  // TRAVELER STATE
  // =========================

  const [traveler, setTraveler] =
    useState({

      name: "",

      travelers: 1,

      email: "",

      phone: "",

      cardNumber: "",

      expiry: "",

      cvv: "",

      paymentMethod: "",

    });


  // =========================
  // FILTER API PACKAGES
  // =========================

  const filteredPackages =
    apiPackages.filter((item) => {

      const matchesSearch =

        (item.destination || "")
          .toLowerCase()
          .includes(
            (search || "").toLowerCase()
          ) ||

        (item.name || "")
          .toLowerCase()
          .includes(
            (search || "").toLowerCase()
          );


      const matchesDestination =

        destination === "all" ||

        item.destination ===
          destination;


      const matchesDuration =

        duration === "all" ||

        item.duration ===
          Number(duration);


      const matchesBudget =

        budget === "all" ||

        item.price <=
          Number(budget);


      const matchesRating =

        rating === "all" ||

        item.rating >=
          Number(rating);


      return (

        matchesSearch &&

        matchesDestination &&

        matchesDuration &&

        matchesBudget &&

        matchesRating

      );

    });


  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (
    packageData,
    travelDate
  ) => {

    if (!isAuthenticated) {

      alert(
        "Please Login or Sign In before booking a travel package."
      );

      navigate("/login");

      return;

    }


    if (!packageData) {

      alert(
        "Please select a travel package."
      );

      return;

    }


    if (!packageData.destination) {

      alert(
        "Destination is required."
      );

      return;

    }


    if (!travelDate) {

      alert(
        "Please select a travel date."
      );

      return;

    }


    const alreadyAdded =
      cart.some(
        (item) =>
          item.id ===
          packageData.id
      );


    if (alreadyAdded) {

      alert(
        "This package is already in your cart."
      );

      setShowCart(true);

      return;

    }


    // =========================
    // ADD TO REDUX
    // =========================

    dispatch(
      addToCartRedux({

        ...packageData,

        travelDate,

        travelers: 1,

      })
    );


    setShowCart(true);

  };


  // =========================
  // REMOVE FROM CART
  // =========================

  const handleRemoveFromCart = (id) => {

    dispatch(
      removeFromCart(id)
    );

  };


  // =========================
  // OPEN CHECKOUT
  // =========================

  const handleCheckout = () => {

    if (cart.length === 0) {

      alert(
        "Your cart is empty."
      );

      return;

    }


    setShowCart(false);

    navigate("/checkout");

  };


  // =========================
  // RETURN
  // =========================

  return (

    <Suspense
      fallback={
        <div className="loading-page">
          Loading your journey...
        </div>
      }
    >

      <Header

        cartCount={
          cart.length
        }

        onCartClick={() =>
          setShowCart(true)
        }

      />


      {/* =========================
          ROUTES
      ========================= */}

      <Routes>


        {/* =========================
            HOME
        ========================= */}

        <Route

          path="/"

          element={
            <Home />
          }

        />


        {/* =========================
            PACKAGES
        ========================= */}

        <Route

          path="/packages"

          element={

            <Packages

              packages={
                filteredPackages
              }

              search={
                search
              }

              setSearch={
                setSearch
              }

              destination={
                destination
              }

              setDestination={
                setDestination
              }

              duration={
                duration
              }

              setDuration={
                setDuration
              }

              budget={
                budget
              }

              setBudget={
                setBudget
              }

              rating={
                rating
              }

              setRating={
                setRating
              }

              travelDates={
                travelDates
              }

              setTravelDates={
                setTravelDates
              }

              onViewDetails={
                (packageData) => {

                  navigate(
                    `/packages/${packageData.id}`
                  );

                }
              }

              onAddToCart={
                addToCart
              }

              loading={
                loading
              }

              error={
                error
              }

            />

          }

        />


        {/* =========================
            PACKAGE DETAILS
        ========================= */}

        <Route

          path="/packages/:id"

          element={

            <PackageDetail

              travelDates={
                travelDates
              }

              onAddToCart={() =>
                setShowCart(true)
              }

            />

          }

        />


        {/* =========================
            ABOUT
        ========================= */}

        <Route

          path="/about"

          element={
            <About />
          }

        />


        {/* =========================
            LOGIN
        ========================= */}

        <Route

          path="/login"

          element={
            <Login />
          }

        />


        {/* =========================
            PROTECTED BOOKING
        ========================= */}

        <Route

          path="/booking"

          element={

            <ProtectedRoute>

              <Checkout

                traveler={
                  traveler
                }

                setTraveler={
                  setTraveler
                }

                onBack={() =>
                  navigate(-1)
                }

              />

            </ProtectedRoute>

          }

        />


        {/* =========================
            PROTECTED CHECKOUT
        ========================= */}

        <Route

          path="/checkout"

          element={

            <ProtectedRoute>

              <Checkout

                traveler={
                  traveler
                }

                setTraveler={
                  setTraveler
                }

                onBack={() =>
                  navigate(-1)
                }

              />

            </ProtectedRoute>

          }

        />


        {/* =========================
            PROTECTED BOOKING HISTORY
        ========================= */}

        <Route

          path="/bookings"

          element={

            <ProtectedRoute>

              <BookingHistory />

            </ProtectedRoute>

          }

        />


        {/* =========================
            PROTECTED PAYMENT
        ========================= */}

        <Route

          path="/payment"

          element={

            <ProtectedRoute>

              <Checkout

                traveler={
                  traveler
                }

                setTraveler={
                  setTraveler
                }

                onBack={() =>
                  navigate(-1)
                }

              />

            </ProtectedRoute>

          }

        />

      </Routes>


      {/* =========================
          FOOTER
      ========================= */}

      <Footer />


      {/* =========================
          BOOKING CART
      ========================= */}

      {showCart && (

        <BookingCart

          onRemove={
            handleRemoveFromCart
          }

          onClose={() =>
            setShowCart(false)
          }

          onCheckout={
            handleCheckout
          }

        />

      )}

    </Suspense>

  );

}


export default App;