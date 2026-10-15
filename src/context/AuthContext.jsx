import {
  createContext,
  useContext,
  useState,
} from "react";

import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:2229/api";

function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("atlasUser")
    ) || null
  );

  // =========================
  // LOGIN
  // =========================

  const login = async (
    email,
    password
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      const {
        token,
        user: userData,
      } = response.data;

      // Save user details
      localStorage.setItem(
        "atlasUser",
        JSON.stringify(userData)
      );

      // Save JWT token
      localStorage.setItem(
        "atlasToken",
        token
      );

      // Update React state
      setUser(userData);

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please try again.",
      };
    }
  };

  // =========================
  // REGISTER
  // =========================

  const register = async (
    name,
    email,
    password
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      return {
        success: true,
        message:
          response.data.message ||
          "Account created successfully.",
      };
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem(
      "atlasUser"
    );

    localStorage.removeItem(
      "atlasToken"
    );

    setUser(null);
  };

  // =========================
  // CONTEXT
  // =========================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// CUSTOM HOOK
// =========================

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider };
