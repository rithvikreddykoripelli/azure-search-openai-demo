import { Outlet } from "react-router-dom";

import styles from "./Layout.module.css";

import NavBar from "../../components/NavBar/NavBar";

const Layout = () => {
    return (
        <div className={styles.layout}>
            <NavBar />
            <Outlet />
        </div>
    );
};

export default Layout;
