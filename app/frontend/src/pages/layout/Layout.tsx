import { Outlet, NavLink, Link } from "react-router-dom";
import { useState } from "react";

import github from "../../assets/github.svg";
import logo from "../../assets/logo2.png";

import styles from "./Layout.module.css";

import { useLogin } from "../../authConfig";

import { LoginButton } from "../../components/LoginButton";
import { PopUpWindow } from "../../components/PopUpWindow";

const Layout = () => {
    const [open, setOpen] = useState(true);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.headerTitleContainer}>
                        <h3 className={styles.headerTitle}>Dental GPT</h3>
                    </Link>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Chat
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/qa" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Ask a question
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                    <img className={styles.headerRightText} src={logo} alt="Github logo" aria-label="Link to github repository" width="150px" height="40px" />
                    {useLogin && <LoginButton />}
                </div>
            </header>

            <Outlet />
            <PopUpWindow open={open} setOpen={setOpen} />
        </div>
    );
};

export default Layout;
