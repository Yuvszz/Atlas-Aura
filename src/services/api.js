import axios from "axios";

const API_URL = "http://localhost:2229/api";

// =========================
// AXIOS INSTANCE
// =========================

const api = axios.create({
  baseURL: API_URL,
});

// =========================
// PACKAGE CACHE
// =========================

let packagesCache = null;

const packageCache = {};
const availabilityCache = {};

// =========================
// REQUEST INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {

    console.log(
      "🌐 " +
      config.method.toUpperCase() +
      " " +
      config.baseURL +
      config.url
    );

    const token =
      localStorage.getItem("atlasToken");

    if (token) {
      config.headers.Authorization =
        "Bearer " + token;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =========================
// RESPONSE INTERCEPTOR
// =========================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    if (
      error.response &&
      error.response.status === 401
    ) {

      localStorage.removeItem(
        "atlasToken"
      );

      localStorage.removeItem(
        "atlasUser"
      );

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// =========================
// PACKAGE APIs
// =========================

// GET ALL PACKAGES

export const getPackages = async () => {

  if (packagesCache) {
    return packagesCache;
  }

  const response =
    await api.get("/packages");

  packagesCache =
    response.data;

  return packagesCache;
};

// =========================
// GET SINGLE PACKAGE
// =========================

export const getPackageById =
  async (id) => {

    if (packageCache[id]) {
      return packageCache[id];
    }

    const response =
      await api.get(
        `/packages/${id}`
      );

    packageCache[id] =
      response.data;

    return packageCache[id];
  };

// =========================
// GET PACKAGE AVAILABILITY
// =========================

export const getPackageAvailability =
  async (id) => {

    if (availabilityCache[id]) {
      return availabilityCache[id];
    }

    const response =
      await api.get(
        `/packages/${id}/availability`
      );

    availabilityCache[id] =
      response.data;

    return availabilityCache[id];
  };

// =========================
// CLEAR PACKAGE CACHE
// =========================

export const clearPackageCache = () => {

  packagesCache = null;

  Object.keys(packageCache)
    .forEach((key) => {
      delete packageCache[key];
    });

  Object.keys(availabilityCache)
    .forEach((key) => {
      delete availabilityCache[key];
    });
};

// =========================
// CREATE BOOKING
// =========================

export const createBooking =
  async (bookingData) => {

    const response =
      await api.post(
        "/bookings",
        bookingData
      );

    return response.data;
  };

// =========================
// GET BOOKING HISTORY
// =========================

export const getBookings =
  async () => {

    const response =
      await api.get("/bookings");

    return response.data;
  };

// =========================
// GET SINGLE BOOKING
// =========================

export const getBookingById =
  async (id) => {

    const response =
      await api.get(
        `/bookings/${id}`
      );

    return response.data;
  };

// =========================
// UPDATE BOOKING
// =========================

export const updateBooking =
  async (id, bookingData) => {

    const response =
      await api.put(
        `/bookings/${id}`,
        bookingData
      );

    return response.data.booking;
  };

// =========================
// DELETE / CANCEL BOOKING
// =========================

export const deleteBooking =
  async (id) => {

    const response =
      await api.delete(
        `/bookings/${id}`
      );

    return response.data;
  };