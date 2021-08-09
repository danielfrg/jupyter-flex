import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles({
    icon: { padding: "8px 8px" },
});

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            scroll="paper"
            maxWidth="md"
            fullWidth={true}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent dividers={true}>{props.children}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function IconDialogBtn(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <>
            <IconButton
                color="inherit"
                aria-haspopup="true"
                aria-label="Show dialog"
                onClick={handleClickOpen}
                className={`${classes.icon} ${props.className}`}
            >
                {props.icon}
            </IconButton>

            <SimpleDialog
                open={open}
                onClose={handleClose}
                selectedValue={selectedValue}
                title={props.title}
            >
                {props.content}
            </SimpleDialog>
        </>
    );
}
