import React from "react"
import { GoMarkGithub } from "react-icons/go";

export default function Header() {
    return(
        <header className="w-full bg-[#845EC2] shadow-lg py-5">
            
            <h3 className="text-white flex justify-center text-center text-2xl">
                <GoMarkGithub className="mr-2 my-auto" fill="#fff" size={40}/>
                <span className="my-auto">Listando Repositorios</span> 
            </h3> 
        </header>
    )
}