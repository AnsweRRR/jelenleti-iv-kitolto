import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import GitHubIcon from "@mui/icons-material/GitHub";

interface Props {
  onOpenConfig: () => void;
}

export default function AppHeader({ onOpenConfig }: Props) {
  return (
    <AppBar position="static" color="warning" elevation={1}>
      <Toolbar variant="dense">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Jelenléti ív kitöltő
        </Typography>
        <IconButton
          color="inherit"
          component="a"
          href="https://github.com/AnsweRRR/jelenleti-iv-kitolto"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton color="inherit" onClick={onOpenConfig} size="small">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}