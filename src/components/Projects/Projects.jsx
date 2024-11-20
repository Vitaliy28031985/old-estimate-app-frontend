import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetProjectsQuery, useUpdateProjectMutation } from '../../redux/projectSlice/projectSlice';
import {useCurrentQuery} from "../../redux/user/userApi";
import AddProject from '../AddModals/AddProject/AddProject';
import Modal from '../Modal/Modal';
import DeleteModal from '../DeleteModal/DeleteModal';
import Line from "../Icons/Line/Line";
import Add from "../Icons/Add/Add";
import Update from "../Icons/Update/UpdateIcon";
import UpdateOk from "../Icons/UpdateOk/UpdateOk";
import Delete from "../Icons/Delete/Delete";

import s from "./Projects.module.scss";

function ProjectsComponent () {
  
    const { data: projects } = useGetProjectsQuery();
    console.log("projects", projects?.projects)
    const[mutate] = useUpdateProjectMutation();
    const { data: userData } = useCurrentQuery(); 

    const [data, setData] = useState(projects?.projects);



    const newData = projects?.projects;

    const [currentData, setCurrentData] = useState({});
    const [userRole, setUserRole] = useState(false);
   
    const [toggle, setToggle] = useState(false);
    const [toggleDelete, setToggleDelete] = useState(false);

    useEffect(() => {
    setData( projects?.projects); 
    if (userData) {
        const role = userData?.role;
        const isUserRole = role !== "customer";
           setUserRole(isUserRole);
      }
      
      }, [projects, userData, userRole]);

  
    const handleToggle = () => {
        setToggle(toggle => !toggle);
    }
    const handleToggleDelete = () => {
        setToggleDelete(toggle => !toggle);
    }

    const addIsToggle = (id, currentIsShow, name) => {
        setData(prevData => {
            const newData = prevData.map(project => {
                if (project._id === id) {
                    if(name === 'update') {
                        return { ...project, isShow: currentIsShow };
                    }
                    if(name === 'delete') {
                        return { ...project, isDelete: currentIsShow };
                    }
                }
                return project; 
            });
        
            return newData
        });
    };
    
    const onChange = (e) => {
        const { name, value, id } = e.currentTarget;
        setData(prevData => {
            const newData = prevData.map(project => {
                if (project._id === id) {
                    switch (name) {
                        case name:
                            return  {...project, [name]: value};
                        default:
                          return project;
                      }
                }
                return project; 
            });
        
            return newData; 
        })
    }

    return (
        <div>
            <div className={s.title}>
            <h1>Список кошторисів</h1> 
            {userRole && (
             <button onClick={handleToggle} className={s.addButton}><Add width={"24"} height={"24"}/></button>   
            )}
            
            </div>
        <div className={s.container}>
            
            {data && (
             <ul className={s.cardContainer}>
                { data?.map(({_id, title, description, isShow = false, isDelete = false}) => (
            <li className={s.card} key={_id} id={_id}>
                {userRole && (
                   <div className={s.buttons}>
                <button className={s.button}
                onClick={ async () => {
                    isShow = !isShow;
                    addIsToggle(_id, isShow, 'update');
                    if(!isShow) {
                        try {
                      const updateProject =  await mutate({id: _id, newData: {title, description}});

                      if (updateProject && updateProject.data) {
                        toast(`"${title}" успішно обновлено!`);               
                        } else {
                             console.error('Unexpected response:', updateProject.error.data.message);
                             toast.error(updateProject.error.data.message);
                            
                             }

                    } catch (error) {
                        toast.error(`У вас немає прав для оновлення ${title}!`, error);
                        }
                        
                    }
                }}
                > 
                {!isShow ? (<Update width={"24"} height={"24"}/>) : (<UpdateOk width={"24"} height={"24"}/>)}
               </button> 
                
                   
                <button className={s.button}
                onClick={async () => {
                isDelete = !isDelete;
                addIsToggle(_id, isDelete, 'delete');
                setCurrentData({_id, title}); 
                handleToggleDelete();
                }}
                >
                    <Delete width={"24"} height={"24"}/></button>
                </div>   
                )}
              
                <div>
                <p className={s.title}>Назва кошторису:</p> 
                {!isShow ? (<p className={s.titleData}>{title}</p>) : 
                (<input id={_id} maxLength="20" name='title' className={s.inputTitle} value={title} disabled={!isShow} onChange={onChange} />)}
                
                </div>
                <div>
                <p className={s.address}>Адреса об'єкту:</p> 
                {!isShow ? (<p className={s.addressData}>{description}</p>) : 
                (<input id={_id} maxLength="30" name='description' className={s.inputAddress} value={description} disabled={!isShow} onChange={onChange} />)}
                
                </div>
                <NavLink  className={s.link} to={`/project/${_id}`}>Детальніше <Line/></NavLink >
            </li>) 
                )}
                       
           </ul>    
            )}
        
        </div>
        {toggle && (<Modal onModal={handleToggle}><AddProject onModal={handleToggle}/></Modal>)}
        {toggleDelete && (<DeleteModal data={currentData} nameComponent={"projects" } onModal={handleToggleDelete}/>)}
        </div>
    )
}

export default ProjectsComponent;