import { useState} from "react";
import { toast } from 'react-toastify';
import {useAddAllowUserMutation} from "../../../redux/auth/authApi";
import s from "./AdminFunctions.module.scss";

function AdminFunctions() {
    const [email, setEmail] = useState('');
    const [time, setTime] = useState('');

    const [addAllowUser] = useAddAllowUserMutation();

    const handleChange = e => {
        const {name, value} = e.currentTarget;
        switch (name) {
           case 'email':
               setEmail(value);
               break;
           case 'time':
               setTime(value);
               break;
           default:
               return;  
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (email === '' || time === '') {
            toast("Заповніть усі поля!");
            return;
        }
        const allowObj = {
            email,
            time: Number(time)
        }
        await addAllowUser(allowObj);

        setEmail('');
        setTime('');
    }
    
    return (
        <div className={s.adminFunction}>
            <h3>Доступ користувачів</h3>
            <form onSubmit={handleSubmit}>
                <div className={s.input}>
                <label for="time" id="time">Кількість днів</label>
                <input type="number" name="time" id="time" onChange={handleChange} value={time} />
                </div>
                <div className={s.input}>
                <label for="email" id="email">Email</label>
                <input type="email" name="email" onChange={handleChange} value={email} />
                </div>
                <button type="submit">Надати</button>
            </form>
        </div>
    )
}

export default AdminFunctions;