import { useEffect, useState } from "react";
import {
  DateCalendar,
  PickersDay,
  type PickersDayProps
} from "@mui/x-date-pickers";
import { format } from "date-fns";
import { Box, Typography, Stack } from "@mui/material";
import { getHolidaysForYear } from "../utils/holidays";

interface Props {
  dayTypes: Map<number, "leave" | "sick">;
  toggleDayType: (day: number) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  clearSelectedDays: () => void;
}

const HOLIDAY_API_KEY = "4ae58b98aca8b21f41ff7dc000ff8f1e8e8ba53e4282efd6fa9cf916ed5d1408";

export default function CalendarStep({
  dayTypes,
  toggleDayType,
  currentMonth,
  setCurrentMonth,
  clearSelectedDays
}: Props) {
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [workdays, setWorkdays] = useState<Set<string>>(new Set());

  useEffect(() => {
    const year = currentMonth.getFullYear();

    getHolidaysForYear(HOLIDAY_API_KEY, year)
      .then((days) => {
        const holidaysSet = new Set<string>();
        const workdaysSet = new Set<string>();

        for (const day of days) {
          if (day.type === '1') {
            holidaysSet.add(day.date);
          }
          else if (day.type === '2') {
            workdaysSet.add(day.date);
          }
        }

        setHolidays(holidaysSet);
        setWorkdays(workdaysSet);
      })
      .catch((err) => console.error("Munkaszüneti napok lekérdezési hiba:", err));
  }, [currentMonth]);

  return (
    <Box sx={{ width: "100%", maxWidth: 260 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1, fontSize: 12 }}>
        <Box sx={{ width: 14, height: 14, bgcolor: "primary.main", borderRadius: "3px" }} />
        <Typography variant="caption">Szabadság</Typography>
        <Box sx={{ width: 14, height: 14, bgcolor: "gold", borderRadius: "3px", ml: 1 }} />
        <Typography variant="caption">Táppénz</Typography>
      </Stack>

      <DateCalendar
        value={currentMonth}
        onChange={(date) => {
          if (!date) return;
          toggleDayType(date.getDate());
        }}
        onMonthChange={(newMonth) => {
          setCurrentMonth(newMonth);
          clearSelectedDays();
        }}
        sx={{
          height: "auto !important",
          maxHeight: "none !important",
          overflow: "visible",
          "& .MuiPickersSlideTransition-root": {
            minHeight: 190
          },
          "& .MuiPickersDay-root": {
            width: 28,
            height: 28,
            fontSize: "0.75rem",
            margin: "0 1px"
          },
          "& .MuiPickersCalendarHeader-root": {
            minHeight: 32,
            "& .MuiPickersCalendarHeader-label": { fontSize: "0.8rem" },
            "& .MuiIconButton-root": { padding: "2px" }
          },
          "& .MuiDayCalendar-weekDayLabel": {
            fontSize: "0.7rem",
            width: 26
          }
        }}
        slots={{
          day: (dayProps: PickersDayProps) => {
            const day = dayProps.day;
            const dateStr = format(day, "yyyy-MM-dd");
            const isWknd = day.getDay() === 0 || day.getDay() === 6;
            const isHoliday = holidays.has(dateStr);
            const isShiftedWorkday = workdays.has(dateStr);

            const dayType = dayTypes.get(day.getDate());

            let bgColor: string | undefined;

            if (dayType === "leave") {
              bgColor = "primary.main";
            } else if (dayType === "sick") {
              bgColor = "gold";
            } else if ((isWknd || isHoliday) && !isShiftedWorkday) {
              bgColor = "rgba(255,0,0,0.15)";
            }

            return (
              <PickersDay
                {...dayProps}
                selected={false}
                sx={{
                  bgcolor: bgColor,
                  color: dayType ? "white" : undefined,
                  borderRadius: "6px",
                  "&:hover": { opacity: 0.85 },
                  "&:focus": { opacity: 1, backgroundColor: bgColor },
                  "&:focus-visible": { opacity: 1, backgroundColor: bgColor }
                }}
              />
            );
          }
        }}
      />
    </Box>
  );
}