import { useState} from 'react';

import Select from './Select/Select';
import Input from './Input/Input';
import s from "./AddPosition.module.scss";

function AddPosition({onModal}) {
    
    const [toggle, setToggle] = useState(true);

    const handleToggle = () => {   
        setToggle(toggle => !toggle); 
        }

    return (
        <div className={s.container}>
            {toggle ? (<Select onModal={onModal}/>) : ( <Input onModal={onModal}/>)}
            
            <div className={s.toggleContainer}>
                {toggle ? (<p>Ви хочите додати позицію якої не має в прайсі ?</p>) : (<p>У вас є ця позиція в прайсі?</p>)} 
                <button type='button' onClick={handleToggle}>Прейти щоб додати</button>  
            </div>
           
        </div>
    )
}

export default AddPosition;