import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

interface Props {
  onOpenConfig: () => void;
}

export default function AppHeader({ onOpenConfig }: Props) {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar variant="dense">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Jelenléti ív kitöltő
        </Typography>
        <IconButton color="inherit" onClick={onOpenConfig} size="small">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
