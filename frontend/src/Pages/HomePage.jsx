import React from "react";
import Navbar from "../Layouts/Navbar";
import Home from "../Components/Home";
import List from "../Components/List";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Home/>
      <List/>
    </>
  );
};

export default HomePage;
