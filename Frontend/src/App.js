import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import './App.css'
function App() {
  return (
    <div className="app">
      <nav className="  navbar navbar-expand-lg navbar-light bg-primary m-3 " >
        <Link className="navbar-brand"  to="/home">
          MANAGER LOGIN JWT
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <button className="nav-item btn-success m-3">
              <Link className="nav-link" to="/signin">
                Sign In
              </Link>
            </button>
            <button className="nav-item btn-warning m-3">
              <Link className="nav-link" to="/signup">
                Sign Up
              </Link>
            </button>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
