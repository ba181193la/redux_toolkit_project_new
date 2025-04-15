import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from '@mui/material';
import {
  setTeamTableData,
  setEventTableData,
  setMailToTableData,
  setRootTableData,
  setFishBoneAttachmentData,
  setQuestionAnswersData,
  setAttachmentData,
  setCurrentIndex
} from '../../../../../redux/features/mainMaster/incidentRcaSlice.js';
import { useDispatch, useSelector } from 'react-redux';

const QuestionAnswers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [notApplicable, setNotApplicable] = useState(false);
  const dispatch = useDispatch();

  const QuestionAnswersData = useSelector(
    (state) => state.incidentRca.QuestionAnswersData
  );

  const currentIndex = useSelector((state) => state.incidentRca.currentIndex);


  const rcaQuestions = useSelector((state) => state.incidentRca.rcaQuestions);

  console.log('QuestionAnswersData', QuestionAnswersData);
  console.log('rcaQuestions', rcaQuestions);

  useEffect(() => {
    if (
      (QuestionAnswersData && QuestionAnswersData.length > 0) ||
      (rcaQuestions && rcaQuestions.length > 0)
    ) {
      setIsLoading(false);
    }
  }, [QuestionAnswersData, rcaQuestions]);

  const getCurrentQuestionData = () => {
    if (rcaQuestions && rcaQuestions.length > currentIndex) {
      return rcaQuestions[currentIndex];
    } else if (
      QuestionAnswersData &&
      QuestionAnswersData.length > currentIndex
    ) {
      return QuestionAnswersData[currentIndex];
    }
    return {
      id: currentIndex + 1,
      Questions: 'Question not available',
      QuestionsContent: 'Content not available',
    };
  };

  const handlePageSelect = (index) => {
    dispatch(setCurrentIndex(currentIndex + 1));
    setValue('');
    setRootCause('');
    setNotApplicable(false);
  };

  const handleNext = () => {
    const maxIndex = getMaxQuestionIndex();
    if (currentIndex < maxIndex - 1) {
      dispatch(setCurrentIndex(currentIndex + 1));
      setRootCause('');
      setNotApplicable(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      dispatch(setCurrentIndex(currentIndex - 1));
      setRootCause('');
      setNotApplicable(false);
    }
  };
  const RootTableData = useSelector((state) => state.incidentRca.rootTableData) || [];
  const existingRootTableData = Array.isArray(RootTableData) ? RootTableData : [];

  const handleRadioChange = (event, questionId) => {

    const newRootCause = event.target.value;

    const updatedQuestions = QuestionAnswersData.map((q) =>
      q.RCAQuestionsId === questionId ? { ...q, RootCause: newRootCause } : q
    );

    console.log('Updated Questions Data:', updatedQuestions);
    dispatch(setQuestionAnswersData(updatedQuestions));

    if (newRootCause !== 'Yes') {
      const filteredRootTableData = existingRootTableData.filter(
        (entry) => entry.RCAQuestionsId !== questionId
      );
  
      console.log('Filtered Root Table Data:', filteredRootTableData);
      dispatch(setRootTableData(filteredRootTableData));
      return;
    }


    console.log('Existing Root Table Data:', existingRootTableData);

    const rootTableEntry = {
      Department: '',
      UserName: '',
      TargetDate: '',
      AssignedTask: '',
      RootCauseFinding: currentQuestionData?.RootCauseFinding || '',
      RootCauseReference: currentQuestionData?.Questions || '',
      UserId: '',
      isEditable: true,
      RowNo: '',
      isManuallyAdded: false,
      RootCause: newRootCause,
      RCAQuestionsId: questionId,
    };
const updatedRootTableData = existingRootTableData.some(entry => entry.RCAQuestionsId === questionId)
  ? existingRootTableData.map(entry =>
      entry.RCAQuestionsId === questionId
        ? { ...entry, RootCause: newRootCause, RowNo: entry.RowNo || existingRootTableData.length + 1 } 
        : entry
    )
  : [...existingRootTableData, {
      ...rootTableEntry,
      RCAQuestionsId: questionId,
      RootCause: newRootCause,
      RowNo: existingRootTableData.length + 1 
    }];

    console.log('Updated Root Table Data:', updatedRootTableData);

    dispatch(setRootTableData(updatedRootTableData));
};


  const handleTextChange = (event, questionId) => {
    const newValue = event.target.value;

    const updatedQuestions = QuestionAnswersData.map((q) =>
      q.RCAQuestionsId === questionId ? { ...q, RootCauseFinding: newValue } : q
    );

    dispatch(setQuestionAnswersData(updatedQuestions));
  };

  const handleNotApplicableChange = (event) => {
    const newValue = event.target.checked;
    setNotApplicable(newValue);
  
    const updatedQuestions = QuestionAnswersData.map((q) =>
      q.RCAQuestionsId === currentQuestionData?.RCAQuestionsId
        ? { 
            ...q, 
            IsNotApplicable: newValue,
            RootCause: newValue ? "No" : q.RootCause, 
            RootCauseFinding: newValue ? "" : q.RootCauseFinding
          }
        : q
    );
  
    dispatch(setQuestionAnswersData(updatedQuestions));
  
    const updatedRootTableData = newValue 
    ? RootTableData.filter(entry => entry.RCAQuestionsId !== currentQuestionData?.RCAQuestionsId) 
    : RootTableData;

  dispatch(setRootTableData(updatedRootTableData));
  };
  
  

  const getMaxQuestionIndex = () => {
    if (rcaQuestions && rcaQuestions.length > 0) {
      return rcaQuestions.length;
    }
    if (QuestionAnswersData && QuestionAnswersData.length > 0) {
      return QuestionAnswersData.length;
    }
    return 0;
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxIndex = getMaxQuestionIndex();

    for (let i = 1; i <= maxIndex; i++) {
      buttons.push(
        <Button
          key={i}
          variant="outlined"
          //   onClick={() => handlePageSelect(i - 1)}

          sx={{
            minWidth: '36px',
            height: '36px',
            margin: '2px',
            borderColor: '#ccc',
            color: currentIndex === i - 1 ? '#000' : '#555',
            backgroundColor: currentIndex === i - 1 ? '#fff' : '#e6e6e6',
            fontWeight: currentIndex === i - 1 ? 'bold' : 'normal',
            '&:hover': {
              backgroundColor: '#eee',
              borderColor: '#adadad',
            },
            padding: '6px 12px',
            lineHeight: 1.42857143,
            borderRadius: '4px',
          }}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  const currentQuestionData = getCurrentQuestionData();

  return (
    <Paper
      elevation={1}
      sx={{ p: 2, my: 2, borderRadius: 1, border: '1px solid #ddd' }}
    >
      {isLoading ? (
        <Typography>Loading questions...</Typography>
      ) : (
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              mb: 2,
              py: 1,
              px: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #ddd',
              gap: '3px',
            }}
          >
            {renderPaginationButtons()}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            {currentIndex > 0 ? (
              <Button
                variant="contained"
                onClick={handlePrevious}
                sx={{
                  backgroundColor: '#5cb85c',
                  '&:hover': { backgroundColor: '#449d44' },
                  borderRadius: '4px',
                  textTransform: 'none',
                  px: 2,
                }}
              >
                « Previous
              </Button>
            ) : (
              <Box sx={{ width: '100px' }} />
            )}

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={currentIndex >= getMaxQuestionIndex() - 1}
              sx={{
                backgroundColor: '#5cb85c',
                '&:hover': { backgroundColor: '#449d44' },
                borderRadius: '4px',
                textTransform: 'none',
                px: 2,
              }}
            >
              Next »
            </Button>
          </Box>

          <Box
            sx={{
              backgroundColor: '#3498db',
              color: 'white',
              p: 2,
              borderRadius: '4px',
              mb: 2,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            <Typography variant="h6">
              {currentIndex + 1}. {currentQuestionData.Questions}
            </Typography>
          </Box>

          <Box sx={{ mb: 2, px: 1 }}>
            {currentQuestionData.QuestionsContent?.includes('<') ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: currentQuestionData?.QuestionsContent,
                }}
                style={{ marginBottom: '24px' }}
              />
            ) : (
              <Typography variant="body1" sx={{ mb: 3 }}>
                {currentQuestionData?.QuestionsContent}
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography component="span" sx={{ fontWeight: 'bold' }}>
                Root Cause Findings *:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <Checkbox
                  checked={currentQuestionData?.IsNotApplicable}
                  onChange={handleNotApplicableChange}
                  sx={{ color: '#777', '&.Mui-checked': { color: '#333' } }}
                />
                <Typography component="span" sx={{ mr: 1, color: '#333' }}>
                  Not Applicable
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={
                notApplicable
                  ? 'Not Applicable'
                  : currentQuestionData?.RootCauseFinding || ''
              }
              onChange={(event) => {
                handleTextChange(event, currentQuestionData?.RCAQuestionsId);
                console.log(
                  'currentQuestionData?.RCAQuestionsId',
                  currentQuestionData?.RCAQuestionsId
                );
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                },
              }}
              disabled={currentQuestionData?.IsNotApplicable}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                Root Cause *:
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name="root-cause-radio"
                  value={currentQuestionData?.RootCause?.trim() || ''}
                  onChange={(event) =>
                    handleRadioChange(
                      event,
                      currentQuestionData?.RCAQuestionsId
                    )
                  }
                  sx={{ gap: 2 }}
                >
                  <FormControlLabel
                    value="Yes"
                    control={
                      <Radio
                        sx={{
                          color: '#777',
                          '&.Mui-checked': { color: '#333' },
                        }}
                      />
                    }
                    label="Yes"
                    disabled={notApplicable}
                  />
                  <FormControlLabel
                    value="No"
                    control={
                      <Radio
                        sx={{
                          color: '#777',
                          '&.Mui-checked': { color: '#333' },
                        }}
                      />
                    }
                    label="No"
                    disabled={notApplicable}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default QuestionAnswers;
