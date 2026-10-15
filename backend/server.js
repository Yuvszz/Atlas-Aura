const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 2229;

// Secret key for JWT
const JWT_SECRET =
  process.env.JWT_SECRET || "atlas-aura-secret-key";

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// TRAVEL PACKAGE DATA
// =========================

const packages = [
  {
    id: 1,
    name: "Munnar Mist Escape",
    destination: "Munnar",
    country: "India",
    duration: 3,
    price: 8999,
    rating: 4.8,
    emoji: "🌿",
    tag: "Nature Escape",
    description:
      "A refreshing getaway through Munnar's misty hills and tea gardens.",
    availability: 12,
    travelInfo: {
      bestTime: "September to March",
      transport: "Bus / Car",
      accommodation: "3 Star Hotel",
    },
  },

  {
    id: 2,
    name: "Bali Blue Escape",
    destination: "Bali",
    country: "Indonesia",
    duration: 5,
    price: 24999,
    rating: 4.9,
    emoji: "🌊",
    tag: "Island Escape",
    description:
      "Experience Bali's beaches, temples and tropical landscapes.",
    availability: 8,
    travelInfo: {
      bestTime: "April to October",
      transport: "Flight + Local Transport",
      accommodation: "4 Star Resort",
    },
  },

  {
    id: 3,
    name: "Dubai City Rush",
    destination: "Dubai",
    country: "UAE",
    duration: 4,
    price: 32999,
    rating: 4.7,
    emoji: "🏙️",
    tag: "City Adventure",
    description:
      "Explore Dubai's iconic landmarks, shopping and modern attractions.",
    availability: 10,
    travelInfo: {
      bestTime: "November to March",
      transport: "Flight + Metro",
      accommodation: "4 Star Hotel",
    },
  },

  {
    id: 4,
    name: "Manali Mountain Soul",
    destination: "Manali",
    country: "India",
    duration: 5,
    price: 15999,
    rating: 4.6,
    emoji: "🏔️",
    tag: "Mountain Escape",
    description:
      "Discover snow-covered mountains, valleys and scenic roads.",
    availability: 15,
    travelInfo: {
      bestTime: "October to February",
      transport: "Bus / Car",
      accommodation: "3 Star Hotel",
    },
  },

  {
    id: 5,
    name: "Maldives Luxury Escape",
    destination: "Maldives",
    country: "Maldives",
    duration: 4,
    price: 39999,
    rating: 5.0,
    emoji: "🏝️",
    tag: "Luxury Escape",
    description:
      "Relax on tropical islands with crystal-clear waters and luxury resorts.",
    availability: 6,
    travelInfo: {
      bestTime: "November to April",
      transport: "Flight + Speedboat",
      accommodation: "Luxury Resort",
    },
  },

  {
    id: 6,
    name: "Ooty Weekend Bloom",
    destination: "Ooty",
    country: "India",
    duration: 2,
    price: 6999,
    rating: 4.5,
    emoji: "🌸",
    tag: "Weekend Escape",
    description:
      "Enjoy a peaceful weekend among Ooty's gardens, lakes and hills.",
    availability: 20,
    travelInfo: {
      bestTime: "October to June",
      transport: "Bus / Car",
      accommodation: "3 Star Hotel",
    },
  },
];

// =========================
// BOOKING DATA
// =========================

let bookings = [];
let nextBookingId = 1;

// =========================
// USER DATA
// =========================

let users = [
  {
    id: 1,
    name: "Yuva",
    email: "yuva@gmail.com",
    password: null,
  },
];

let nextUserId = 2;

// Create bcrypt hash for the initial demo account
(async () => {
  users[0].password = await bcrypt.hash("123456", 10);
})();

// =========================
// REGISTER - POST
// =========================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters",
      });
    }

    // Check existing email
    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: nextUserId++,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    };

    users.push(newUser);

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// =========================
// LOGIN - POST
// =========================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user using email only
    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with bcrypt hash
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// =========================
// TOKEN VERIFICATION
// =========================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication token required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid authentication token",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// =========================
// PACKAGE APIs
// =========================

// GET ALL PACKAGES
app.get("/api/packages", (req, res) => {
  res.json(packages);
});

// GET INDIVIDUAL PACKAGE
app.get("/api/packages/:id", (req, res) => {
  const id = Number(req.params.id);

  const packageData = packages.find(
    (item) => item.id === id
  );

  if (!packageData) {
    return res.status(404).json({
      message: "Package not found",
    });
  }

  res.json(packageData);
});

// GET AVAILABILITY
app.get("/api/packages/:id/availability", (req, res) => {
  const id = Number(req.params.id);

  const packageData = packages.find(
    (item) => item.id === id
  );

  if (!packageData) {
    return res.status(404).json({
      message: "Package not found",
    });
  }

  res.json({
    packageId: packageData.id,
    packageName: packageData.name,
    destination: packageData.destination,
    availableSlots: packageData.availability,
    travelInfo: packageData.travelInfo,
  });
});

// =========================
// PROTECTED BOOKING APIs
// =========================

// CREATE BOOKING - POST
app.post(
  "/api/bookings",
  authenticateToken,
  (req, res) => {
    const bookingData = req.body;

    if (!bookingData.name || !bookingData.email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const newBooking = {
      id: nextBookingId++,
      ...bookingData,
      userId: req.user.id,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  }
);

// GET ALL BOOKINGS - GET
app.get(
  "/api/bookings",
  authenticateToken,
  (req, res) => {
    const userBookings = bookings.filter(
      (booking) =>
        booking.userId === req.user.id
    );

    res.json(userBookings);
  }
);

// GET SINGLE BOOKING - GET
app.get(
  "/api/bookings/:id",
  authenticateToken,
  (req, res) => {
    const id = Number(req.params.id);

    const booking = bookings.find(
      (item) =>
        item.id === id &&
        item.userId === req.user.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  }
);

// UPDATE BOOKING - PUT
app.put(
  "/api/bookings/:id",
  authenticateToken,
  (req, res) => {
    const id = Number(req.params.id);

    const bookingIndex = bookings.findIndex(
      (item) =>
        item.id === id &&
        item.userId === req.user.id
    );

    if (bookingIndex === -1) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...req.body,
      id: id,
      userId: req.user.id,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      message: "Booking updated successfully",
      booking: bookings[bookingIndex],
    });
  }
);

// CANCEL BOOKING - DELETE
app.delete(
  "/api/bookings/:id",
  authenticateToken,
  (req, res) => {
    const id = Number(req.params.id);

    const bookingIndex = bookings.findIndex(
      (item) =>
        item.id === id &&
        item.userId === req.user.id
    );

    if (bookingIndex === -1) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const deletedBooking =
      bookings.splice(bookingIndex, 1)[0];

    res.json({
      message: "Booking cancelled successfully",
      booking: deletedBooking,
    });
  }
);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Atlas Aura API Server is running",
  });
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(
    `Atlas Aura API running at http://localhost:${PORT}`
  );
});