import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@mui/material';

import Check from '@mui/icons-material/Check';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StarIcon from '@mui/icons-material/Star';
import { colors } from '@renderer/shared/styles/theme';

const secondaryColor = colors.palette.secondary.main;

const StepConnectorStyled = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: secondaryColor,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: secondaryColor,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: secondaryColor,
    borderRadius: 1,
  },
}));

const IconStyled = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: colors.palette.background.paper,
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: secondaryColor,
    border: `2px solid rgba(255,255,255,0.25)`,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: secondaryColor,
  }),
}));

function IconWrapper(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <StarIcon />,
    2: <Check />,
  };

  return (
    <IconStyled ownerState={{ completed, active }} className={`${className} mb-3 p-0`}>
      {icons[String(props.icon)]}
    </IconStyled>
  );
}

export default function OnboardingStepper({ steps, activeStep, completed }) {
  return (
    <Box sx={{ width: '50%' }} className="flex justify-center self-center">
      <Stepper
        sx={{ width: '70%' }}
        nonLinear
        activeStep={activeStep}
        connector={<StepConnectorStyled />}
      >
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepLabel
              StepIconComponent={IconWrapper}
              // onClick={handleStep(index)}
              sx={{ display: 'flex', flexDirection: 'column', width: '5rem' }}
              className="StepLabel"
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
