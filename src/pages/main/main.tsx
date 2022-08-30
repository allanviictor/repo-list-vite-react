import { GoMarkGithub } from "react-icons/go";
import Input from '../../components/input/input'
import { api } from '../../api/api'
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSpinner,FaBars,FaTrashAlt } from "react-icons/fa";
import './main.css'
import { Link } from "react-router-dom";

interface InfoRepositorie {
    nameRepo:string
}
interface ErrorTratative {
    error: boolean
    message: string
}

export default function Main(){

    const [valueInput,setValueInput] = useState<string>('')
    const [repositories,setrepositories] = useState<InfoRepositorie[] | null>(null)
    const [errorTratative,setErrorTratative] = useState<ErrorTratative | null>(null)
    const [isLoad,setIsLoad] = useState(false)
    const [errorBorder,setErrorBorder] = useState(false)



    useEffect(()=> {
        const repoStorage = localStorage.getItem('repos')
        console.log('iniciou')
        if(repoStorage){
            setrepositories(JSON.parse(repoStorage))
        }
    },[])

    useEffect(()=> {
        localStorage.setItem('repos',JSON.stringify(repositories))
    },[repositories])


    const handleSubmit = useCallback((event:any)=>{
        event.preventDefault();
        async function submitForm(){

            if(!valueInput){
                ErrorTratatives(true,'valor do input está vazio !!')
                return false
            }
            if(repositories?.find((repo:InfoRepositorie)=>repo.nameRepo == valueInput)){
                ErrorTratatives(true,'repositorio já está listado')
                setValueInput('')
                return false
            }
        
            
            try{
                setIsLoad(true)
                const getApi = await api.get(`/repos/${valueInput}`)
        
                const { full_name } = getApi.data

                let infoRepo:InfoRepositorie = {
                    nameRepo: full_name
                }
        
                if(repositories){
                    setrepositories([...repositories, infoRepo])
                }else {
                    setrepositories([infoRepo])
                }

                setValueInput('')
                setIsLoad(false)
            }catch(error){
                setIsLoad(false)
            }finally{
                setIsLoad(false)
                setValueInput('')
            }
    
        }
        submitForm();

    },[valueInput,repositories,isLoad]) 

    const handleDelete = useCallback((repo:string)=>{
        
        let filterRepo = repositories?.filter(item => {
            return item.nameRepo !== repo
        }) as InfoRepositorie[]
        setrepositories(filterRepo)

    },[repositories])

    
    
    function ErrorTratatives(error:true,message:string){
        
        setErrorTratative({ error, message})
        setErrorBorder(true) 
        setTimeout(() => {
            setErrorTratative(null)
            setErrorBorder(false) 
        }, 2000);
        
        
    }



    return(
        <div className="container flex justify-center mt-[100px] ">
            <div className="w-[600px] bg-slate-100 pt-10 px-4">
                <form onSubmit={ (event)=> handleSubmit(event)}>
                    <h3 className="flex font-medium text-neutral-900">
                        <GoMarkGithub className="mr-2" fill="#000" size={22}/>
                        Meus Repositorios
                    </h3>
                    <div className="mt-3 flex justify-center align-middle">
                        <Input errorBorder={errorBorder} valueInput={valueInput} setValueInput={setValueInput} />
                        <button  
                            disabled={isLoad}
                            type="submit" 
                            className="bg-[#845EC2] disabled:opacity-80 p-1 px-3"> 
                            
                            {isLoad ? <FaSpinner className="ic-spinner" size={18} fill="#fff"/> : <AiOutlinePlus size={18} fill="#fff"/> }
                        </button>
                    </div>
                </form>
                <p className="font-semibold text-red-600">
                { errorTratative?.message }
                </p>
                
                <ul className='mt-5'>
                    { 
                        repositories?.map((item:InfoRepositorie) => {
                            return(
                                <li className='p-2 mb-3 flex border-solid border-2 border-[#845EC2] text-[#4B4453]' key={item.nameRepo}>
                                    <div className="w-full">
                                        {item.nameRepo}
                                    </div>
                                    <div className="flex gap-2 justify-end w-full">
                                        <Link to={`repositories/${encodeURIComponent(item.nameRepo)}`}>

                                            <FaBars className="my-auto p-1 cursor-pointer bg-[#845EC2]" size={25} fill="#fff"/>
                                        </Link>
                                        <FaTrashAlt onClick={()=>handleDelete(item.nameRepo)} className="my-auto p-1 cursor-pointer bg-[#845EC2]" size={25} fill="#fff"/>
                                    </div>
                                </li>
                            )
                        }) 
                    }
                </ul>
            </div>

        </div>
        
    )
}