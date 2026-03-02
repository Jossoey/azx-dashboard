import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MainMenu from "./components/MainMenu";
import Inventory from "./components/Inventory";
import Sales from "./components/Sales";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </Router>
  );
}

export default App;
