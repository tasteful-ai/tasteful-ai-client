import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Counter } from "./pages/Counter";
import { Login } from "./pages/Login";
import { SamplePage } from "./pages/SamplePage";
import { SecondPage } from "./pages/SecondPage";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/sample">샘플페이지</Link></li>
          <li><Link to="/second">두번째페이지</Link></li>
          <li><Link to="/counter">숫자세는페이지</Link></li>
          <li><Link to="/login">숫자세는페이지</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<h1>홈(메인페이지)</h1>} />
        <Route path="/sample" element={<SamplePage />} />
        <Route path="/second" element={<SecondPage />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
