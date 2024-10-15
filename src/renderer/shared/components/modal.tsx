import { Modal, Box, Button } from '@mui/material';

// Style for the modal box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  maxHeight: '98vh',
  minHeight: '20vh',
  overflowY: 'auto',
  color: '#fff',
  borderRadius: 2.5,
};

function ModalWrapper({ children, open, handleClose, width = 500 }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={{ ...style, width }}>{children}</Box>
    </Modal>
  );
}

export default ModalWrapper;
