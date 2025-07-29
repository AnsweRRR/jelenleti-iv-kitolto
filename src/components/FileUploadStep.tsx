import { Button, Typography, Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface Props {
  onFileSelected: (file: File) => void;
  file: File | null;
}

export default function FileUploadStep({ onFileSelected, file }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      onFileSelected(selected);
    } else {
      alert("Csak PDF fájl tölthető fel!");
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadFileIcon />}
        sx={{ mt: 2 }}
      >
        PDF kiválasztása
        <input type="file" accept="application/pdf" hidden onChange={handleChange} />
      </Button>
      {file && <Typography sx={{ mt: 1 }}>Kiválasztott fájl: {file.name}</Typography>}
    </Box>
  );
}
