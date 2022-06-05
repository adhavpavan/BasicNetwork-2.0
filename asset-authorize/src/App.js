import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import React, { useEffect } from 'react';
import './style/Register.css'
import './style/Home.css'
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/register" exact element={<Register/>} />
          <Route path="/" exact element={<Home/>} />
        </Routes>    
      </div>
    </BrowserRouter>
  );
}

export default App;
