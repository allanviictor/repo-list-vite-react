import React, { useCallback, useEffect, useState } from "react";
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
    title:string
    label: Label[] | null
}

export default function Repositories(){
    const { id }= useParams<PropsRepositories>();
    const [repoDetails,setRepoDetails] = useState<Owner | null>(null)
    const [repoIssues,setRepoIssues] = useState<Issues[] | null>(null)
    const [page,setPage] = useState<number>(1)
    const [issueTypeActived,setIssueTypeActived] = useState('all')

    useEffect(()=>{
        
        async function loadRepoDetails(){
            let [repoDetailsData,repoIssuesData] = await Promise.all([
                api.get(`/repos/${id}`),
                api.get(`/repos/${id}/issues`,{
                    params:{
                        per_page: 5,
                        state: issueTypeActived
                    }
                })
            ])

            let { owner:{avatar_url:avatar, login}, description, name } = repoDetailsData.data
            setRepoDetails({ avatar, login, description, name} as Owner)


            let IssuesData:Issues[] = [];
            const setIssuesData = async () => {
                for await (let item of repoIssuesData.data) {
                    let { id:id_issue, user:{avatar_url, login}, html_url, title, labels:label } = item
                    IssuesData.push({ id_issue, avatar_url, login, html_url, title, label } as Issues)
                    
                }
            };setIssuesData()
            setRepoIssues(IssuesData)
            console.log('IssuesData',IssuesData)

        }
        loadRepoDetails()
    },[])

    useEffect(()=>{
        async function LoadIssues(){
            let repoIssuesData = await api.get(`/repos/${id}/issues`,{
                params:{
                    per_page: 5,
                    state: issueTypeActived,
                    page
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

        }

        LoadIssues()
    },[page])


    function handlePage(nextOrPrev:string){
        setPage(nextOrPrev == 'next' ? page + 1 : page - 1)
    }

    async function handleFilter(type:string) {
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

    }

    return(
        <div className="container flex justify-center mt-[100px] ">
            <div className="w-[800px] bg-slate-100 pt-10 px-4 text-center">
                <Link to="/">
                    <FaArrowLeft color="#000" size={35}/>
                </Link>

                <div>
                    <img className="w-52 mx-auto" src={repoDetails?.avatar} alt={repoDetails?.login}/>
                    <h2 className="font-bold text-lg">{repoDetails?.name}</h2>
                    <p className="mt-2">{repoDetails?.description}</p>
                    <div className="flex">
                        <button onClick={()=> handleFilter('all')} className="issue-label">
                            all
                        </button>
                        <button onClick={()=> handleFilter('open')} className="issue-label">
                            open
                        </button>
                        <button onClick={()=> handleFilter('closed')} className="issue-label">
                            closed
                        </button>
                    </div>
                    <ul className="w-full">
                        {repoIssues?.map((item:Issues) => (
                                
                            <li className="mt-10 text-center" key={String(item.id_issue)}>
                                <img className="mx-auto" src={item.avatar_url} alt={item.login}/>
                                <div>

                                    <strong>
                                        <a href={item.html_url} target="_blank">
                                            {item.title}
                                        </a>

                                    </strong><br />
                                    {item.label?.map((label:Label)=>{
                                        return(
                                            <span className="issue-label" key={label.id}>
                                                {label.name}
                                            </span>
                                        )
                                    })}
                                    <p>{item.login}</p>
                                </div>
                                
                            </li>
                            
                        ))}
                    </ul>
                    <div className="flex justify-between">
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