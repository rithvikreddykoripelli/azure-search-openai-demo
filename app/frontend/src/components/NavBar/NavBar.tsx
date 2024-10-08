import logo from "../../assets/logo2.png";

import styles from "./NavBar.module.css";

import { useLogin } from "../../authConfig";
import { LoginButton } from "../../components/LoginButton";
import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <header className={styles.header} role={"banner"}>
            <div className={styles.headerContainer}>
                <Link to="/">
                    <img className={styles.headerRightText} src={logo} alt="Dental Insights" aria-label="Dentla Insights" width="150px" height="40px" />
                </Link>
                <nav>
                    <ul className={styles.headerNavList}>
                        <li>
                            <NavLink to="/dental-gpt" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                Dental GPT
                            </NavLink>
                        </li>
                        <li className={styles.headerNavLeftMargin}>
                            <NavLink to="/dental-compass" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                Dental Compass
                            </NavLink>
                        </li>
                        <li className={styles.headerNavLeftMargin}>
                            <NavLink to="/contact" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                Contact
                            </NavLink>
                        </li>
                        <li className={styles.headerNavLeftMargin}>
                            <NavLink to="/feedback" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                Feedback
                            </NavLink>
                        </li>
                        <li className={styles.headerNavLeftMargin}>
                            <NavLink to="/dental-gpt/qa" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                Ask a question
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className={styles.loginButtonContainer}>{!useLogin && <LoginButton />}</div>
            </div>
        </header>
    );
}
