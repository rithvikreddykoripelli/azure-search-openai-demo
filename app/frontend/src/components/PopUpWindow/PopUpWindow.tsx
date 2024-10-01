import * as React from "react";
import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogContent, DialogBody, DialogActions, Button } from "@fluentui/react-components";
import styles from "./PopUpWindow.module.css";

export const PopUpWindow = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    return (
        <Dialog open={open} onOpenChange={(event, data) => setOpen(data.open)}>
            <DialogSurface className={styles.dialogSurface}>
                <DialogBody className={styles.dialogBody}>
                    <DialogTitle className={styles.dialogTitle}>Disclaimer</DialogTitle>
                    <DialogContent>
                        At <b>Dental Market Insights (DMI)</b>, we strive to provide the best assistance in every conversation, but no system is flawless.
                        <br />
                        Please keep the following in mind: <br />
                        <b>DentalGPT</b> may sometimes generate incorrect or misleading information. Always verify insights through your own research.
                        <br /> <b>DentalGPT</b> is not intended to offer legal, financial, or medical advice. It’s designed to help you access and synthesize
                        market data, share insights within your organization, and make informed decisions.
                        <br /> DMI may update usage limits, functionality, or policies as we continue to improve. To unlock more features and enhance your
                        experience, consider upgrading your plan.
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
