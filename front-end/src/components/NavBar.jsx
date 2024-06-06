import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <ul className={styles.navLinks}>
        <li>
          <NavLink 
            to="/upload" 
            className={({ isActive }) => isActive ? styles.activeNavLink : styles.navLink}
          >
            Upload
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/view" 
            className={({ isActive }) => isActive ? styles.activeNavLink : styles.navLink}
          >
            View Upcoming
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/emails" 
            className={({ isActive }) => isActive ? styles.activeNavLink : styles.navLink}
          >
            Email tab
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
