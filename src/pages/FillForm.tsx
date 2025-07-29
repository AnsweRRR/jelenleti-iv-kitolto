import { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Container
} from "@mui/material";
import FileUploadStep from "../components/FileUploadStep";
import CalendarStep from "../components/CalendarStep";
import GenerateStep from "../components/GenerateStep";
import AppHeader from "../components/AppHeader";
import ConfigDialog from "../components/ConfigDialog";
import { getConfig, setConfig } from "../utils/configStorage";

const contentStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  justifyContent: "flex-start",
  alignItems: 'center',
  width: '100%',
  height: '100%',
  zIndex: 1,
  flexDirection: "column",
  marginTop: 50
};

async function fillPdf(
  templateBytes: ArrayBuffer,
  dayTypes: Map<number, "leave" | "sick">,
  defaults: { arrival: string; leave: string; worked: string; signature: string },
  currentMonth: Date,
  signatureBytes: ArrayBuffer
) {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const color = rgb(0, 0, 0);

  const sigImage = await pdfDoc.embedPng(signatureBytes);
  const sigDims = sigImage.scale(1);

  const sigMaxWidth = 50;  // a cella szélessége kb. 60 körül van
  const sigMaxHeight = 14; // a cella magassága kb. 14px
  const scale = Math.min(sigMaxWidth / sigDims.width, sigMaxHeight / sigDims.height);

  // signature kép mérete
  const sigWidth = sigDims.width * scale;
  const sigHeight = sigDims.height * scale;

  const xArrival = 110;
  const xLeave = 180;
  const xWorked = 280;
  const xSignature = 340;
  const xNote = 444;

  const yTop = 634;
  const rowHeight = 13.7;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  for (let nap = 1; nap <= 31; nap++) {
    const date = new Date(year, month - 1, nap);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) {
      continue;
    }

    const type = dayTypes.get(nap);

    let arrival = "";
    let leave = "";
    let worked = "";
    let note = "";

    if (type === "leave") {
      note = "Szabadság";
    } else if (type === "sick") {
      note = "Táppénz";
    } else {
      arrival = defaults.arrival;
      leave = defaults.leave;
      worked = defaults.worked;
    }

    const y = yTop - (nap - 1) * rowHeight;

    page.drawText(arrival, { x: xArrival, y, size: 8, font, color: color });
    page.drawText(leave, { x: xLeave, y, size: 8, font, color: color });
    page.drawText(worked, { x: xWorked, y, size: 8, font, color: color });
    page.drawImage(sigImage, {
      x: xSignature,
      y: y - 2, // egy kicsit lejjebb, hogy szépen álljon a sor közepén
      width: sigWidth,
      height: sigHeight
    });
    page.drawText(note, { x: xNote, y, size: 8, font, color: color });
  }

  return await pdfDoc.save();
}

export default function FillForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  const [dayTypes, setDayTypes] = useState<Map<number, "leave" | "sick">>(
    new Map()
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [defaults, setDefaults] = useState({
    arrival: "",
    leave: "",
    worked: "",
    signature: ""
  });

  const toggleDayType = (day: number) => {
    setDayTypes((prev) => {
      const next = new Map(prev);
      const current = next.get(day);
      if (!current) {
        next.set(day, "leave");
      } else if (current === "leave") {
        next.set(day, "sick");
      } else {
        next.delete(day);
      }
      return next;
    });
  };

  const clearSelectedDays = () => setDayTypes(new Map());

  function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const base64Data = base64.split(",")[1];
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);

    if (!defaults.signature) {
      alert("Nincs feltöltve aláírás!");
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const signatureBytes = base64ToArrayBuffer(defaults.signature);

        const pdfBytes = await fillPdf(
          reader.result as ArrayBuffer,
          dayTypes,
          defaults,
          currentMonth,
          signatureBytes
        );

        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        const originalName = file.name.replace(/\.pdf$/i, "");
        a.href = url;
        a.download = `${originalName}_filled.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const steps = [
    {
      label: "Fájl feltöltése",
      content: <FileUploadStep onFileSelected={setFile} file={file} />
    },
    {
      label: "Napok kijelölése",
      content: (
        <CalendarStep
          dayTypes={dayTypes}
          toggleDayType={toggleDayType}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          clearSelectedDays={clearSelectedDays}
        />
      )
    },
    {
      label: "Generálás",
      content: (
        <GenerateStep
          onGenerate={handleGenerate}
          loading={loading}
          disabled={!file}
        />
      )
    }
  ];

  useEffect(() => {
    getConfig().then((saved: import("../components/ConfigDialog").Defaults | null) => {
      if (saved) {
        setDefaults(saved);
      }
    });
  }, []);

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 10 }}>
        <AppHeader onOpenConfig={() => setConfigOpen(true)} />
      </div>

      <div style={contentStyle}>
        <Container
          maxWidth="md"
          sx={{
            bgcolor: "rgba(255,255,255,0.85)",
            borderRadius: 2,
            p: 3,
            boxShadow: 3,
            margin: "0 10px",
          }}
        >
          <Stepper activeStep={activeStep} nonLinear orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label} disabled={index > 0 && !file}>
                <StepLabel
                  onClick={() => {
                    if (index <= activeStep) {
                      setActiveStep(index);
                    } else {
                      if (activeStep === 0 && !file) return;
                      setActiveStep(index);
                    }
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  {step.content}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Container>
      </div>

      <ConfigDialog
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        defaults={defaults}
        onSave={async (newConfig) => {
          setDefaults(newConfig);
          await setConfig(newConfig);
          setConfigOpen(false);
        }}
      />
    </>
  );
}