import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isSelected: boolean;
  isStart: boolean;
  isEnd: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isStart' && prop !== 'isEnd',
})<CustomPickerDayProps>(({ theme, isSelected, isStart, isEnd }) => ({
  borderRadius: '0%',
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isStart && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(isEnd && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));

function Day(
  props: PickersDayProps<Dayjs> & {
    selectedDays: Dayjs[];
  },
) {
  const { day, selectedDays, ...other } = props;
  
  const isSelected = selectedDays.some(selectedDay => day.isSame(selectedDay, 'day'));
  const isStart = isSelected && !selectedDays.some(d => d.isSame(day.subtract(1, 'day'), 'day'));
  const isEnd = isSelected && !selectedDays.some(d => d.isSame(day.add(1, 'day'), 'day'));

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 0 }}
      selected={isSelected}
      isSelected={isSelected}
      isStart={isStart}
      isEnd={isEnd}
    />
  );
}

export default function WeekPicker() {
  const selectedDays = React.useMemo(() => [
    dayjs('2022-04-15'), dayjs('2022-04-16'), dayjs('2022-04-17'),
    dayjs('2022-04-18'), dayjs('2022-04-20')
  ], []);

  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={(newValue) => setValue(newValue)}
        showDaysOutsideCurrentMonth
        displayWeekNumber
        readOnly
        slots={{
          day: Day,
        }}
        slotProps={{
          day: {
            selectedDays,
          },
        }}
      />
    </LocalizationProvider>
  );
}


