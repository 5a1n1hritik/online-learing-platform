import { createContext, useContext, useState, useEffect } from "react";
import API from "@/api/axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        try {
          const res = await API.post("/auth/refresh-token");
          accessToken = res.data.accessToken;
          sessionStorage.setItem("accessToken", accessToken);
        } catch (err) {
          console.log("Could not refresh token on load");
          setIsLoading(false);
          return;
        }
      }

      try {
        const response = await API.get("/auth/profile");
        const data = await response.data;
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });

      const { accessToken, user } = response.data;

      sessionStorage.setItem("accessToken", accessToken);
      setUser(user);
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "INSTRUCTOR") {
        navigate("/instructor/courses");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.warn("Logout failed:", err.message);
    } finally {
      sessionStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
