import { Backdrop, Collapse, Tooltip } from '@mui/material';
import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../utils/StyledComponents';
import UploadFileIcon from '../../assets/Icons/UploadFileIcon.png';
import DownloadFileIcon from '../../assets/Icons/DownloadFileIcon.png';
import { useUploadStaffDataMutation } from '../../redux/RTK/staffMasterApi';
import exportToExcel from '../../utils/exportToExcel';
import SuccessGif from '../../assets/Gifs/SuccessGif.gif';
import { showSweetAlert, showToastAlert } from '../../utils/SweetAlert';

const ExcelImportModal = ({
  isOpen,
  onClose,
  filteredRecords,
  staffSampleData,
  setIsLoading,
  isLoading,
  setMessage,
  setColor,
  checkFileFormat,
  triggerUploadData,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  //   const [filteredRecords, setFilteredRecords] = useState([]);

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      onClose(); // Programmatically click the hidden file input
    }
  };
  const handleFileUploadChange = async (event) => {
    try {
      let file = event.target.files[0];
      setColor('#4caf50');
      setIsLoading(true);
      setMessage('Uploading ...');
      if (file) {
        if (!checkFileFormat(file)) {
          setColor('#e63a2e');
          setMessage('Invalid File Format');
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const response = await triggerUploadData({
          payload: formData,
        }).unwrap();
        if (response && response.Message) {
          showToastAlert({
            type: 'custom_success',
            text: response.Message,
            gif: SuccessGif,
          });
          refetch();
          setMessage('Upload completed');

          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        }
      }
    } catch (error) {
      if (error && error.data) {
        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
          gif: Error,
          showConfirmButton: true, // Show the close button
          confirmButtonText: 'Close', // Customize the close button text
        });
        setColor('#e63a2e');
        setMessage('Upload Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the input value
      }
    }
  };
  return (
    // <Modal
    //   isOpen={isOpen}
    //   onRequestClose={onClose}
    //   BackdropComponent={Backdrop}
    //   contentLabel="Incident Submitted"
    //   ariaHideApp={false}
    //   style={{
    //     overlay: {
    //       backgroundColor: "rgba(0, 0, 0, 0.5)",
    //     },
    //     content: {
    //       width: "200px",
    //       height: "100px",
    //       margin: "auto",
    //       textAlign: "center",
    //       borderRadius: "8px",
    //       padding: "20px",
    //     },
    //   }}
    // >
    //     <FlexContainer gap = "10px" justifyContent="center" margin = "auto">
    //     <StyledImage
    //                         height="40px"
    //                         width="40px"
    //                         gap="10px"
    //                         marginTop="10px"
    //                         cursor="pointer"
    //                         borderRadius="40px"
    //                         src={UploadFileIcon}
    //                         // disabled={!(filteredRecords?.length > 0)}
    //                         // onClick={handleUploadIconClick}
    //                         alt="Upload"
    //                         animate={true}
    //                       />
    //   <StyledImage
    //                         height="40px"
    //                         width="40px"
    //                         gap="10px"
    //                         marginTop="10px"
    //                         cursor="pointer"
    //                         borderRadius="40px"
    //                         src={UploadFileIcon}
    //                         // disabled={!(filteredRecords?.length > 0)}
    //                         // onClick={handleUploadIconClick}
    //                         alt="Upload"
    //                         animate={true}
    //                       />
    //                       </FlexContainer>

    // </Modal>
    <Collapse in={isOpen}>
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          bottom: '0',
          right: '0',
          zIndex: 1300,
        }}
      >
        {/* Overlay */}
        <div
          id="overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
          }}
        ></div>
        {/* Modal Dialog */}
        <div
          className="modal-dialog"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20%',
            maxWidth: '350px',
            zIndex: 1400,
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #0264AB',
          }}
        >
          <div className="modal-content">
            {/* Modal Header */}
            <div
              className="modal-header"
              style={{
                backgroundColor: '#0264AB',
                color: 'white',
                // padding: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #0264AB',
              }}
            >
              <h5
                className="modal-title"
                style={{ margin: 0, alignItems: 'center' }}
              >
                Upload
              </h5>
              {/* Custom Close Button */}
              <Tooltip title="Close" arrow>
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
                </button>
              </Tooltip>
            </div>
            {/* Modal Body */}
            <div
              className="modal-body"
              style={{
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                className="form-actions text-center"
                style={{
                  display: 'flex',
                  gap: '30px',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Import" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    marginTop="10px"
                    cursor="pointer"
                    borderRadius="40px"
                    src={UploadFileIcon}
                    // disabled={!(filteredRecords?.length > 0)}
                    // onClick={handleUploadIconClick}
                    alt="Upload"
                    onClick={handleUploadIconClick}
                    animate={true}
                  />
                </Tooltip>
                <input
                  type="file"
                  // accept=".xls,.xlsx"
                  ref={fileInputRef}
                  disabled={!(filteredRecords?.length > 0)}
                  style={{ display: 'none' }}
                  onChange={handleFileUploadChange}
                />
                <Tooltip title="Sample import" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    marginTop="10px"
                    cursor="pointer"
                    borderRadius="40px"
                    src={DownloadFileIcon}
                    // disabled={!(filteredRecords?.length > 0)}
                    onClick={() =>
                      exportToExcel(staffSampleData, 'UserData.xlsx')
                    }
                    alt="Upload"
                    animate={true}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Collapse>
  );
};

export default ExcelImportModal;
