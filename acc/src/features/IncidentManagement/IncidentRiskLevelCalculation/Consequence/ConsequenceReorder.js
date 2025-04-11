import {
  FlexContainer,
  StyledTypography,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import BackArrow from '../../../../assets/Icons/white/left-arrow.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, TextField } from '@mui/material';
import Label from '../../../../components/Label/Label';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { getlabel } from '../../../../utils/language';
import { IncidentRiskLevelReorder } from '../../../../components/MainContent/ImportStatements';
import ConsequenceReorderTable from "./ConsequenceReorderTable"

const ReorderIncidentType = () => {
  //* Hooks Declaration
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    regionCode,
    userDetails,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [filteredFacility, setFilteredFacility] = useState(null);

  //* RTK Queries
  const { data: labels = [], isFetching: labelsFetching } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: 2,
    // moduleId: selectedModuleId,
  });

  const searchLabels = labels?.Data?.filter((menu) => menu.MenuId === selectedMenu?.id)[0].Regions?.[0]?.Labels

  const { data: fieldAccess = [], isFetching: accessFetching } =
    useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: 2,
      // moduleId: selectedModuleId,
    });

  //* Variables declaration
  
  const tableColumnList = [
    // { id: 'Facility', translationId: 'Facility', isSelected: true },
    {
      id: 'CategoryAffected',
      translationId: 'IM_IRLC_C_CategoryAffected',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IRLC_C_P_CategoryAffected')?.IsShow,
    },
    {
      id: 'ConsequenceLevel',
      translationId: 'IM_IRLC_C_ConsequenceLevel',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IRLC_C_P_ConsequenceLevel')?.IsShow,
    },
    {
      id: 'Consequence',
      translationId: 'IM_IRLC_C_Consequence',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'IRLC_C_P_Consequence')?.IsShow,
    },
  ];

  const facilityList = userDetails?.ApplicableFacilities?.filter((facility) => {
    if (!facility.IsActive) return false;
    if (isSuperAdmin) return true;
    const facilityItem = roleFacilities
      ?.find((role) => role.FacilityId === facility.FacilityId)
      ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
    return facilityItem?.IsAdd;
  }).map((facility) => ({
    text: facility.FacilityName,
    value: facility.FacilityId,
  }));
  userDetails?.ApplicableFacilities?.filter((facility) => {
    if (!facility.IsActive) return false;
    if (isSuperAdmin) return true;
    const facilityItem = roleFacilities
      ?.find((role) => role.FacilityId === facility.FacilityId)
      ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
    return facilityItem?.IsAdd;
  }).map((facility) => ({
    text: facility.FacilityName,
    value: facility.FacilityId,
  }));

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
          (sectionName) => sectionName?.SectionName === 'Consequence-Page'
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
            'IM_IRLC_C_Consequence',
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
          justifyContent="space-between"
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
            onClick={() => navigate('/IncidentManagement/IncidentRisklevelCalculation')}
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
          {pageFields?.find((x) => x.FieldId === 'IS_IT_P_Facility')
            ?.IsShow && (
            <Grid
              item
              padding={'10px'}
              width="50%"
              sx={{
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '50%',
                  lg: '25%',
                  xl: '25%',
                },
              }}
            >
              <Label
                value={getlabel(
                  fieldLabels?.find(
                    (x) => x.TranslationId === 'IM_IS_IT_Facility'
                  )?.TranslationId,
                  {
                    Data: fieldLabels,
                    Status: labels?.Status,
                  },
                  i18n.language
                )}
              />
              <SearchDropdown
                disableClearable={true}
                name="facility"
                options={[
                  { text: 'Select', value: '' },
                  ...(facilityList || []),
                ]}
                getOptionLabel={(option) => option.text}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                sx={{
                  '& .MuiAutocomplete-inputRoot': {
                    fontSize: '13px',
                    height: '100%',
                  },
                  '& .MuiOutlinedInput-root': {
                    height: '34px',
                    '& .MuiAutocomplete-input': {
                      height: '34px',
                      fontSize: '13px',
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select"
                  />
                )}
                ListboxProps={{
                  sx: {
                    '& .MuiAutocomplete-option': {
                      fontSize: '13px',
                      minHeight: '30px',
                      display: 'flex',
                      alignItems: 'center',
                    },
                  },
                }}
                onChange={(event, value) => {
                  setFilteredFacility(value?.value);
                }}
              />
            </Grid>
          )}
        </FlexContainer>
        <ConsequenceReorderTable
          tableColumnList={tableColumnList}
          fieldLabels={fieldLabels}
          labelsStatus={labels?.Status}
          // filteredFacility={filteredFacility}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default ReorderIncidentType;




