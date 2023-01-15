import { Routes, Route } from "react-router-dom";

import HeaderMenu from "./components/HeaderMenu";
import Home from "./components/Home";
import Add from "./components/Add";
import Books from "./components/Books";
import Book from "./components/Book";

import "./App.css";

function App() {
  return (
    <div className="App">
      <HeaderMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} >
          
        </Route>
        <Route path="/book/:id" element={<Book />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </div>
  );
}

export default App;
