import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from "@mui/material";

export interface Defaults {
  arrival: string;
  leave: string;
  worked: string;
  signature: string; // Base64 string a képhez
}

interface Props {
  open: boolean;
  onClose: () => void;
  defaults: Defaults;
  onSave: (values: Defaults) => void;
}

export default function ConfigDialog({
  open,
  onClose,
  defaults,
  onSave
}: Props) {
  const [values, setValues] = useState<Defaults>(defaults);

  useEffect(() => {
    setValues(defaults);
  }, [defaults]);

  const handleChange = (field: keyof Defaults) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValues((prev) => ({ ...prev, signature: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteSignature = () => {
    setValues((prev) => ({ ...prev, signature: "" }));
  };

  const handleSave = () => {
    onSave(values);
  };

  const handleClose = () => {
    setValues(defaults);  // visszaállítjuk az eredetit
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Beállítások</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
          <TextField
            label="Érkezés idő"
            value={values.arrival}
            onChange={handleChange("arrival")}
            size="small"
          />
          <TextField
            label="Távozás idő"
            value={values.leave}
            onChange={handleChange("leave")}
            size="small"
          />
          <TextField
            label="Ledolgozott órák"
            value={values.worked}
            onChange={handleChange("worked")}
            size="small"
          />

          <Stack direction="row" spacing={1} sx={{ mt: 1, width: "100%" }}>
            <Button
              variant="outlined"
              component="label"
              size="small"
              sx={{ flex: 1 }}
            >
              Aláírás feltölt
              <input
                type="file"
                accept="image/png"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {values.signature && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ flex: 1 }}
                onClick={handleDeleteSignature}
              >
                Aláírás töröl
              </Button>
            )}
          </Stack>

          {values.signature && (
            <img
              src={values.signature}
              alt="Aláírás előnézet"
              style={{ marginTop: 8, maxHeight: 100, border: "1px solid #ccc" }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Mégse</Button>
        <Button variant="contained" onClick={handleSave}>
          Mentés
        </Button>
      </DialogActions>
    </Dialog>
  );
}
