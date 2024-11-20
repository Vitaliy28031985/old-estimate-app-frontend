import { useState, useEffect} from "react";
import {useCurrentQuery} from "../../../redux/user/userApi";
import Unit from '../Unit/Unit';
import AdminFunctions from '../AdminFunctions/AdminFunctions';
import { useChangeNameMutation } from "../../../redux/user/userApi";
import s from "./ProfileInfo.module.scss";

function ProfileInfo() {
    const { data } = useCurrentQuery();
    const [changeName] = useChangeNameMutation()
    const [userRole, setUserRole] = useState(false);
    const [changeNameState, setChangeName] = useState(data?.name);

    const [name, setName] = useState(true);
  
    const [isAdmin, setIsAdmin] = useState(false);

    const handleToggle = () => {
        setIsAdmin(isAdmin => !isAdmin);
        
    }
    
    const onChange = e => {
        const {name, value,} = e.currentTarget;
        switch (name) {
            case 'name':
                setChangeName(value);
}
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
            <img src={avatarUrl} alt="avatar"  onError={(e) => { e.target.src = defaultAvatar; }} />
        </div>
        <ul className={s.data}>
        <li className={s.dataItem}>
                        <button onClick={() => {
                            setName(name => !name);
                            changeName({name: changeNameState})
                        }}>Change</button>
            <p className={s.dataTitle}>Ім'я: </p>
            {name ? (<p className={s.dataContent}>{changeNameState}</p>) : (<input onChange={onChange} className={s.dataContentInput} value={changeNameState} name="name" ></input>)}
            {/* <p className={s.dataContent}>{data?.name}</p> */}
        </li>
        <li className={s.dataItem}>
            <p className={s.dataTitle}>Email: </p>
            <p className={s.dataContent}>{data?.email}</p>
        </li>
        <li className={s.dataItem}>
            <p className={s.dataTitle}>Номер телефону: </p>
            <p className={s.dataContent}>{data?.phone}</p>
        </li>
        <li className={s.dataItem}>
            <p className={s.dataTitle}>Роль користувача: </p>
            <p className={s.dataContent}>{role}</p>
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