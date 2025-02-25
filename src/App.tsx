import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import WeldingCalculator from "./welding-calculator"
import WeldingCalculatorResult from "./welding-calculator-result" 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeldingCalculator />} />
        <Route path="/calculatorResult" element={<WeldingCalculatorResult />} />
      </Routes>
    </Router>
  )
}

export default App

