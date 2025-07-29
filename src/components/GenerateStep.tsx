import { Button, Box } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

interface Props {
  onGenerate: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function GenerateStep({ onGenerate, loading, disabled }: Props) {
  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PictureAsPdfIcon />}
        onClick={onGenerate}
        disabled={loading || disabled}
      >
        {loading ? "Generálás..." : "PDF generálása"}
      </Button>
    </Box>
  );
}
