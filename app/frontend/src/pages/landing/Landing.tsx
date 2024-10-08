import styles from "./Landing.module.css";

import { Button } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";

const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.layout}>
            <div className={styles.container}>
                <div className={styles.dentalGptContainer}>
                    <Button className={styles.buttons} onClick={() => navigate("/dental-gpt")}>
                        Dental GPT
                    </Button>
                    <div className={styles.descriptionContainer}>
                        <p>
                            DentalGPT simplifies market analysis by using cutting-edge AI technology to convert vast data into insightful reports, tailored
                            specifically for the dental industry.
                        </p>
                    </div>
                </div>
                <div className={styles.marketUpdatesContainer}>
                    <Button className={styles.buttons} onClick={() => navigate("/dental-compass")}>
                        Dental Compass
                    </Button>
                    <div className={styles.descriptionContainer}>
                        <p>
                            Stay ahead of the curve with Dental Compass, an intuitive platform delivering hand-picked dental market intelligence, competitor
                            updates, and consumer trends
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
