import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import BackArrow from '../../../../assets/Icons/white/left-arrow.png';
import { useTranslation } from 'react-i18next';
import { useNavigate, useNavigation } from 'react-router-dom';
import ReorderTable from './ReorderTable';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/language';

const ReorderMedicationHarmLevel = () => {
  //* Hooks Declaration
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  //* Selectors
  const { selectedMenu, selectedModuleId } = useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [pageFields, setPageFields] = useState([]);

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

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'Questions',
      translationId: 'IM_IS_RQ_QuestionText',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_RQ_P_QuestionText')
        ?.IsShow,
    },
  ];

  useEffect(() => {
    if (labels?.Data) {
      const regionList = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;
      const labelsList = regionList?.find(
        (x) => x.RegionCode === 'ALL'
      )?.Labels;
      setFieldLabels(labelsList);
    }
  }, [labels]);

  useEffect(() => {
    setPageFields(
      fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      )
        ?.Sections?.find(
          (sectionName) =>
            sectionName?.SectionName === 'Incident RCA Questions-Page'
        )
        ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields
    );
  }, [fieldAccess]);

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer
        marginBottom={'30px'}
        marginTop={'65px'}
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2rem',
            },
          }}
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {`${t('Reorder')} ${getlabel(
            'IM_IS_RQ_IncidentRCAQuestions',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )}`}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="100%"
        height="auto"
        flex="1"
        flexDirection="column"
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <FlexContainer
          alignItems="center"
          width="100%"
          style={{ paddingInline: '20px', marginBottom: '20px' }}
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
            onClick={() => navigate('/IncidentManagement/IncidentSubMaster')}
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
        </FlexContainer>
        <ReorderTable
          tableColumnList={tableColumnList}
          fieldLabels={fieldLabels}
          labelsStatus={labels?.Status}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default ReorderMedicationHarmLevel;
