import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  Container
} from '@mui/material';

// Create a simple new return page with a stepper
const NewReturnPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Select Order', 'Select Items', 'Return Reason', 'Review'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom>
          Create New Return
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>
          {activeStep === steps.length ? (
            <Box>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Return submitted successfully!
              </Typography>
              <Button onClick={handleReset}>Start New Return</Button>
            </Box>
          ) : (
            <Box>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}: {steps[activeStep]}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default NewReturnPage; 