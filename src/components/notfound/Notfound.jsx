import React from 'react';
import './notfound.css';
import { useNavigate } from 'react-router-dom';

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
          <h2>404 - The Page can't be found</h2>
        </div>
        {/* Add role and tabIndex to make the link accessible */}
        <a role="button" tabIndex={0} onClick={() => navigate('/')}>
          Go TO DashBoard
        </a>
      </div>
    </div>
  );
};

export default Notfound;
