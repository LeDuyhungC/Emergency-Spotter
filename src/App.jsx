import './App.css'
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom'

import AboutUs from "./pages/AboutUs"
import Home from "./pages/Home"
import Functions from "./pages/Functions"
import Report from "./pages/Report"


export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element = {<Home />} />
          <Route path = '/aboutUs' element = {<AboutUs />} />
          <Route path = '/home' element = {<Home />} />
          <Route path = '/functions' element = {<Functions />} />
          <Route path = '/report' element = {<Report />} />
        </Routes>
      </BrowserRouter>


    </>
  )
}
