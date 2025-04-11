import React from 'react'
import { Modal, Box, IconButton, Typography, Backdrop } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

const HarmLevelModal = ({ isHarmLevelModalOpen, closeHarmLevelModal }) => {
    return (
        <Modal
            open={isHarmLevelModalOpen}
            onClose={closeHarmLevelModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                style: { backdropFilter: 'blur(8px)' },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    bgcolor: 'white',
                    boxShadow: 24,
                    borderRadius: '8px',
                    outline: 'none',
                }}
            >
                <IconButton
                    onClick={closeHarmLevelModal}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#ccc',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '50%',
                        padding: '5px',
                        '&:hover': {
                            backgroundColor: '#999',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        background: '#0264AB',
                        color: 'white',
                        padding: '15px',
                        borderRadius: '8px 8px 0 0',
                    }}
                >
                    Harm Level
                </Typography>
                <div style={{ padding: '16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#d8280b',
                                        color: 'white',
                                    }}
                                >
                                    No Harm
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#f5f5f5',
                                    }}
                                >
                                    Incident occurred with no harm to the patient or person involved.
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#d8280b',
                                        color: 'white',
                                    }}
                                >
                                    Minor
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    No change in vital signs. Non-invasive diagnostic test required. Increased observation or monitoring required.
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#d8280b',
                                        color: 'white',
                                    }}
                                >
                                    Moderate
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#f5f5f5',
                                    }}
                                >
                                    Vital signs changes. Decreased level of consciousness. Additional medication/treatment required.
                                    Invasive diagnostic procedure required.
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#d8280b',
                                        color: 'white',
                                    }}
                                >
                                    Major
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    Any unexpected or unintended incident that caused permanent or long-term harm to one or more persons. Any unexpected or unintended incident that caused permanent or long-term harm to one or more persons.
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#d8280b',
                                        color: 'white',
                                    }}
                                >
                                    No Harm Level
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: 'white',
                                    }}
                                >Harm Definition
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#d8280b',
                                        color: 'white',
                                    }}
                                >
                                    ERGRT
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    JDBFVGERIURK
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: '#d8280b',
                                        color: 'white',
                                    }}
                                >
                                    1
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '15px',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    JDBFVGERIURK
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Box>
        </Modal>
    )
}

export default HarmLevelModal