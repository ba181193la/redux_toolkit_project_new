import { Backdrop } from "@mui/material";
import React from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../../../utils/StyledComponents";

const OpinionAccess = ({ opinionAccessModal, onClose, incidentNo }) => {
  const navigate = useNavigate()
  const handleClick =()=>{
    onClose,
    navigate("/login")
  }
  return (
    <Modal
      isOpen={opinionAccessModal}
      onRequestClose={onClose}
      BackdropComponent={Backdrop}
    //   contentLabel="Incident Submitted"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "400px",
          height: "150px",
          margin: "auto",
          textAlign: "center",
          borderRadius: "8px",
          padding: "20px",
        },
      }}
    >
      <p>Dont have access to submit this opinion</p>
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

export default OpinionAccess;
