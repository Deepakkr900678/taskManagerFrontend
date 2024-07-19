import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import Task from './components/Task';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);

	const getUser = async () => {
		try {
			const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
			const { data } = await axios.get(url, { withCredentials: true });
			setUser(data.user._json);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

  return (
    <Routes>
      <Route path="/" element={<Task />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
