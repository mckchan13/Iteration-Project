import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginForm = ({setAuth, setCurrUser}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: '/api/auth/login',
      withCredentials: true,
      data: {
        email: username,
        password: password,
      },
    })
      .then((response) => {
        setAuth(true);
        console.log(response);
        sessionStorage.setItem("userId",response.data.user)
        setCurrUser(response.data.user)
        history('dashboard');
      })
      .catch((error) => {
        console.log('this is login error', error);
      });
  };

  return (
    <div className="my-5">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
