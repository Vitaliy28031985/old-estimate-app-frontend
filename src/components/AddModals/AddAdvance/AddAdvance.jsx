import React, { useState } from 'react';
import { useParams} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAddAdvanceMutation} from '../../../redux/advances/advancesApi';
import {projectsApi} from "../../../redux/projectSlice/projectSlice";
import dataFormat from "../../../helpers/dataFormat";

import s from './AddAdvance.module.scss';

function AddAdvance({ onModal}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [addAdvance] = useAddAdvanceMutation();
  const [comment, setComment] = useState('');
  const [date, setDate] = useState('');
  const [sum, setSum] = useState('');




  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    switch (name) {
    case 'comment':
        setComment(value);
        break;
    case 'date':
        setDate(value);
        break;
    case 'sum':
        setSum(value);
        break;
      default:
        return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
        !comment ||
        !date  ||
        !sum
        ) {
      toast.error('Заповніть усі поля!');
      return;
    }

    const newAdvance = { id, advances: { 
        comment: comment || '',
        date: dataFormat(date)   || '',
        sum:  sum    || ''
    
    } };
   
    try {
   const add = await addAdvance(newAdvance);
   
  
    if (add && add.data) {
      dispatch(projectsApi.util.resetApiState());
      toast(`Позицію ${comment} додано!`)                  
      } else {
           console.error('Unexpected response:', add.error.data.message);
           toast.error(add.error.data.message);
           }
    } catch (error) {
      toast.error(`User with the title: ${comment} does not exist!`, error);
    } 
    setComment('');
    setDate('');
    setSum('');
    onModal();
  };

  const disabled = comment === '' && date === '' && sum ==='';

  return (
    <div className={s.container}>
      <form action="" onSubmit={handleSubmit}>

        <div className={s.inputContainer}>
          <label>Коментар</label>
          <input
            type="text"
            name="comment"
            onChange={handleChange}
            value={comment}
          />
        </div>

        <div className={s.inputContainer}>
          <label>Дата</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            value={date}
          />
        </div>

        <div className={s.inputContainer}>
          <label>Сума в грн.</label>
          <input
            type="number"
            name="sum"
            onChange={handleChange}
            value={sum}
          />
        </div>

        <button disabled={disabled} className={disabled ? "button-disabled" : "button"}>Додати</button>
      </form>
    </div>
  );
}

export default AddAdvance;