import React, { useState } from 'react';
import { useParams  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {projectsApi} from "../../../redux/projectSlice/projectSlice";
import {useAddDiscountMutation} from "../../../redux/projectSlice/projectSlice";
import s from "./AddDiscount.module.scss";

function AddDiscount() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const [addDiscount] = useAddDiscountMutation();
    const [discount, setDiscount] = useState('');
    const currentId = id;

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
       const discount = await addDiscount(data);
       
       if (discount && discount.data) {
        toast(discount.data.message);
      
        dispatch(projectsApi.util.resetApiState());
        setDiscount('');
    
        } else {
             console.error('Unexpected response:', discount.error.data.message);
             toast.error(discount.error.data.message);
            
             }
             } catch (error) {          
             console.error('Error add discount:', error);
             
         } 
    }

    const disabled = discount === '';

    return (
        <div className={s.container}>
            <form onSubmit={handleSubmit}>
            <div className={s.inputContainer}>
                    <label  for="discount">Формування знижки</label>
                    <input type="number" name="discount" id="discount" onChange={handleChange}  value={discount}  
                    placeholder="Введіть сюди  відсоток знижки" />
                </div>
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Сформувати</button>
            </form>
        </div>
    )
}

export default AddDiscount;