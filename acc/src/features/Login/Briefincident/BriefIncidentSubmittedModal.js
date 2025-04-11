import { Backdrop } from "@mui/material";
import React from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../../utils/StyledComponents";

const BriefIncidentSumittedModal = ({ isOpen, onClose, incidentNo }) => {
  const navigate = useNavigate()
  const handleClick =()=>{
    onClose,
    navigate("/login")
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      BackdropComponent={Backdrop}
      contentLabel="Incident Submitted"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "400px",
          height: "200px",
          margin: "auto",
          textAlign: "center",
          borderRadius: "8px",
          padding: "20px",
        },
      }}
    >
      <h2>Incident Submitted</h2>
      <p>Incident ID:  <strong>{incidentNo}</strong></p>
      <StyledButton
        
          backgroundColor= "green"
          color= "white"
          padding= "10px 20px"
          border= "none"
          borderRadius= "5px"
          cursor= "pointer"
          hoverColor="white"
        onClick={handleClick}
      >
        OK
      </StyledButton>
    </Modal>
  );
};

export default BriefIncidentSumittedModal;
