import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Main from '../src/pages/main/main'
import Repositories from '../src/pages/repositories/repositories'

export default function AppRouter(){
    return(
         <BrowserRouter> 
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/main" element={<Main/>}/>
            </Routes>
            <Routes>
                <Route path="repositories/:id" element={<Repositories/>}/>
            </Routes>

        </BrowserRouter>
    )
}