import React, { useEffect } from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";
import { useUser } from "../UserContext";

const DarkMode = () => {
  const { user, setUser } = useUser("false");

  useEffect(() => {
    // Set initial theme based on user preference
    if (user === "true") {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  }, [user]);

  const toggleTheme = () => {
    const newTheme = user === "true" ? "false" : "true";
    setUser(newTheme);
    document.body.setAttribute(
      "data-theme",
      newTheme === "true" ? "dark" : "light"
    );
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        checked={user === "true"}
        onChange={toggleTheme}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <Sun />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
