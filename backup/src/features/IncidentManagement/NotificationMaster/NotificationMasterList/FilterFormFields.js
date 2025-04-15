import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/IncidentLabels';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/notificationMasterSlice';
import { useGetVariableDetailsQuery } from '../../../../redux/RTK/notificationMasterApi';
import { Grid } from '@mui/material';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { useEffect, useState } from 'react';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const FilterFormFields = ({ fields, handleToggleFilter, labels, records }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  const { selectedMenu, selectedModuleId, userDetails } = useSelector(
    (state) => state.auth
  );
  const initialValues = {
    pageName: '',
    task: '',
  };
  const [selectedPageId, setSelectedPageId] = useState(initialValues.pageName);
  const [taskOptions, setTaskOptions] = useState([]);
  useEffect(() => {
    if (selectedPageId) {
      const filteredTasks =
        pageLoadData?.Data?.TaskList?.filter(
          (task) => task.MenuId === selectedPageId
        ).map((task) => ({
          text: task.MailTask,
          value: task.MailTaskId,
        })) || [];

      setTaskOptions(filteredTasks);
    } else {
      setTaskOptions([]);
    }
  }, [selectedPageId, pageLoadData]);

  const { pageSize, pageIndex } = useSelector(
    (state) => state.notificationMaster.filters
  );

  const { data: pageLoadData } = useGetVariableDetailsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
    loginUserId: userDetails?.UserId,
  });

  const fieldsConfig = [
    {
      fieldId: 'NM_S_PageName',
      translationId: 'IM_NM_PageName',
      component: 'Dropdown',
      name: 'pageName',
      options: pageLoadData?.Data?.MenuList?.filter(
        (page) =>
          page?.ParentMenuId !== null &&
          records?.some((record) => record.MenuId === page.MenuId)
      ).map((page) => ({
        text: page.MenuName,
        value: page.MenuId,
      })),
    },
    {
      fieldId: 'NM_S_Task',
      translationId: 'IM_NM_Task',
      component: 'Dropdown',
      name: 'task',
      options: taskOptions,
    },
  ];

  const searchFields = fields?.Data?.Menus?.[0]?.Sections?.find(
    ({ SectionName }) => SectionName === 'Search'
  )?.Regions?.[0]?.Fields;

  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          dispatch(
            setFilters({
              pageIndex: pageIndex,
              pageSize,
              loginUserId: userDetails.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              pageMenuId: values?.pageName || 0,
              mailTaskId: values?.task || 0,
            })
          );
          dispatch(setIsFilterApplied(true));

           handleToggleFilter();
        }}
      >
        {({ handleSubmit, setFieldValue, resetForm, values }) => (
          <Grid container spacing={2} display={'flex'}>
            {searchFields?.map((field) => {
              const fieldConfig = fieldsConfig.find(
                (config) => config.fieldId === field.FieldId
              );
              const translatedLabel = getlabel(
                fieldConfig?.translationId,
                labels,
                i18n.language
              );
              if (field.IsShow && fieldConfig) {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    padding={'10px'}
                    md={3}
                    key={field.fieldId}
                  >
                    <Label value={translatedLabel} />
                    {fieldConfig.component === 'Dropdown' && (
                      <SearchDropdown
                        name={fieldConfig.name}
                        options={[...(fieldConfig.options || [])]}
                        getOptionLabel={(option) => option.text}
                        disabled={fieldConfig.name === 'task'&& !values.pageName }
                        onChange={(e, value) => {
                          setFieldValue(fieldConfig.name, value?.value);
                          if (fieldConfig.name === 'pageName') {
                            setSelectedPageId(value?.value || null);
                          }
                        }}
                        value={
                          fieldConfig?.options?.find(
                            (option) =>
                              option.value === values[fieldConfig.name]
                          ) || null
                        }
                      />
                    )}

                    {fieldConfig.component === 'MultiSelectDropdown' && (
                      <MultiSelectDropdown
                        name={fieldConfig.name}
                        options={fieldConfig.options}
                        required={field.IsMandatory}
                      />
                    )}
                  </Grid>
                );
              }
              return null;
            })}
            <Grid
              item
              xs={12}
              padding="10px"
              gap={isMobile ? '16px' : '8px'}
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              justifyContent={isMobile ? 'center' : 'flex-end'}
            >
              <StyledButton
                borderRadius="6px"
                gap="4px"
                padding="6px 10px"
                variant="contained"
                color="primary"
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={WhiteSearch}
                    alt="WhiteSearch"
                  />
                }
                onClick={handleSubmit}
                type="submit"
              >
                {t('Search')}
              </StyledButton>
              <StyledButton
                variant="outlined"
                border="1px solid #0083c0"
                backgroundColor="#ffffff"
                colour="#0083c0"
                gap="8px"
                borderRadius="6px"
                sx={{ marginLeft: isMobile ? '0' : '10px' }}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={Eraser}
                    alt="Eraser"
                  />
                }
                onClick={() => {
                  dispatch(resetFilters());
                  resetForm();
                }}
              >
                {t('ClearAll')}
              </StyledButton>
            </Grid>
          </Grid>
        )}
      </Formik>
    </>
  );
};

export default FilterFormFields;
