import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { hu } from "date-fns/locale";
import FillForm from "./pages/FillForm";

const backgroundStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'url(/background.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 0.5,
  zIndex: -1,
};

export default function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hu}>
        <div style={backgroundStyle}></div>
        <FillForm />

        <img
          src="/footer-image.png"
          alt="Footer"
          style={{
            position: "fixed",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "100%",
            zIndex: 1000,
            pointerEvents: "none"
          }}
        />
      </LocalizationProvider>
    </>
  );
}