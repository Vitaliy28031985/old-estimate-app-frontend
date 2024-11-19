import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import { useParams  } from 'react-router-dom';
import {  toast } from 'react-toastify';
import { useAddEstimateMutation } from '../../../redux/estimate/estimateApi';
import {projectsApi} from "../../../redux/projectSlice/projectSlice";
import 'react-toastify/dist/ReactToastify.css';
import s from "./AddEstimate.module.scss";

function AddEstimate({onModal}) {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [addEstimate] = useAddEstimateMutation();

    const dispatch = useDispatch();
    
    const handleChange = e => {
        const {name, value} = e.currentTarget;
        switch (name) {
           case 'title':
            setTitle(value);
             break;
               default:
               return;  
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const newEstimate = {id, estimates: { title: title || '' }}
                const add = await addEstimate(newEstimate);
                
                if (add && add.data) {
                    dispatch(projectsApi.util.resetApiState());
                    toast(`Таблицю ${title} додано`)               
                    } else {
                         console.error('Unexpected response:', add.error.data.message);
                         toast.error(add.error.data.message);
                         }
                  } catch (error) {
                    toast.error(`User with the title: ${title} does not exist!`, error);
                  }

        setTitle('');
        onModal()
    }

    const disabled = title === '';

    return (
        <div>
            <form className={s.container} onSubmit={handleSubmit}>
            <div className={s.inputContainer}>
                    <label  for="title">Найменування</label>
                    <input type="text" maxLength="20" name="title" id="title"  value={title} onChange={handleChange} 
                    placeholder="Введіть сюди назву таблиці (20 символів)" />
            </div>
        
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Додати</button>
            </form>
        </div>
    )
}

export default AddEstimate;