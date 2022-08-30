

interface PropsInput{
    setValueInput:((value:string) => void)
    valueInput:string,
    errorBorder:boolean
}


export default function Input( { setValueInput,valueInput, errorBorder}:PropsInput ) {

    function handleinput(e:any){
        setValueInput(e.target.value)
    
    }/* ${errorBorder ? 'border-[#e70808]': ''} */
    return(
        <input 
        onChange={(e) => handleinput(e) }
        placeholder="repositorio" 
        value={valueInput}
        className={`w-full px-3 py-1 focus:ring-1 focus:outline-none focus:border-[#845EC2] focus:ring-[#845EC2] ${ errorBorder ? 'border-2 border-rose-500': ''} `} type="text"/>
    )/* w-full px-3 py-1 focus:outline-none focus:ring-1 focus:border-[#845EC2] focus:ring-[#845EC2] */
}