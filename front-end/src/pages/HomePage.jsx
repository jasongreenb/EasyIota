import { useState } from "react";
import NavBar from "../components/NavBar";
import Login from "../components/Login";

export default function HomePage() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedIn, setLoggedIn] = useState(!!token);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setLoggedIn(true);
    window.location.reload();
  };

  return <div>{loggedIn ? <NavBar /> : <Login onLogin={handleLogin} />}</div>;
}
