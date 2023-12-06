import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Login = ({ setToken, notify }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    try {
      const response = await axios.post("http://localhost:3001/api/users/login", { username, password });
      const token = response.data.token;
      localStorage.setItem("loginToken", token);
      setToken(token);
      console.log("response from login: ",response.data)
      localStorage.setItem("loginUsername",response.data.username);
      localStorage.setItem("loginName",response.data.name);
      console.log("(Login) Current token: ",token)
      notify("Logged in successfully as "+username, false);
    } catch (error) {
      console.error("Login error: ", error);
      notify("Failed to login", true);
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
        localStorage.removeItem("loginUsername");
        localStorage.removeItem("loginName");
        setToken(null);
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
};

export { Login, Logout };