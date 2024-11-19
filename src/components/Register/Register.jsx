import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import {useSignupMutation, useLoginMutation} from "../../redux/auth/authApi";
import {setCredentials} from "../../redux/auth/authSlice";
import {priceApi} from "../../redux/price/priceApi";
import {projectsApi} from "../../redux/projectSlice/projectSlice";
import s from "./Register.module.scss";
function Register() {
    
    const [avatar, SetAvatar] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');

    const dispatch = useDispatch();
    const [singup] = useSignupMutation();
    const [login, ] = useLoginMutation();

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        SetAvatar(file);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const loginEl = {
        password,
        email
      };

    const handleChange = e => {
        const { name, value } = e.currentTarget;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'role':
                setRole(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'passwordTwo':
                setPasswordTwo(value);
                break;
            default:
                return;
        }
    }

   
    const handleSubmit = async e => {
        e.preventDefault();
        if(avatar === '' || name === '' || email === '' || phone === '' || role === '' || password === '' || passwordTwo === '' ) {
            toast("Заповніть усі поля");
            return;
        }
        if(password !== passwordTwo) {
            toast("введіть однакові паролі");
            return;
        }
        if(password.length < 6) {
            toast("введіть пароль з 6 і більше символів");
            return;
        }
    
        const formData = new FormData();
        formData.append('image', avatar);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('role', role);
        formData.append('password', password);
    
        try {
             const user = await singup(formData).unwrap();
             const dataAnswers = await login(loginEl).unwrap();
             dispatch(setCredentials(user));
             dispatch(setCredentials(dataAnswers));
             dispatch(projectsApi.util.resetApiState());
             dispatch(priceApi.util.resetApiState());
             
            toast("Реєстрація пройшла успішно");
        } catch (error) {
            toast.error('Sorry, something went wrong', error);
        }
    
        setEmail('');
        setName('');
        setPhone('');
        setRole('');
        setPassword('');
        setPasswordTwo('');
    
       
    }
    

    
   
    const disabled = name === '' && email === '' && role === '' && password === '' && passwordTwo === '' && phone === '';


    return (
        <div>
            <h1>Реєстрація</h1>
            
            <form className={s.form} onSubmit={handleSubmit}>
                <div>
            <div {...getRootProps()} className={s.aadPhoto}>
           <div>
            <input {...getInputProps()} />
            {avatar && <img className={s.img} src={URL.createObjectURL(avatar)} alt="" />}
            <p className={s.aadPhotoText}>Перетягніть файли сюди або натисніть для вибору файлів</p>
            </div>
            </div>
                <div className={s.inputContainer}>
                    <label  for="name">Ім'я</label>
                    <input type="text" name="name"id="name" onChange={handleChange} value={name}  placeholder="Введіть сюди своє ім'я" />
                </div>
                <div className={s.inputContainer}>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" onChange={handleChange} value={email} placeholder="Введіть сюди свій email" />
                </div>
                <div className={s.inputContainer}>
                    <label for="phone">Телефон</label>
                    <input type="tel" id="phone" name="phone" onChange={handleChange} value={phone} placeholder="Введіть сюди свій телефон" />
                </div>

                <div className={s.radioContainer}>
                    <p className={s.titleRadio}>Роль:</p>
                <div>
                    <input className={s.real} type="radio" onChange={handleChange} id="customer" name="role" value="customer" />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="role"  for="customer">Замовник</label>
                </div>
                <div>
                    <input className={s.real} type="radio" onChange={handleChange} id="executor" name="role" value="executor" />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="role"  for="executor">Виконавець</label>
                </div>
                </div>
                <div className={s.inputContainer}>
                    <label for="password" >Пароль</label>
                    <input type="password" id="password" name="password" onChange={handleChange} value={password} placeholder="Введіть сюди свій пароль"/>
                </div>
                <div className={s.inputContainer}>
                    <label for="passwordTwo" >Підтвердження паролю</label>
                    <input type="password" id="passwordTwo" name="passwordTwo" onChange={handleChange} value={passwordTwo} placeholder="Ще раз введіть сюди свій  пароль"/>
                </div>
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Зареєструватися</button>
                </div>
            </form>
        </div>
        
    )
}

export default Register;