import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home"; // Replace with the correct path
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Private from "./components/Private";
import CreateList from "./pages/CreateList";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import UpdateListing from "./pages/UpdateListing";
export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route element={<Private />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/update/:id" element={<UpdateListing />} />
          <Route path="/add-listing" element={<CreateList />} />
        </Route>
      </Routes>
    </Router>
  );
}
