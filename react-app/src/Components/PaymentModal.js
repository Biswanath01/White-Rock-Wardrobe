import React, {useState} from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function PaymentModal(props) {
    const [optionsArray, setOptionsArray] = useState(["Enter Card Number", "Enter Bank Account Number:", "Enter UPI Id:", "Enter delivery Address"]);
     
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={props.open}
            onClose={props.handleClose}
            closeAfterTransition
        >
            <Fade in={props.open}>
            <Box sx={style}>
                <select onChange={(e)=> props.paymentMethodHandler(e)}>
                    <option disabled selected>Select a option</option>
                    <option value={1}>Debit/Credit Card</option>
                    <option value={2}>Net Banking</option>
                    <option value={3}>UPI</option>
                    <option value={4}>COD</option>
                </select>

                {props.paymentMethod && <input placeholder={optionsArray[props.paymentMethod - 1]} onChange={(event) => props.setCardNoFn(event.target.value)} />}

            <Button 
            disabled={props.cardNo.length === 0} 
            variant="contained" onClick={props.handlePayment}>
                Process Payment</Button>
            </Box>
            </Fade>
        </Modal>
  );
}
