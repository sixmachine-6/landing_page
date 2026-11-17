import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          {/* Every URL shows the same single page. Home scrolls to the right section. */}
          <Route path="*" element={<Home />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
