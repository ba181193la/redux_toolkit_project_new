import { Divider, Tooltip } from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import InvestigationCompletedDetails from './InvestigationCompletedDetails';
import { useTranslation } from 'react-i18next';
import BackArrow from '../../../../assets/Icons/white/left-arrow.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import { useNavigate, useParams } from 'react-router-dom';
import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import IncidentApprovalDetails from '../../IncidentCommon/IncidentApprovalDetails';
import IncidentInvestigationDetails from '../../IncidentCommon/IncidentInvestigationDetails';
import { checkAccess } from '../../../../utils/Auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const InvestigationCompletedView = () => {
  //* hooks declation
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedRoleFacility, selectedMenu, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  //* State variables
  const [roleMenu, setRoleMenu] = useState();

  //* Effect to set role menu
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  return (
    <>
      <FlexContainer
        width="100%"
        height="auto"
        flexDirection="column"
        justifyContent="center"
      >
        <FlexContainer justifyContent={'space-between'} padding="0 0 15px 0">
          <StyledTypography
            fontWeight="900"
            lineHeight="44px"
            color="#0083C0"
            whiteSpace={'nowrap'}
            sx={{
              fontSize: {
                xs: '1.5rem',
                sm: '1.75rem',
                md: '2rem',
                lg: '2rem',
              },
            }}
          >
            {t('IM_IncidentInvestigationApprovalDetails')}
          </StyledTypography>
        </FlexContainer>
        <FlexContainer width="100%" height="auto" flexDirection="column">
          <FlexContainer
            width="100%"
            height="auto"
            flexDirection="column"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
            }}
          >
            <FlexContainer
              alignItems="center"
              flexWrap="wrap"
              justifyContent="space-between"
              style={{
                margin: '10px 20px 5px 20px',
              }}
            >
              <StyledButton
                borderRadius="6px"
                gap="4px"
                padding="6px 10px"
                variant="contained"
                backgroundColor="#3498db"
                type="button"
                style={{
                  display: 'inline-flex',
                  gap: '5px',
                }}
                onClick={() =>
                  navigate('/IncidentManagement/IncidentInvestigationApproval')
                }
                startIcon={
                  <StyledImage
                    height="20px"
                    width="20px"
                    src={BackArrow}
                    alt="WhiteSearch"
                  />
                }
              >
                {t('Previous')}
              </StyledButton>
              {checkAccess(
                isSuperAdmin,
                roleMenu?.IsView,
                roleMenu?.IsPrint
              ) && (
                <Tooltip title="Download" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    cursor="pointer"
                    borderRadius="40px"
                    src={DownloadFileIcon}
                    alt="Download"
                    animate={true}
                    onClick={() => handleOnDownload('excel')}
                  />
                </Tooltip>
              )}
            </FlexContainer>
            <FlexContainer
              alignItems="center"
              width="100%"
              flexWrap="wrap"
              style={{
                padding: '20px',
              }}
            >
              <IncidentDetails />
              <IncidentApprovalDetails />
              <IncidentInvestigationDetails />
              <InvestigationCompletedDetails incidentId={id} />{' '}
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default InvestigationCompletedView;
