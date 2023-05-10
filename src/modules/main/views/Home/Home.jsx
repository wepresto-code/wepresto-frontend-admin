import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GlobalContext } from "../../../../App.jsx";

const Home = () => {
  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h1>Hi there</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
