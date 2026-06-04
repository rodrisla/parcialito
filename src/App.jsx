import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IniciarParcialito from './components/InciarParcialito';
import Parcialito from './components/Parcialito';
import Resultado from "./components/CrearResultado";

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<IniciarParcialito />} />
              <Route path='/parcialito' element={<Parcialito />} />
              <Route path='/resultado' element={<Resultado />} />
            </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App;