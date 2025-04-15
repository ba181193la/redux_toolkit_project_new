import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import ReferenceNumber from './ReferenceNumber/ReferenceNumber';
import IncidentType from './IncidentType/IncidentType';
import HarmLevel from './HarmLevel/HarmLevel';
import MedicationIncidentHarmLevel from './MedicationIncidentHarmLevel/MedicationIncidentHarmLevel';
import ContributingMainFactor from './ContributingMainFactor/ContributingMainFactor';
import ContributingSubFactor from './ContributingSubFactor/ContributingSubFactor';
import LevelOfStaffNegligence from './LevelOfStaffNegligence/LevelOfstaffNegligence';
import ReportToExternalBody from './ReportToExternalBody/ReportToExternalBody';
import JawdaIncidentLevel from './JAWDAIncidentLevel/JawdaIncidentLevel';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import IncidentSearchDataAccess from './IncidentSearchDataAccess/IncidentSearchDataAccess';
import ClinicalNonClinicalDefinition from './ClinicalNonClinicalDefinition/ClinicalNonClinicalDefinition';
import CommonSetup from './CommonSetup/CommonSetup';
import { useSelector } from 'react-redux';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { saveAs } from 'file-saver';
import ReportCustomization from './ReportCustomization/ReportCustomization';
import ClosureTat from './ClosureTAT/ClosureTat';
import RCAQuestions from './RCAQuestions/RCAQuestions';
import { Grid } from '@mui/material';
import PlusIcon from '../../../assets/Icons/AddSubMaster.png';
import { useState } from 'react';

const {
  FlexContainer,
  StyledTypography,
  StyledImage,
  StyledButton,
} = require('../../../utils/StyledComponents');

const IncidentSubMaster = () => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* State Variables
  const [expandAll, setExpandAll] = useState(false);

  //* Selectors
  const { selectedMenu, selectedModuleId } = useSelector((state) => state.auth);

  //* RTK Queries
  const { data: labels = [], isFetching: labelsFetching } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: 2,
    // moduleId: selectedModuleId,
  });

  const { data: fieldAccess = [], isFetching: accessFetching } =
    useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: 2,
      // moduleId: selectedModuleId,
    });

  return (
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
          {t('IM_IncidentSubMaster')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="30px 15px 30px 15px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
          gap="20px"
        >
          {labelsFetching || accessFetching ? (
            <FlexContainer
              width="100%"
              height="65vh"
              justifyContent="center"
              alignItems="center"
            >
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <>
              <FlexContainer
                style={{
                  justifyContent: 'flex-end',
                  width: '100%',
                  flexWrap: 'wrap',
                  alignItems: 'cemter',
                }}
              >
                {!expandAll && (
                  <StyledButton
                    onClick={() => {
                      setExpandAll(true);
                    }}
                    fontSize="13px"
                    backgroundColor="#0083c0"
                    style={{
                      display: 'inline-flex',
                      gap: '8px',
                      float: 'right',
                      cursor: 'pointer',
                    }}
                  >
                    {t('ExpandAll')}
                  </StyledButton>
                )}
                {expandAll && (
                  <StyledButton
                    onClick={() => {
                      setExpandAll(false);
                    }}
                    fontSize="13px"
                    backgroundColor="#0083c0"
                    style={{
                      display: 'inline-flex',
                      gap: '8px',
                      float: 'right',
                      cursor: 'pointer',
                    }}
                  >
                    {t('CollapseAll')}
                  </StyledButton>
                )}
              </FlexContainer>
              <ReferenceNumber
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <IncidentType
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <HarmLevel
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <MedicationIncidentHarmLevel
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <ContributingMainFactor
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <ContributingSubFactor
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <LevelOfStaffNegligence
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <ReportToExternalBody
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <JawdaIncidentLevel
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <IncidentSearchDataAccess
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <ClinicalNonClinicalDefinition
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <CommonSetup
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <ReportCustomization
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <ClosureTat
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
              <RCAQuestions
                labels={labels}
                fieldAccess={fieldAccess}
                expandAll={expandAll}
              />
            </>
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default IncidentSubMaster;
