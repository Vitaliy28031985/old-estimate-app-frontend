import React, { useState } from 'react';
import {  toast } from 'react-toastify';
import { useNavigate  } from 'react-router-dom';
import {useAddProjectsMutation, useGetProjectsQuery} from "../../../redux/projectSlice/projectSlice";
import 'react-toastify/dist/ReactToastify.css';
import s from "./AddProject.module.scss"

function AddProject({onModal}) {
    const navigate = useNavigate();  
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const {data} = useGetProjectsQuery();
    const [addProjects] = useAddProjectsMutation();

    const handleChange = e => {
        const {name, value} = e.currentTarget;
        switch (name) {
           case 'title':
            setTitle(value);
             break;
            case 'description':
            setDescription(value);
            break;
               default:
               return;  
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (title === '' && description === '') {
            toast.error("Заповніть усі поля!");
            return;
        }
    
        if (data?.projects.find(data => data.title === title)) {
            toast.error(`Кошторис ${title} вже існує`);
            setTitle('')
            setDescription('')
            return;
        }
        
        try {
    const newProject = {title, description}
        const add = await addProjects(newProject);
        
        if (add && add.data) {
            toast(`Кошторис ${add.data.title} створено!`);                  
            } else {
                 console.error('Unexpected response:', add.error.data.message);
                 toast.error(add.error.data.message);
                 navigate(`/allow`)
                 }
          } catch (error) {
            toast.error(`User with the title: ${title} does not exist!`, error);
          }
        setTitle('');
        setDescription('');
        onModal()
    }

    const disabled = title === '' || description === '';

    return (
        <div>
            <form className={s.container} onSubmit={handleSubmit}>
            <div className={s.inputContainer}>
                    <label  for="title">Найменування</label>
                    <input type="text" maxLength="20" name="title" id="title"  value={title} onChange={handleChange} 
                    placeholder="Введіть сюди назву об'єкту (20 символів)" />
            </div>
            <div className={s.inputContainer}>
                    <label  for="description">Адреса об'єкту</label>
                    <input type="text" maxLength="30" name="description" id="description"  value={description} onChange={handleChange} 
                    placeholder="Введіть сюди адресу об'єкту (30 символів)" />
                </div>
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Додати</button>
            </form>
        </div>
    )
}

export default AddProject;