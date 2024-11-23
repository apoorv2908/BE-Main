import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../Styles/Breadcrumbs.css"

const Breadcrumbs = () => {
  const location = useLocation();
  
  const breadcrumbs = location.pathname
    .split('/')
    .filter((path) => path)
    .map((path, index, array) => {
      const routeTo = `/${array.slice(0, index + 1).join('/')}`;
      return (
        <span key={routeTo}>
          <Link to={routeTo}>{path.replace(/-/g, ' ')}</Link>
          {index < array.length - 1 && ' > '}
        </span>
      );
    });

  return (
    <nav className="breadcrumbs">
      <Link to="/">Home</Link>
      {breadcrumbs.length > 0 && ' > '}
      {breadcrumbs}
    </nav>
  );
};

export default Breadcrumbs;
