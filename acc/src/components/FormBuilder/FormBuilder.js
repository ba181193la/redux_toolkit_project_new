import React, { useEffect, useState } from 'react';
import {
  ReactFormBuilder,
  ReactFormGenerator,
  Registry,
} from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import { Button, Modal, Box, Typography } from '@mui/material';
import { FlexContainer, StyledButton } from '../../utils/StyledComponents';
import CustomEditComponent from './Table';
import { useSelector } from 'react-redux';
import useWindowDimension from '../../hooks/useWindowDimension';
import Dropdown from '../Dropdown/Dropdown';
import { useParams } from 'react-router-dom';
import './FormBuilder.scss';
import { showToastAlert } from '../../utils/SweetAlert';
import {
  useAddFormMutation,
  useGetFormBuilderByIdQuery,
} from '../../redux/RTK/formBuilderApi';
import { useTranslation } from 'react-i18next';

Registry.register('TableComponent', CustomEditComponent);

// Define Toolbar Items
const toolbarItems = [
  {
    key: 'Header',
  },
  {
    key: 'Label',
    icon: 'fa fa-list-ul',
  },
  {
    key: 'TextInput',
  },
  // {
  //   key: 'Paragraph',
  // },
  {
    key: 'RadioButtons',
  },
  // {
  //   key: 'DatePicker',
  // },
  {
    key: 'Dropdown',
  },
  {
    key: 'Checkboxes',
  },
  // {
  //   key: 'table',
  //   name: 'Table',
  //   icon: 'fa fa-table',
  //   element: 'CustomElement',
  //   component: CustomEditComponent,
  //   type: 'custom',
  //   field_name: 'editable_table_component',
  //   static: true,
  //   props: { test: 'test_table' },
  //   label: 'Table Label',
  // },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FormBuilder = () => {
  const { isMobile } = useWindowDimension();
  const { menuDetails, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);
  const { id } = useParams();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [key, setKey] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(id);

  const [triggerAddForm, { isLoading }] = useAddFormMutation();

  const urlParams = new URLSearchParams(window.location.search);
  const tabs = urlParams.get('tabs');

  const { data: dynamicFormData } = useGetFormBuilderByIdQuery(
    {
      menuId: selectedMenu,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      headerFacilityId: selectedFacility?.id,
      tabs: tabs ? parseInt(tabs) : 0,
    },
    { skip: !selectedMenu || !userDetails?.UserId || !selectedModuleId }
  );

  useEffect(() => {
    if (dynamicFormData) {
      setData(dynamicFormData?.Data);
      setKey(key + 1);
    }
  }, [dynamicFormData]);

  const closeModal = () => {
    setPreviewVisible(false);
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <FlexContainer justifyContent={isMobile ? 'end' : 'space-between'}>
        <h2>{t('FormBuilder')}</h2>
        <FlexContainer
          justifyContent={isMobile ? 'space-between' : 'end'}
          padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
          gap="10px"
        >
          {/* <Dropdown
            name="selectedModule"
            width="220px"
            height={'32px'}
            value={selectedMenu}
            onChange={(e) => setSelectedMenu(e.target.value)}
            label="Select Column"
            options={menuDetails
              ?.filter((item) => item.ParentMenuId)
              ?.map((menu) => {
                return {
                  text: menu.MenuName,
                  value: menu.MenuId,
                };
              })}
          /> */}

          <StyledButton
            variant="contained"
            color="success"
            onClick={() => setPreviewVisible(true)}
            height={'32px'}
            width={'120px'}
            padding={'10px'}
            disabled={data?.length <= 0}
          >
            {t('PreviewForm')}
          </StyledButton>
          <StyledButton
            variant="contained"
            color="success"
            onClick={async () => {
              try {
                await triggerAddForm({
                  payload: {
                    menuId: Number(id),
                    formData: data,
                    moduleId: selectedModuleId,
                    loginUserId: userDetails?.UserId,
                    tabs: tabs ? parseInt(tabs) : 0,
                  },
                }).unwrap();
                showToastAlert({
                  type: 'custom_success',
                  text: 'Form Saved!',
                  gif: 'SuccessGif',
                });
              } catch (error) {
                showToastAlert({
                  type: 'custom_error',
                  text: error.data,
                  gif: 'InfoGif',
                });
              }
            }}
            height={'32px'}
            width={'100px'}
            padding={'10px'}
          >
            {isLoading ? 'Saving...' : t('SaveForm')}
          </StyledButton>
        </FlexContainer>
      </FlexContainer>

      <ReactFormBuilder
        key={key}
        toolbarItems={toolbarItems}
        style={{ marginTop: 0 }}
        data={data}
        onPost={(data) => {
          setData(data.task_data);
        }}
        // renderEditForm={(props) => <CustomFormElementsEdit {...props} />}
      />
      {/* Preview Form Modal */}
      <Modal
        open={previewVisible}
        onClose={closeModal}
        aria-labelledby="preview-modal-title"
      >
        <Box sx={style}>
          {Array.isArray(data) ? (
            <>
              <Typography id="preview-modal-title" variant="h6">
                {t('PreviewForm')}
              </Typography>
              <ReactFormGenerator data={data} />
              <Button onClick={closeModal} variant="contained">
                {t('Close')}
              </Button>{' '}
            </>
          ) : (
            <Typography id="preview-modal-title" variant="h6">
              Please create form to preview!
            </Typography>
          )}
        </Box>
      </Modal>
    </FlexContainer>
  );
};

export default FormBuilder;
