import React, { useState, useEffect } from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useParams  } from 'react-router-dom';
import {useGetUsersQuery} from '../../../redux/auth/authApi';
import { useGetProjectByIdQuery } from '../../../redux/projectSlice/projectSlice';
import {useUpdateAllowUserMutation} from "../../../redux/auth/authApi";
import {projectsApi} from "../../../redux/projectSlice/projectSlice";

import s from "./UpdateAllow.module.scss";

function UpdateAllow() {
    const {id} = useParams();
    const dispatch = useDispatch();

    const {data} = useGetUsersQuery();
    const { data: project } = useGetProjectByIdQuery(id);
    const [updateAllowUser] = useUpdateAllowUserMutation();
    
    const [userData, setUserData] = useState(null);
    const [projectArr, setProjectArr] =useState(null)
    
    const [email, setEmail] = useState('');
    const [level, setLevel] = useState('');
    const [lookAt, setLookAt] =useState('');
    const [lookAtTotals, setLookAtTotals] = useState('');

    useEffect(() => {
        if (data) {
        setUserData(data);
       
        }  
       
      }, [data]);
      
      useEffect(() => {
        if(project) {
          setProjectArr(project);  
         } 
      }, [project, id]
      
      )

      const userIdList =  projectArr?.allowList;
      let userEmailList = [];

      const renderData = () => {
      for(let i = 0; i < userIdList?.length; i++) {
      const userWithProject = userData?.filter(({_id}) => _id === userIdList[i]) 

      if (userWithProject && userWithProject.length > 0) {
        userEmailList.push(userWithProject[0].email);
      }    
    }
  
}

renderData()



    const handleChange = (e) => {

        const { name, value } = e.currentTarget;
        switch (name) {
        case 'email':
            setEmail(value);
            break;
        case 'updateLevel':
             setLevel(value);
             break;
        case 'UpdateLookAt':
             setLookAt(value);
             break;
        case 'updateLookAtTotals':
             setLookAtTotals(value)
             break;
          default:
            return;
        }
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if ( email === '' || level === '' || lookAt === '' || lookAtTotals === '') {
            toast.error("Заповніть усі поля!");
            return;
        }
        try {
        const update =  await updateAllowUser({id, email, allowLevel: level, lookAt, lookAtTotals});
        
        if (update && update.data) {
            dispatch(projectsApi.util.resetApiState());
            toast("Дозвіл до кошторису успішно обновлено!");                 
            } else {
                 console.error('Unexpected response:', update.error.data.message);
                 toast.error(update.error.data.message);
                 }
          } catch (error) {
            toast.error(`User with the title: ${email} does not exist!`, error);
          } 


        setEmail('');
        setLevel('');
        setLookAt('');
        setLookAtTotals('');
    
    }

    const disabled = email === '' && level === '' && lookAt === '' && lookAtTotals === '' ;
    return(
        <div className={s.container}>
            <form onSubmit={handleSubmit}>
                <div className={s.inputContainer}>
                    <label  for="email">Обновлення даних дозволу до кошторису користувача</label>
                    <select  name="email" id="email" onChange={handleChange}>
                        {userEmailList?.map(email =>
                           (<option value={email} >{email}</option>))}
                           {email === '' && (<option value="" selected>Вибери email для обновлення даних</option>)}
                     </select>
                </div>

                <div className={s.radioContent}>
                    <p className={s.titleRadio}>Рівень доступу:</p>
                    <div className={s.radioContainer}>
                <div>
                    <input className={s.real} type="radio"  name="updateLevel" id="updateWead" onChange={handleChange} checked={level === "read"}  value="read"/>
                    <span className={s.falseness}></span>
                    <label className={s.label} name="allowLevel"  for="updateWead">Перегляд</label>
                </div>
                <div>
                    <input className={s.real} type="radio"  id="updateWrite" name="updateLevel" onChange={handleChange} checked={level === "write"} value="write"  />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="allowLevel"  for="updateWrite">Редагування</label>
                </div>
                </div>
                </div>

                <div className={s.radioContent}>   
                    <p className={s.titleRadio}>Рівень доступу до кошторисів:</p>
                    <div className={s.radioContainer}>
                <div>
                    <input className={s.real} type="radio"  name="UpdateLookAt" id="updateAarge" onChange={handleChange} checked={lookAt === "large"} value="large"/>
                    <span className={s.falseness}></span>
                    <label className={s.label} name="lookAt"  for="updateAarge">загального</label>
                </div>
                <div>
                    <input className={s.real} type="radio"  id="updateAmall" name="UpdateLookAt" onChange={handleChange} checked={lookAt === "small"}   value="small"  />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="lookAt"  for="updateAmall">меншого</label>
                </div>
                <div>
                    <input className={s.real} type="radio"  id="updateAll" name="UpdateLookAt" onChange={handleChange} checked={lookAt === "all"} value="all"  />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="lookAt"  for="updateAll">всіх</label>
                </div>
                </div>
                </div>

                <div className={s.radioContent}>
                    <p className={s.titleRadio}>Рівень показу меншого звіту:</p>
                    <div className={s.radioContainer}>
                <div>
                    <input className={s.real} type="radio"  name="updateLookAtTotals" id="updateShow" onChange={handleChange} checked={lookAtTotals === "show"} value="show"/>
                    <span className={s.falseness}></span>
                    <label className={s.label} name="allowLevel"  for="updateShow">Показувати</label>
                </div>
                <div>
                    <input className={s.real} type="radio"  id="updateNotShow" name="updateLookAtTotals" onChange={handleChange} checked={lookAtTotals === "notShow"} value="notShow"/>
                    <span className={s.falseness}></span>
                    <label className={s.label} name="allowLevel"  for="updateNotShow">Не показувати</label>
                </div>
                </div>
                </div>
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Обновити</button>
            </form>
        </div>
    )
}

export default UpdateAllow;