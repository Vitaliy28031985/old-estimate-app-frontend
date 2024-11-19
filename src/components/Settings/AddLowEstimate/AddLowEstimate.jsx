import React, { useState } from 'react';
import { useParams  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAddLowMutation} from "../../../redux/projectSlice/projectSlice";
import {projectsApi} from "../../../redux/projectSlice/projectSlice";
import s from "./AddLowEstimate.module.scss";

function AddLowEstimate() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const currentId = id;

    const [addLow] = useAddLowMutation();

    const [discount, setDiscount] = useState('');

    const handleChange = e => {
        const {name, value} = e.currentTarget;
        switch (name) {
           case 'discount':
               setDiscount(value);
               break;
               default:
               return;  
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (discount === '') {
            toast.error("Заповніть усі поля!");
            return;
        }
    
        const data = {
            discount,
            id: currentId
        }
       try {
       const discount = await addLow(data);
       console.log(discount);
        
        if (discount && discount.data) {
            toast(`Кошторис знижений на ${data.discount}% створено!`);
            dispatch(projectsApi.util.resetApiState());
        
            } else {
                 console.error('Unexpected response:', discount.error.data.message);
                 toast.error(discount.error.data.message);
                
                 }
                 } catch (error) {          
                 console.error('Error add discount:', error);
                 
             } 
        
        setDiscount('');
    }

    const disabled = discount === '';

    return (
        <div className={s.container}>
            <form onSubmit={handleSubmit}>
            <div className={s.inputContainer}>
                    <label  for="discount">Формування нижчого кошторису</label>
                    <input type="number" name="discount" id="discount" onChange={handleChange}  value={discount}  
                    placeholder="Введіть сюди  відсоток " />
                </div>
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Сформувати</button>
            </form>
        </div>
    ) 
}

export default AddLowEstimate;