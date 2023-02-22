import React, {useState} from 'react';
import {Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import {sendPDF} from '../../api/pdf';

const EmailModal = (props) => {
	const {companyId} = props;
	const [open, setOpen] = useState(false);

	const [value, setValue] = useState('');

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setValue('');
	};

	const handleOk = async () => {
		await sendPDF(companyId, value);
		setOpen(false);
		setValue('');
	};

	return (
		<>
			<Button style={{color: 'red', marginLeft: '10px', borderColor: 'black'}} variant="outlined" onClick={handleOpen}>
				Send PDF
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Email Address</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div>
							<input type="text" value={value} onChange={handleChange} />
						</div>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleOk} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default EmailModal;
