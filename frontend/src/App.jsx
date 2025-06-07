import { BrowserRouter, Routes, Route, Router } from 'react-router-dom'

import Home from "./pages/Home"
import Report from "./pages/Report"

//=======================================Queries========================================
import QueryOne from "./pages/Query_One"
import QueryTwo from "./pages/Query_Two"
import QueryThree from "./pages/Query_Three"
import QueryFour from "./pages/Query_Four"
import QueryFive from "./pages/Query_Five"
import QuerySix from "./pages/Query_Six"

export default function App() {

    return (
    <>
    <BrowserRouter>
        <Routes>
            <Route index element = {<Home />} />
            <Route path = '/home' element = {<Home />} />
            <Route path = '/report' element = {<Report />} />


            <Route path='/query_One' element={<QueryOne />} />
            <Route path='/query_Two' element={<QueryTwo />} />
            <Route path='/query_Three' element={<QueryThree />} />
            <Route path='/query_Four' element={<QueryFour />} />
            <Route path='/query_Five' element={<QueryFive />} />
            <Route path='/query_Six' element={<QuerySix />} />

        </Routes>
    </BrowserRouter>
    </>
    )
}
