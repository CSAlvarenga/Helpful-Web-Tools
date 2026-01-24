import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";

// Image Tools
import ImageResize from "./pages/tools/ImageResize";
import ImageCrop from "./pages/tools/ImageCrop";
import ImageCompressor from "./pages/tools/ImageCompressor";

// PDF & Document Tools
import InvoiceGenerator from "./pages/tools/InvoiceGenerator";

// Developer Tools
import QRGenerator from "./pages/tools/QRGenerator";

// Text Tools
import CaseConverter from "./pages/tools/CaseConverter";
import LoremIpsum from "./pages/tools/LoremIpsum";
import WordCounter from "./pages/tools/WordCounter";

// Daily Utilities
import PasswordGenerator from "./pages/tools/PasswordGenerator";

// Placeholder for tools not yet implemented
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Image Tools */}
          <Route path="/tools/image-resize" element={<ImageResize />} />
          <Route path="/tools/image-crop" element={<ImageCrop />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/format-converter" element={<ComingSoon toolName="Format Converter" />} />
          <Route path="/tools/background-remover" element={<ComingSoon toolName="Background Remover" />} />
          
          {/* PDF Tools */}
          <Route path="/tools/pdf-merge" element={<ComingSoon toolName="PDF Merge" />} />
          <Route path="/tools/pdf-split" element={<ComingSoon toolName="PDF Split" />} />
          <Route path="/tools/pdf-to-image" element={<ComingSoon toolName="PDF to Image" />} />
          <Route path="/tools/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/tools/e-signature" element={<ComingSoon toolName="e-Signature" />} />
          
          {/* Developer Tools */}
          <Route path="/tools/qr-generator" element={<QRGenerator />} />
          <Route path="/tools/css-gradient" element={<ComingSoon toolName="CSS Gradient Generator" />} />
          <Route path="/tools/json-formatter" element={<ComingSoon toolName="JSON Formatter" />} />
          <Route path="/tools/contrast-checker" element={<ComingSoon toolName="Contrast Checker" />} />
          
          {/* Text Tools */}
          <Route path="/tools/case-converter" element={<CaseConverter />} />
          <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
          <Route path="/tools/word-counter" element={<WordCounter />} />
          <Route path="/tools/diff-checker" element={<ComingSoon toolName="Diff Checker" />} />
          
          {/* Daily Utilities */}
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/unit-converter" element={<ComingSoon toolName="Unit Converter" />} />
          <Route path="/tools/stopwatch-timer" element={<ComingSoon toolName="Stopwatch & Timer" />} />
          <Route path="/tools/speed-test" element={<ComingSoon toolName="Internet Speed Test" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
