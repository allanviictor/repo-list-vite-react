import React, { useCallback, useEffect, useState, MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from '../../api/api'
import { FaArrowLeft } from 'react-icons/fa'
import './repositories.css'

type PropsRepositories ={
    id:string
}

interface Owner {
    avatar:string
    login:string
    name:string
    description:string
}

interface Label {
    id:number,
    name:string
}

interface Issues {
    id_issue:number,
    avatar_url:string,
    login:string
    html_url:string,
    title:string,
    state:string,
    label: Label[] | null
}

interface ButtonFilter {
    state:string,
    label:string,
    actived:boolean
}

export default function Repositories(){
    const { id }= useParams<PropsRepositories>();
    const [repoDetails,setRepoDetails] = useState<Owner | null>(null)
    const [repoIssues,setRepoIssues] = useState<Issues[] | null>(null)
    const [page,setPage] = useState<number>(1)
    const [issueTypeActived,setIssueTypeActived] = useState<ButtonFilter[]>([
        { state:"all", label:"all", actived:true },
        { state:"open", label:"open", actived:false },
        { state:"closed", label:"closed", actived:false }
    ])

    useEffect(()=>{
        
        async function loadRepoDetails(){
            let [repoDetailsData,repoIssuesData] = await Promise.all([
                api.get(`/repos/${id}`),
                api.get(`/repos/${id}/issues`,{
                    params:{
                        per_page: 5,
                        state: "all"
                    }
                })
            ])

            let { owner:{avatar_url:avatar, login}, description, name } = repoDetailsData.data
            setRepoDetails({ avatar, login, description, name} as Owner)


            let IssuesData:Issues[] = [];
            const setIssuesData = async () => {
                for await (let item of repoIssuesData.data) {
                    let { id:id_issue, user:{avatar_url, login}, html_url, title, labels:label, state } = item
                    IssuesData.push({ id_issue, avatar_url, login, html_url, title, label, state } as Issues)
                    
                }
            };setIssuesData()
            setRepoIssues(IssuesData)
            console.log('repoIssuesData',repoIssuesData)

        }
        loadRepoDetails()
    },[])

    /* useEffect(()=>{
        async function LoadIssues(){
            let repoIssuesData = await api.get(`/repos/${id}/issues`,{
                params:{
                    per_page: 5,
                    state: issueTypeActived.find(item => item.actived)?.state,
                    page
                }
            })

            let IssuesData:Issues[] = [];
            const setIssuesData = async () => {
                for await (let item of repoIssuesData.data) {
                    let { id:id_issue, user:{avatar_url, login}, html_url, title, labels:label, state } = item
                    IssuesData.push({ id_issue, avatar_url, login, html_url, title, label, state } as Issues)
                    
                }
            };setIssuesData()
            setRepoIssues(IssuesData)

        }

        LoadIssues()
    },[page]) */


    function handlePage(nextOrPrev:string){
        setPage(nextOrPrev == 'next' ? page + 1 : page - 1)
    }

    /* async function handleFilter(type:string) {
        setIssueTypeActived(type)
        let repoIssuesData = await api.get(`/repos/${id}/issues`,{
            params:{
                per_page: 5,
                state: issueTypeActived,
                page: 1
            }
        })

        let IssuesData:Issues[] = [];
        const setIssuesData = async () => {
            for await (let item of repoIssuesData.data) {
                let { id:id_issue, user:{avatar_url, login}, html_url, title, labels:label } = item
                IssuesData.push({ id_issue, avatar_url, login, html_url, title, label } as Issues)
                
            }
        };setIssuesData()
        setRepoIssues(IssuesData)

    } */

    async function handleFilter(event:MouseEvent,index:number){
        
        
        issueTypeActived.forEach(item => {
            item.actived = false
        })
        
        let buttons = document.querySelectorAll('.button-filter')
        
        buttons.forEach(item => {
            item.classList.remove('bg-actived')
        })

        if(!event.currentTarget.classList.contains('bg-actived')){
            event.currentTarget.classList.add('bg-actived') 
        }

        issueTypeActived[index].actived = true
        

        console.log('issueTypeActived',issueTypeActived)

        let repoIssuesData = await api.get(`/repos/${id}/issues`,{
            params:{
                per_page: 5,
                state: issueTypeActived.find(item => item.actived)?.state,
                page: 1
            }
        })

        let IssuesData:Issues[] = [];
        const setIssuesData = async () => {
            for await (let item of repoIssuesData.data) {
                let { id:id_issue, user:{avatar_url, login}, html_url, title, labels:label, state } = item
                IssuesData.push({ id_issue, avatar_url, login, html_url, title, label, state } as Issues)
                
            }
        };setIssuesData()
        setRepoIssues(IssuesData)
       
    }

    return(
        <div className="container flex justify-center mt-[100px] mb-5">
            <div className="w-[800px] bg-slate-100 pt-10 px-4 ">
                <Link to="/">
                    <FaArrowLeft color="#000" size={35}/>
                </Link>
                <div>
                    <div>

                        <img className="w-52 mx-auto rounded-full" src={repoDetails?.avatar} alt={repoDetails?.login}/>
                    </div>
                    <h2 className="font-bold text-lg text-center">{repoDetails?.name}</h2>
                    <p className="mt-2 text-center">{repoDetails?.description}</p>
                    <div className="flex mt-5 justify-center">
                        {issueTypeActived.map((button:ButtonFilter,index:number) =>(
                            <button key={button.label} onClick={(e)=> handleFilter(e,index)} className={`${issueTypeActived[index].actived ? 'bg-actived': ''} border-2 py-1 px-3 text-gray-100 button-filter`}>
                                { button.label }
                            </button>
                        ))}
                    </div>
                    <ul className="w-full">
                        {repoIssues?.map((item:Issues) => (
                                
                            <li className="mt-10 flex justify-items-start mb-5 items-center" key={String(item.id_issue)}>
                               
                                <div>
                                    
                                    <img className="mx-auto w-20 rounded-full" src={item.avatar_url} alt={item.login}/>
                                    <p>{item.login}</p>
                                </div>
                                <div className="ml-3">
                                    <strong>
                                        <a href={item.html_url} target="_blank">
                                            {item.title}
                                        </a>
                                    </strong>
                                    <div>
                                        state: {item.state}
                                    </div>
                                    <div className="flex gap-2">
                                        {item.label?.map((label:Label)=>{
                                            return(
                                                <div className="issue-label" key={label.id}>
                                                    {label.name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </li>
                            
                        ))}
                    </ul>
                    <div className="flex justify-between pb-5">
                        <button disabled={page == 1 ? true: false} onClick={()=> handlePage('prev')} className="border-2 p-2 bg-[#845ec2] text-gray-100 font-bold">
                            voltar
                        </button>
                        <button onClick={()=> handlePage('next')} className="border-2 p-2 bg-[#845ec2] text-gray-100 font-bold">
                            avançar 
                        </button>
                    </div>
                </div>

            </div>
        </div>
     
    )
}