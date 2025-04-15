import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Checkbox, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Editgif from '../../../assets/Gifs/Edit.gif';
import EditIcon from '../../../assets/Icons/EditIcon.png';
import CancelIcon from '../../../assets/Icons/RCANotRequired.png';
import SubmitIcon from '../../../assets/Icons/RCARequired.png';
import { showSweetAlert } from '../../../utils/SweetAlert';
import { showToastAlert } from '../../../utils/SweetAlert';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import {
  useGetPendingTasksQuery,
  useUpdatePendingTasksMutation
} from '../../../redux/RTK/homePageSettingsApi';
import useWindowDimension from '../../../hooks/useWindowDimension';

function ShowPendingTask() {
  const { i18n, t } = useTranslation();
  const { isMobile, isTablet } = useWindowDimension();
  const [isShowPendingTask, setIsShowPendingTask] = useState(true)
  const [isEditShowPendingTask, setIsEditShowPendingTask] = useState(false)
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility, } = useSelector((state) => state.auth);
  const [triggerUpdatePendingTask] = useUpdatePendingTasksMutation();


  const { data: labels = [], isFetching: isFetchingLabels } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );


  const { data: { updatePendingTaskData } = {}, isFetching: isUpdatePendingTask } = useGetPendingTasksQuery(
    {
      loginUserId: userDetails?.UserId,
    },
    {
      skip: !userDetails?.UserId,
      refetchOnMountOrArgChange: true,
    }
  )
  const handleEditPendingTask = async () => {
    const callback = async () => {
      try {
        let response = await triggerUpdatePendingTask(
          {
            payload: {
              LoginUserId: userDetails?.UserId,
              IsShowPendingHomeDashboard: isShowPendingTask
            }

          }
        ).unwrap();
        if (response && response.Message) {
          setIsEditShowPendingTask(false)
          showToastAlert({
            type: 'custom_success',
            text: response.Message,
            gif: 'SuccessGif'
          });
        }
      } catch (error) {
        showToastAlert({
          type: 'custom_error',
          text: error.message,
          gif: 'InfoGif',
        });
        setIsEditShowPendingTask(false)
      }
    };
    showSweetAlert({
      type: 'edit',
      title: 'Are you sure?',
      text: "",
      gif: Editgif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, edit it!',
    })
  }
  useEffect(() => {
    if (updatePendingTaskData) {
      if (['True', true].includes(updatePendingTaskData.IsShowPendingHomeDashboard)) {
        setIsShowPendingTask(true)
      } else {
        setIsShowPendingTask(false)
      }
    }
  }, [updatePendingTaskData])
  return (
    <FlexContainer
      display='flex'
      flexDirection={isMobile ? 'column' : 'row'}
      width='100%'
      minHeight={isMobile ? '10px' : '10px'}
      marginTop="15px"
      border="1px solid black"
    >
      <FlexContainer
        flex="1"
        display="flex"
        justifyContent='center'
        alignItems='center'
        padding='10px'
        backgroundColor='#38753F'
      >
        <StyledTypography fontSize="16px" color="#fff">
          {t('MM_PendingTasksShortcut')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width='1px' /* Width of the divider */
        backgroundColor='black'/* Divider color */
      ></FlexContainer>
      <FlexContainer
        flex="1"   
      >
        <FlexContainer
         width= {isMobile?"100%":"75%"} 
         display="flex"
         justifyContent="flex-start"  // Aligns items to the start
         alignItems='center'
         gap="8px"  // Adjust spacing between items
         fonSize='20px'
         padding='10px'
        >
          <Checkbox
            checked={isShowPendingTask}
            onChange={(e) => setIsShowPendingTask(e.target.checked)}
            color="primary"
            disabled={!isEditShowPendingTask}
          />
          <StyledTypography fontSize="14px"  color="#333">
            {t('MM_ShowPendingTasksShortcut')}
          </StyledTypography>
          <FlexContainer
            display="flex"
            padding='10px'
            flexDirection="row">

            {!isEditShowPendingTask && (
              <Tooltip title="Edit" arrow>
                <StyledImage
                  src={EditIcon}
                  alt="Edit Icon"
                  height="20px"
                  width="20px"
                  style={{ cursor: 'pointer', marginLeft: '10px' }}
                  onClick={() => {
                    setIsEditShowPendingTask(true);
                  }}
                />
              </Tooltip>
            )}
            {isEditShowPendingTask && (
              <>
                <Tooltip title="Submit" arrow>

                  <StyledImage
                    src={SubmitIcon}
                    alt="Submit Icon"
                    height="20px"
                    width="20px"
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={handleEditPendingTask}
                  />
                </Tooltip>
                <Tooltip title="Cancel" arrow>

                  <StyledImage
                    src={CancelIcon}
                    alt="Cancel Icon"
                    height="20px"
                    width="20px"
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => setIsEditShowPendingTask(false)}
                  />
                </Tooltip>
              </>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>

    </FlexContainer>
  )
}

export default ShowPendingTask