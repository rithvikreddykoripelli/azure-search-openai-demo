import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogContent, DialogBody, DialogActions, Button } from "@fluentui/react-components";
import styles from "./PopUpWindow.module.css";
import { useState, useEffect } from "react";

export const PopUpWindow = () => {
    const popUpShown = localStorage.getItem("popupShown");
    let showPopup = true;

    if (popUpShown) {
        showPopup = false;
    }
    const [open, setOpen] = useState(showPopup);

    return (
        <Dialog
            open={open}
            onOpenChange={(event, data) => {
                localStorage.setItem("popupShown", "true");
                setOpen(data.open);
            }}
        >
            <DialogSurface className={styles.dialogSurface}>
                <DialogBody className={styles.dialogBody}>
                    <DialogTitle className={styles.dialogTitle}>Disclaimer</DialogTitle>
                    <DialogContent>
                        <br />
                        At <b>Dental Market Insights (DMI)</b>, we strive to provide the best assistance in every conversation, but no system is flawless.
                        <br />
                        <br />
                        <br />
                        <b>Please keep the following in mind: </b>
                        <br />
                        <br />
                        <b>DentalGPT</b> may sometimes generate incorrect or misleading information. Always verify insights through your own research.
                        <br />
                        <br />
                        <br /> <b>DentalGPT</b> is not intended to offer legal, financial, or medical advice. It’s designed to help you access and synthesize
                        market data, share insights within your organization, and make informed decisions.
                        <br />
                        <br />
                        <br />
                        DMI may update usage limits, functionality, or policies as we continue to improve. To unlock more features and enhance your experience,
                        consider upgrading your plan.
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button className={styles.promptButton} appearance="primary">
                                Sounds Good, Let's Begin
                            </Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
