import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SignupForm = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(fullName);
    // console.log(age);
    // console.log(username);
    // console.log(password);
    axios({
      method: 'post',
      url: '/api/auth/signup',
      data: {
        email_address: username,
        password: password,
        athlete_name: fullName,
        age: age,
      },
    })
      .then((response) => {
        console.log('this is response', response);
        return response;
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        alert('This email already exists');
      });
  };

  return (
    <div className="my-5">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
          />
        </div>
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
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
