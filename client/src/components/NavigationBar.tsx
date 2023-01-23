import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const location = useLocation();

  const renderMenuItem = (pathname: string, name: string) => {
    return (
      <li className={location.pathname === pathname ? "active" : ""}>
        <Link to={pathname}>{name}</Link>
      </li>
    );
  };

  return (
    <nav>
      <ul className="navigation">
        {renderMenuItem("/", "Form Upload File")}
        {renderMenuItem("/journeys", "Journeys")}
        {renderMenuItem("/stations", "Stations")}
      </ul>
    </nav>
  );
};

export default NavigationBar;
