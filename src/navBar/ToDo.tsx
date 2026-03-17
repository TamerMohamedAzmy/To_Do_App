// add=
// deleteone=
// deleteAll=
// save in localStorage=
// search
// edit=
// toggle

import { useState ,useEffect, useMemo} from "react";
import { FaMoon,FaSun } from "react-icons/fa";
import './navbar.css'
//  شكل البيانات
interface ToDo{
  id:number,
  title:string,
  completed:boolean
}

function App(){

   const [edit,setEdit]=useState<number|null>(null )
   const [search,setSearch]=useState("")
   const[filter,setFilter]=useState<"all"  |"completed" |"active">("all")
   const [text,setText]=useState("")
   const [dark,setDark]=useState(false)
   const [toDos,setoDos]=useState<ToDo[]>(()=>{
    // هجيب المحفوظ فى اللوكل ستورتج 
   const saved =localStorage.getItem("toDos");
      return saved ?JSON.parse(saved):[];
 })
 
//  اضافة وتعديل 
const addToDo=()=>{
  if(!text.trim())return;
  if(edit!==null){
    setoDos(prev=>prev.map(todo=> 
     edit===todo.id ?{...todo,title:text}:todo))
     setEdit(null)
  
}else{
  const newTodo:ToDo={
    id:Date.now(),
    title:text,
    completed:false
  }
  setoDos(prev=>[...prev,newTodo])
  setText("")
}
}
const editTodo=(e:ToDo)=>{
  setEdit(e.id)
  setText(e.title)
}
  // حذف الكل
const clearAll= ()=>setoDos([])
//  ✅ تبديل الحالة
const toggleTodo=(id:number)=>{
  setoDos(prev=>prev.map(todo=>todo.id===id
  ?{...todo,completed:!todo.completed}:todo))
}
// الفلترة
const filterToDos=useMemo(()=>{
  return toDos.filter(todo=>{
  if(filter==="completed"&&!todo.completed)return false;
  if(filter==="active"&&todo.completed) return false
  return todo.title.toLowerCase().includes(search.toLowerCase());
})
},[toDos,filter,search])
// حذف عن صر واحد
const deleteTodo=(id:number)=>{ setoDos(prev=>prev.filter(todo=> todo.id!==id))
}
useEffect(()=>{
  localStorage.setItem("toDos",JSON.stringify(toDos))
  if(dark){
    document.body.classList.add("dark")
  }else{
     document.body.classList.remove("dark")
  }
},[toDos,dark])

 const isNormalView = filter==="all"&&search.trim()==="";

return (
     <div className="container">
      <h2 style={{color:"#0098b3"}}>Add To Do</h2>
      <button onClick={()=>setDark(prev=>!prev)}>{dark?<FaSun/>:<FaMoon/>}</button>
      <input type="search"placeholder="search"onChange={(e)=>setSearch(e.target.value)}/>
      <hr></hr>
 
       <div style={{marginBottom:"20px"}}>
           <button onClick={()=>setFilter("all")}>All</button>
           <button onClick={()=>setFilter("completed")}>completed</button>
           <button onClick={()=>setFilter("active")}>active</button>
       </div>
 
       <div className="enterdText">
       <button onClick={addToDo}>{edit!==null?"save":"Add"}</button>
       <input value={text} type="text" placeholder="enter any text"onChange={e=>setText(e.target.value)}/>
       </div>
      {isNormalView && (
        <>
       {toDos.map((todo)=>(
        <div key={todo.id}>
        <div className="updateall ">
               <p>{todo.title}</p>
               <input type="checkbox"checked={todo.completed}onChange={()=>toggleTodo(todo.id)}/>
               <div>
                <button onClick={()=>editTodo(todo)}>update</button>  
                <button onClick={()=>deleteTodo(todo.id)}>Delete</button>  
               </div>
        </div>
          </div>
       ))}
       </>
      )}
          {!isNormalView && (
            <>
           {filterToDos.map(todo=>(
        <div  key={todo.id} style={{marginBottom:"10px",color:"wheat"}}>
           <span onClick={()=>toggleTodo(todo.id)}>{todo.title}</span>
        </div>
        
       ))}
       </>
          )}
     <h4 onClick={clearAll}>clearAll</h4> 
     </div>
)
}

export default App