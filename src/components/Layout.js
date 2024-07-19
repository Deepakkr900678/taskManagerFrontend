import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <div className="bg-gray-100">
        <Navbar />
        <div className="xl:ml-14 ml-0 px-4 ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;