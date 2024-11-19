import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams  } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAddAllowMutation} from "../../../redux/auth/authApi"
import {projectsApi} from "../../../redux/projectSlice/projectSlice";

import s from "./AddAllow.module.scss";

function AddAllow() {
    const {id} = useParams();
    const dispatch = useDispatch();

    const [addAllow] = useAddAllowMutation();
    
    const [email, setEmail] = useState('');
    const [level, setLevel] = useState('');
    const [lookAt, setLookAt] =useState('');
    const [lookAtTotals, setLookAtTotals] = useState('');

    const handleChange = (e) => {

        const { name, value } = e.currentTarget;
        switch (name) {
        case 'email':
            setEmail(value);
            break;
        case 'allowLevel':
             setLevel(value);
             break;
        case 'lookAt':
             setLookAt(value);
             break;
        case 'lookAtTotals':
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
       const add = await addAllow({id, newData: {email, allowLevel: level, lookAt, lookAtTotals}});
       
        
        if (add && add.data) {
            dispatch(projectsApi.util.resetApiState());
            toast("Дозвіл до кошторису успішно додано!");                 
            } else {
                 console.error('Unexpected response:', add.error.data.message);
                 toast.error(add.error.data.message);
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
                    <label  for="email">Надання доступу до кошторису користувачеві</label>
                    <input type="email" name="email" id="email" onChange={handleChange}  value={email}  placeholder="Введіть сюди email користувача" />
                </div>

                <div className={s.radioContent}>
                    <p className={s.titleRadio}>Рівень доступу:</p>
                    <div className={s.radioContainer}>
                <div>
                    <input className={s.real} type="radio"  name="allowLevel" id="read" onChange={handleChange} checked={level === "read"}  value="read"/>
                    <span className={s.falseness}></span>
                    <label className={s.label} name="allowLevel"  for="read">Перегляд</label>
                </div>
                <div>
                    <input className={s.real} type="radio"  id="write" name="allowLevel" onChange={handleChange} checked={level === "write"} value="write"  />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="allowLevel"  for="write">Редагування</label>
                </div>
                </div>
                </div>

                <div className={s.radioContent}>   
                    <p className={s.titleRadio}>Рівень доступу до кошторисів:</p>
                    <div className={s.radioContainer}>
                <div>
                    <input className={s.real} type="radio"  name="lookAt" id="large" onChange={handleChange} checked={lookAt === "large"} value="large"/>
                    <span className={s.falseness}></span>
                    <label className={s.label} name="lookAt"  for="large">загального</label>
                </div>
                <div>
                    <input className={s.real} type="radio"  id="small" name="lookAt" onChange={handleChange} checked={lookAt === "small"}   value="small"  />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="lookAt"  for="small">меншого</label>
                </div>
                <div>
                    <input className={s.real} type="radio"  id="all" name="lookAt" onChange={handleChange} checked={lookAt === "all"} value="all"  />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="lookAt"  for="all">всіх</label>
                </div>
                </div>
                </div>

                <div className={s.radioContent}>
                    <p className={s.titleRadio}>Рівень показу меншого звіту:</p>
                    <div className={s.radioContainer}>
                <div>
                    <input className={s.real} type="radio"  name="lookAtTotals" id="show" onChange={handleChange} checked={lookAtTotals === "show"} value="show"/>
                    <span className={s.falseness}></span>
                    <label className={s.label} name="allowLevel"  for="show">Показувати</label>
                </div>
                <div>
                    <input className={s.real} type="radio"  id="notShow" name="lookAtTotals" onChange={handleChange} checked={lookAtTotals === "notShow"} value="notShow"/>
                    <span className={s.falseness}></span>
                    <label className={s.label} name="allowLevel"  for="notShow">Не показувати</label>
                </div>
                </div>
                </div>
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Надати дозвіл</button>
            </form>
        </div>
    )
}

export default AddAllow;