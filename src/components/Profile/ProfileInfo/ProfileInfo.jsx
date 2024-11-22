import { useState, useEffect} from "react";
import {useCurrentQuery} from "../../../redux/user/userApi";
import Unit from '../Unit/Unit';
import Pencil from "../../Icons/Pencil/Pencil";
import AdminFunctions from '../AdminFunctions/AdminFunctions';
import {
    useChangeNameMutation, useChangeEmailMutation, useChangePhoneMutation,
    useChangeRoleMutation, useChangePasswordMutation, useChangeAvatarMutation
} from "../../../redux/user/userApi";
import s from "./ProfileInfo.module.scss";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProfileInfo() {
    const { data } = useCurrentQuery();
    const [changeName] = useChangeNameMutation();
    const [changeEmail] = useChangeEmailMutation();
    const [changePhone] = useChangePhoneMutation();
    const [changeRole] = useChangeRoleMutation();
    const [changePassword] = useChangePasswordMutation();
    const [changeAvatar] = useChangeAvatarMutation()

    const [userRole, setUserRole] = useState(false);
    const [changeNameState, setChangeName] = useState(data?.name);
    const [changeEmailState, setChangeEmail] = useState(data?.email);
    const [changePhoneState, setChangePhoneState] = useState(data?.phone);
    const [roleState, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [avatar, SetAvatar] = useState(null);

    const [name, setName] = useState(true);
    const [email, setEmail] = useState(true);
    const [phone, setPhone] = useState(true);
  
    const [isAdmin, setIsAdmin] = useState(false);

    const handleToggle = () => {
        setIsAdmin(isAdmin => !isAdmin);
        
    }
    
    const onChange = e => {
        const {name, value, files} = e.currentTarget;
        switch (name) {
             case 'avatar':
           SetAvatar(files[0]);
           break;
            case 'name':
                setChangeName(value);
                break;
            case 'email':
               setChangeEmail(value);
                break;
            case 'phone':
                setChangePhoneState(value);
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
}
    }

    const roleSubmit = async e => {
        e.preventDefault();
        if (roleState !== '') {
            await changeRole({ role: roleState })
            setRole('');  
        }
    }

    const passwordSubmit = async e => {
        e.preventDefault();

        if(password.length < 6) {
            toast("Пароль має містити принаймні 6 символів та в його складі має бути принаймні одна літера та один спеціальний символ (*, #, & тощо)!");
            return;
        }
        await changePassword({ oldPassword: password, newPassword: passwordTwo });
        setPassword('');
        setPasswordTwo('');

    }

    const avatarSubmit = async e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('avatar', avatar);
        await changeAvatar(formData);
        
    }
    
      useEffect(() => {

        if (data) {
          const role = data?.role;
          const isUserRole = role === "admin";
             setUserRole(isUserRole);
        }
    }, [data, userRole]);
  
   
      let role = "";
      
  
      if(data?.role === "executor") {
          role = "виконавець";
      }
  
      if(data?.role === "admin") {
          role = "адміністратор";
      }
  
      if(data?.role === "customer") {
          role = "замовник";
      }

      const defaultAvatar = "https://www.shutterstock.com/image-illustration/avatar-modern-young-guy-working-260nw-2015853839.jpg";
      const avatarUrl = data?.avatar || defaultAvatar;      

    return(
        <div>
        <div className={s.userDataContainer}> 
        <div className={s.avatarContainer}>
            <img src={avatarUrl} alt="avatar" onError={(e) => { e.target.src = defaultAvatar; }} />

         <form onSubmit={avatarSubmit}>   
            <input
            className={s.avatarInput}              
            type="file"
            accept="image/*"
            name="avatar"
            onChange={onChange}/>
                        
            <button className={s.buttonAvatar}><Pencil
                width={"20"}
                height={"20"}
             /></button>
            </form>
                    
        </div>
                
            
        <ul className={s.data}>
        <li className={s.dataItem}>
         <button
             className={s.changeButton}
            onClick={() => {
             setName(name => !name);
            changeName({name: changeNameState})
             }}><Pencil
                width={"20"}
                height={"20"}
            /></button>
            <p className={s.dataTitle}>Ім'я: </p>
            {name ? (<p className={s.dataContent}>{changeNameState}</p>) : (<input onChange={onChange} className={s.dataContentInput} value={changeNameState} name="name" ></input>)}
            {/* <p className={s.dataContent}>{data?.name}</p> */}
        </li>
        <li className={s.dataItem}>
            <button
             className={s.changeButton}
            onClick={() => {
             setEmail(email => !email);
            changeEmail({email: changeEmailState})
             }}><Pencil
                width={"20"}
                height={"20"}
             /></button>
              <p className={s.dataTitle}>Email: </p>           
            {email ? ( <p className={s.dataContent}>{data?.email}</p>) : (<input onChange={onChange} className={s.dataContentInput} value={changeEmailState} name="email" ></input>)}
           
           
        </li>
        <li className={s.dataItem}>
            <button
            className={s.changeButton}
            onClick={() => {
            setPhone(phone => !phone);
            changePhone({phone: changePhoneState})
             }}><Pencil
                width={"20"}
                height={"20"}
             /></button>
            <p className={s.dataTitle}>Номер телефону: </p>
            {phone ? (<p className={s.dataContent}>{data?.phone}</p>) : (<input onChange={onChange} className={s.dataContentInput} value={changePhoneState} name="phone" ></input>)}            
            
        </li>
        <li className={s.dataItem}>
            <p className={s.dataTitle}>Роль користувача: </p>
            <p className={s.dataContent}>{role}</p>
        </li> 
       <li >
          <form onSubmit={roleSubmit}>
          <div className={s.radioContainer}>
                    <p className={s.titleRadio}>Роль:</p>
                <div>
                    <input className={s.real} type="radio" onChange={onChange} id="customer" name="role" value="customer" />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="role"  for="customer">Замовник</label>
                </div>
                <div>
                    <input className={s.real} type="radio" onChange={onChange} id="executor" name="role" value="executor" />
                    <span className={s.falseness}></span>
                    <label className={s.label} name="role"  for="executor">Виконавець</label>
                </div>
                            </div>   
                <button className={s.buttonForm}><Pencil
                width={"20"}
                height={"20"}
             /></button>            
            </form>              
        </li>
        <li>
            <form onSubmit={passwordSubmit}>
                <div className={s.inputContainer}>
                    <label for="password" >Пароль</label>
                    <input type="password" id="password" name="password" onChange={onChange} value={password} placeholder="Введіть сюди свій пароль"/>
                </div>
                <div className={s.inputContainer}>
                    <label for="passwordTwo" >Підтвердження паролю</label>
                    <input type="password" id="passwordTwo" name="passwordTwo" onChange={onChange} value={passwordTwo} placeholder="Ще раз введіть сюди свій  пароль"/>
                </div>
                <button className={s.buttonForm}><Pencil
                width={"20"}
                height={"20"}
             /></button> 
            </form>
                        
        </li>
    </ul>
                
        
        {userRole ? (<div >
            {isAdmin ? (<AdminFunctions/>) : (<Unit />)} 
            <button className={s.toggleButton} type='button' onClick={handleToggle}>{isAdmin ? "До одиниць" : "До дозволу"}</button>
        </div>) : (<Unit />)}
                

        
        </div>
       </div>
       
    )
}

export default ProfileInfo;