import { Link } from 'react-router-dom';
import './Nav.css'; // Import the CSS file for styling

const Nav = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">HOME</Link>
      <Link to="/SavedCandidates" className="nav-link">Saved Candidates</Link>
    </nav>
  );
};

export default Nav;
