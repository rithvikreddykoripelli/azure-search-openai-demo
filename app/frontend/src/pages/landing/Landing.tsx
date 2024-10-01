import { Outlet, NavLink, Link } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/logo2.png";

import styles from "./Landing.module.css";

import { useLogin } from "../../authConfig";
import { LoginButton } from "../../components/LoginButton";
import { Button } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <img className={styles.headerRightText} src={logo} alt="Dental Insights" aria-label="Dentla Insights" width="150px" height="40px" />
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/dental-gpt" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Dental GPT
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink
                                    to="/dental-compass"
                                    className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}
                                >
                                    Market Updates
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/feedback" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Give us feedback
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                    {useLogin && <LoginButton />}
                </div>
            </header>
            <div className={styles.container}>
                <div className={styles.dentalGptContainer}>
                    <Button className={styles.buttons} onClick={() => navigate("/dental-gpt")}>
                        Dental GPT
                    </Button>
                    <div>
                        <p>
                            Say goodbye to manual data sifting and <br />
                            hello to lightning-fast, accurate analysis
                        </p>
                    </div>
                </div>
                <div className={styles.marketUpdatesContainer}>
                    <Button className={styles.buttons} onClick={() => navigate("/dental-compass")}>
                        Market Updates
                    </Button>
                    <div>
                        <p>
                            Comprehensive Media Coverage <br />
                            Advanced Visual Analytics <br />
                            Sentiment Analysis <br />
                            Advanced Filtering Options
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
