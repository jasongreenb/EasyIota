import { useState } from "react";
import styles from "./Login.module.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      onLogin(data.token);
    } else {
      const data = await response.json();
      return console.error(data.error_message);
    }
  }

  return (
    <div className={styles.container}>
      <h4>Enter ADMIN credentials</h4>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
