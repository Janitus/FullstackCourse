import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    try {
      const response = await axios.post("http://localhost:3001/api/users/login", { username, password });
      const token = response.data.token;
      localStorage.setItem("loginToken", token);
      setToken(token);
      console.log("Set token: ",token)
    } catch (error) {
      console.error("Login error: ", error);
      alert("Could not login");
    }
  };

  // https://www.w3schools.com/tags/att_input_type.asp
  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

const Logout = ({ setToken }) => {
    const handleLogout = () => {
        localStorage.removeItem("loginToken");
        setToken(null);
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export { Login, Logout };
