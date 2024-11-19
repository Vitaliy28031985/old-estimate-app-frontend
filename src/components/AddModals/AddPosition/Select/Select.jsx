import { useState} from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetProjectByIdQuery } from '../../../../redux/projectSlice/projectSlice';
import {useGetUnitQuery} from "../../../../redux/unit/unitApi"
import s from "./Select.module.scss"


function Select({onModal}) {
    const { id } = useParams();
    const {data: units} = useGetUnitQuery();
    const { data: project } = useGetProjectByIdQuery(id);
    const [filter, setFilter] = useState('');
    const [title, setTitle] = useState('');
    const [unit, setUnit] = useState('');
    const [number, setNumber] = useState('');
  

    const filterChange = e => setFilter(e.target.value);

    const normalizeFilter = filter.toLowerCase();

    const filteredPrices = project?.prices?.filter(item =>
      item.title.toLowerCase().includes(normalizeFilter)) ?? [];
  
 
  const handleChange = e => {
    const {name, value,} = e.currentTarget;
    switch (name) {
      
       case 'title':
        setTitle(value);
        break;
        case 'unit':
        setUnit(value);
        break;
        case 'number':
        setNumber(value);
        break;
    
       default:
       return;  
    }
 }

 const handleSubmit = async e => {
  
    e.preventDefault();
    if(title === '' || unit === '' || number === '' || title === '') {
      toast.error("Усі поля мають бути заповнені")
      return;
    }
  
   const currentPrice = await project?.prices?.filter(item => item.title === title);
   
   console.log("currentPrice")
   
  const priceCurrent = currentPrice[0].price
 
  
  await onModal("position", {title, unit, number: Number(number), price: priceCurrent});

      setTitle('');
      setNumber('');
      setUnit('');
      
  }


 const disabled = unit === '' && number === '' && title === '';

   return(
     <div>
       <input onChange={filterChange} value={filter} type="text" className={s.input} placeholder='Пошук з прайсу' />
       <form onSubmit={handleSubmit} >
        <div>
        <label for='title' className={s.label}>Вид роботи</label>
        <select className={s.input}  name="title" id="title" onChange={handleChange}>
       {filteredPrices && filteredPrices?.map(({ title}) =>
       (<option value={title} >{title}</option>))}
        <option value="" selected>Вибери вид роботи</option>
       </select>
        </div>

        <div>
        <label for='unit' className={s.label}>Одиниця</label>
        <select className={s.input}  name="unit" id="unit" onChange={handleChange}>
        {units && units?.map(({ title}) => (<option value={title} >{title}</option>))}
        <option value="" selected>Вибери одиницю виміру</option>
        </select>
        </div>

        <div>
        <label for="number" className={s.label}>Кількість</label>
        <input className={s.input} type="number" value={number} name="number" id='number' onChange={handleChange} />
        </div>
        
        <button disabled={disabled} className={disabled ? "button-disabled" : "button"}>Додати</button>

       </form>
        
    </div>
    )
}

export default Select;