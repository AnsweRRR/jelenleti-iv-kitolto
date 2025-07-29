import { Box, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface Props {
  defaults: {
    arrival: string;
    leave: string;
    worked: string;
    signature: string;
  };
  setDefaults: (d: Props["defaults"]) => void;
}

function parseTimeToDate(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

function formatDateToTimeStr(date: Date): string {
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function DataStep({ defaults, setDefaults }: Props) {
  const handleChange = (key: keyof Props["defaults"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDefaults({ ...defaults, [key]: e.target.value });
    };

  const handleTimeChange = (key: "arrival" | "leave", value: Date | null) => {
    if (!value) return;
    setDefaults({ ...defaults, [key]: formatDateToTimeStr(value) });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: 220 }}>
      <TimePicker
        label="Érkezés"
        value={parseTimeToDate(defaults.arrival)}
        onChange={(v) => handleTimeChange("arrival", v)}
        slotProps={{ textField: { size: "small" } }}
      />

      <TimePicker
        label="Távozás"
        value={parseTimeToDate(defaults.leave)}
        onChange={(v) => handleTimeChange("leave", v)}
        slotProps={{ textField: { size: "small" } }}
      />

      <TextField
        label="Ledolgozott órák"
        value={defaults.worked}
        onChange={handleChange("worked")}
        size="small"
      />
    </Box>
  );
}