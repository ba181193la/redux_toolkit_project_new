import React, { useEffect, useState } from 'react';
import {
  ElementStore,
  ReactFormBuilder,
  ReactFormGenerator,
  Registry,
} from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import './formBuilder.css';
import {
  Button,
  Modal,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Tooltip,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import CustomEditComponent from '../../../components/FormBuilder/Table';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../components/FormBuilder/FormBuilder.scss';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../hooks/useWindowDimension';
import MyCustomInput from './MyCustomComponent';

Registry.register('TableComponent', CustomEditComponent);

Registry.register('myCustomInput', MyCustomInput);

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
  {
    key: 'Paragraph',
  },
  {
    key: 'RadioButtons',
  },
  {
    key: 'DatePicker',
  },
  {
    key: 'Dropdown',
  },
  {
    key: 'Checkboxes',
  },
  {
    key: 'table',
    name: 'Table',
    icon: 'fa fa-table',
    element: 'CustomElement',
    component: CustomEditComponent,
    type: 'custom',
    field_name: 'editable_table_component',
    static: true,
    props: { test: 'test_table' },
    label: 'Table Label',
  }, // other form items
  {
    key: 'table',
    name: 'Table',
    icon: 'fa fa-table',
    element: 'CustomElement',
    component: MyCustomInput,
    type: 'custom',
    field_name: 'editable_table_component',
    static: true,
    props: { test: 'test_table' },
    label: 'Table Label',
  },
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

const QuestionsFormBuilder = ({ questionsData, handleSubmit }) => {
  const { isMobile } = useWindowDimension();
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [key, setKey] = useState(0);

  const [data, setData] = useState([...questionsData] || []);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    if (questionsData) {
      setData([...questionsData]);
    }
  }, [questionsData]);

  const closeModal = () => {
    setPreviewVisible(false);
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <FlexContainer justifyContent={isMobile ? 'end' : 'space-between'}>
        <StyledTypography
          fontWeight="900"
          lineHeight="44px"
          color="#333333"
          whiteSpace={'nowrap'}
          sx={{
            fontSize: {
              xs: '1rem',
              sm: '1rem',
              md: '1.5rem',
              lg: '1.5rem',
            },
          }}
        >
          {t('FormBuilder')}
        </StyledTypography>
      </FlexContainer>

      <ReactFormBuilder
        key={key}
        toolbarItems={toolbarItems}
        style={{ marginTop: 0 }}
        data={data}
        onPost={(data) => {
          setData(data.task_data || data);
        }}
      />

      <FlexContainer
        justifyContent={isMobile ? 'space-between' : 'flex-end'}
        padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
        gap="10px"
        margin="20px 0"
      >
        <StyledButton
          variant="outlined"
          border="1px solid #C62828 !important"
          backgroundColor="#ffffff"
          type="button"
          colour="#C62828"
          height={'35px'}
          borderRadius="6px"
          sx={{ marginLeft: '10px' }}
          style={{ display: 'inline-flex', gap: '5px' }}
          onClick={() => {
            setData([]);
            setKey(key + 1);
          }}
        >
          {t('ClearAll')}
        </StyledButton>
        <StyledButton
          variant="outlined"
          border="1px solid #0083c0"
          backgroundColor="#ffffff"
          type="button"
          colour="#0083c0"
          height={'35px'}
          borderRadius="6px"
          sx={{ marginLeft: '10px' }}
          style={{ display: 'inline-flex', gap: '5px' }}
          onClick={() => {
            navigate('/IncidentManagement/IncidentCategory');
          }}
        >
          {t('Cancel')}
        </StyledButton>
        <StyledButton
          variant="contained"
          backgroundColor="#039BE5"
          color="success"
          onClick={() => setPreviewVisible(true)}
          height={'35px'}
          width={'120px'}
          padding={'10px'}
          disabled={data?.length <= 0}
        >
          {t('PreviewForm')}
        </StyledButton>
        <StyledButton
          variant="contained"
          color="success"
          onClick={() => handleSubmit(data)}
          height={'35px'}
          padding={'10px'}
        >
          {t('Submit')}
        </StyledButton>
      </FlexContainer>

      {/* Preview Form Modal */}

      <Dialog
        open={previewVisible}
        maxWidth={'lg'}
        fullWidth={true}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#0083c0',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
          }}
        >
          <StyledTypography
            fontWeight="700"
            lineHeight="44px"
            color="#FFFFFF"
            whiteSpace={'nowrap'}
            sx={{
              fontSize: {
                xs: '1rem',
                sm: '1rem',
                md: '1.3rem',
                lg: '1.3rem',
              },
            }}
          >
            {t('PreviewForm')}
          </StyledTypography>
          <IconButton
            onClick={closeModal}
            style={{
              padding: '0.7rem',
            }}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
              },
            }}
          >
            <Tooltip title="Close" arrow>
              <StyledImage src={CloseIcon} alt="Close Icon" />
            </Tooltip>
          </IconButton>
        </DialogTitle>
        <DialogContent paddingTop="10px">
          {Array.isArray(data) ? (
            <FlexContainer
              padding="10px 0"
              style={{ display: 'inline-block', width: '100%' }}
            >
              <ReactFormGenerator data={data} style={{ width: '100%' }} />
            </FlexContainer>
          ) : (
            <StyledTypography
              fontWeight="500"
              lineHeight="44px"
              color="#FFFFFF"
              whiteSpace={'nowrap'}
              sx={{
                fontSize: {
                  xs: '1rem',
                  sm: '1rem',
                  md: '1rem',
                  lg: '1rem',
                },
              }}
            >
              Please create form to preview!
            </StyledTypography>
          )}
        </DialogContent>
      </Dialog>
    </FlexContainer>
  );
};

export default QuestionsFormBuilder;
