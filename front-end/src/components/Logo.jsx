import { Link } from "react-router-dom";
import styles from "./Logo.css";

export default function Logo() {
  return (
    <Link to="/">
      <img src="/lambdalogo.png" alt="LXA logo" className={styles.logo} />
    </Link>
  );
}
