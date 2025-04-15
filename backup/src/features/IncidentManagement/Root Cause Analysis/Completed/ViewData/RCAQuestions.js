import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

const RCAQuestions = ({ questions = [] }) => {
  const [displayedQuestions, setDisplayedQuestions] = useState([]);

  useEffect(() => {
     if (questions.length > 0 && displayedQuestions.length < questions.length) {
       setDisplayedQuestions(questions);
     }
   }, [questions]);

  if (!questions || questions.length === 0) {
    return <Typography>No questions available</Typography>;
  }

  return (
    <Box>
      {displayedQuestions.map((questionData, index) => (
        <Box key={index} sx={{ mb: 4 }}>
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
              {index + 1}. {questionData?.Questions}
            </Typography>
          </Box>

          <Box sx={{ mb: 2, px: 1 }}>
            {questionData?.QuestionsContent?.includes('<') ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: questionData?.QuestionsContent,
                }}
                style={{ marginBottom: '24px' }}
              />
            ) : (
              <Typography variant="body1" sx={{ mb: 3 }}>
                {questionData?.QuestionsContent}
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  component="span"
                  sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                >
                  Root Cause Findings:
                </Typography>
                <Typography>{questionData?.RootCauseFinding || ''}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox checked={questionData?.IsNotApplicable} disabled />
                <Typography sx={{ fontWeight: 'bold' }}>
                  Not Applicable
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography
                component="span"
                sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
              >
                Root Cause:
              </Typography>
              <Typography>{questionData?.RootCause || ''}</Typography>
            </Box>
          </Box>

          {index < displayedQuestions.length - 1 && <Divider sx={{ my: 3 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default RCAQuestions;
