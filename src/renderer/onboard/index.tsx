import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingButton from '@mui/lab/LoadingButton';
import Check from '@mui/icons-material/Check';
import * as api from '@renderer/shared/api/fetch';

import './onboard.css';
import PageLayout from '@renderer/shared/components/layout/page-layout';
import OnboardingStepper from './components/stepper';
import ReferencesInput from './components/references';
import {
  apiKeyOpenAIAtom,
  autoScrapeDatesAtom,
  canGoNextAtom,
  inputIdsAtom,
  onboardingStateAtom,
  completeOnboardingAtom,
  addInitialReferencesAtom,
} from './store';
import UserSettings from './components/settings';
import { useNavigate } from 'react-router-dom';
import { colors } from '@renderer/shared/styles/theme';

const steps = ['References', 'Settings'];

const OnboardPage = () => {
  return (
    <PageLayout padding={3}>
      <OnboardFlow />
    </PageLayout>
  );
};

function OnboardFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setStepperCompleted] = useState<{ [k: number]: boolean }>({});

  // const setOnboardingState = useSetAtom(onboardingStateAtom);
  const inputIds = useAtomValue(inputIdsAtom);
  const autoScrapeNewDates = useAtomValue(autoScrapeDatesAtom);

  const completeOnboarding = useSetAtom(completeOnboardingAtom);
  const addInitialReferences = useSetAtom(addInitialReferencesAtom);
  const navigate = useNavigate();

  const handleSkip = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleStep = (step: number) => () => {
  //   setActiveStep(step);
  // };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      const success = await completeOnboarding();
      if (success) {
        navigate('/backfill?isNewUser=true');
      }
    } else {
      const success = await addInitialReferences();

      if (success) {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setStepperCompleted(newCompleted);

        setActiveStep(activeStep + 1);
      }
      // handleSkip();
    }
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setStepperCompleted({});
  // };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <OnboardingStepper
        {...{
          steps,
          activeStep,
          completed,
          // handleStep,
        }}
      />
      <div>
        {/* {allStepsCompleted() ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : ()} */}

        <>
          <Paper
            elevation={2}
            style={{
              backgroundColor: colors.palette.background.paper,
              paddingTop: '2rem',
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '35rem',
              width: '70rem',
              overflow: 'auto',
            }}
            className="px-12 mx-auto"
          >
            <RenderByState activeStep={activeStep} />
          </Paper>

          <NavigationButtons
            {...{
              activeStep,
              steps,
              handleBack,
              handleSkip,
              handleNext,
            }}
          />
        </>
      </div>
    </Box>
  );
}

const RenderByState = ({ activeStep }) => {
  switch (activeStep) {
    case 0:
      return <ReferencesInput />;
    case 1:
      return <UserSettings />;
  }

  return null;
};

function NavigationButtons({ activeStep, steps, handleBack, handleSkip, handleNext }) {
  const canGoNext = useAtomValue(canGoNextAtom);
  const state = useAtomValue(onboardingStateAtom);
  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  return (
    <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div className="flex justify-between" style={{ width: '20rem' }}>
        <Button
          color="secondary"
          variant="contained"
          disabled={isFirstStep || state === 'loading'}
          onClick={handleBack}
        >
          <ArrowBackIcon sx={{ height: 20, width: 20 }} />
          Back
        </Button>
        {isFirstStep && (
          <Button disabled={canGoNext} onClick={handleSkip} sx={{ mr: 1 }} color="inherit">
            Skip
          </Button>
        )}

        {!isLastStep ? (
          <LoadingButton
            variant="contained"
            disabled={!canGoNext}
            onClick={handleNext}
            loading={state === 'loading'}
          >
            Next
            <ArrowForwardIcon sx={{ ml: 1, height: 20, width: 20 }} />
          </LoadingButton>
        ) : (
          <LoadingButton
            variant="contained"
            onClick={handleNext}
            loading={state === 'loading'}
            sx={{ pr: 1.5 }}
          >
            Done
            <Check sx={{ ml: 1.1, mt: -0.75 }} />
          </LoadingButton>
        )}
      </div>
    </Box>
  );
}

export default OnboardPage;
