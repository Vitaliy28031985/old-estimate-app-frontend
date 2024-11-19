import { useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {useLogoutMutation} from "../../redux/auth/authApi";
import { unsetCredentials } from '../../redux/auth/authSlice';
import {priceApi} from "../../redux/price/priceApi";
import {projectsApi} from "../../redux/projectSlice/projectSlice";
import MobileMenu from './MobileMenu/MobileMenu';
import Burger from "../Icons/Burger/Burger";
import Close from '../Icons/Close/Close';
import s from "./Header.module.scss";



function Header () {
    const [showMenu, setShowMenu] = useState(true);

    const dispatch = useDispatch();
    const [logout] = useLogoutMutation();
   

    const handleCloseNavMenu = async () => {
        await logout();
       dispatch(unsetCredentials());
       dispatch(projectsApi.util.resetApiState());
       dispatch(priceApi.util.resetApiState());
        };

    const handleToggle = () => {
        setShowMenu(showMenu => !showMenu);
      }

    

return (<div className={s.content}>
    <header className={s.header}>
        
    <div className={s.buttons}>
    <NavLink  to='/profile'><div className={s.logo}></div></NavLink>

        <div className={s.menu}>
            <button onClick={handleToggle}>
                {showMenu ? 
                (<Burger width={"50"} height={"50"}/>) :
                (<Close width={"50"} height={"50"}/>)
                }
                
                </button>
        </div>
    </div>
       
      
     <nav>
        <ul className={s.navContainer}>
        <li><NavLink className={({ isActive }) => isActive ? `${s.link} ${s['link-min']}` : s.link} to='/price'>Прайс</NavLink></li>
        <li><NavLink className={({ isActive }) => isActive ? `${s.link} ${s['link-min']}` : s.link} to='/profile'>Профіль</NavLink></li>
        <li><NavLink className={({ isActive }) => isActive ? `${s.link} ${s['link-min']}` : s.link} to='/projects'>Кошториси</NavLink></li>
        </ul>
     </nav>
     <button className={s.button} onClick={handleCloseNavMenu} >Вийти</button>
    
     
    </header>
     {!showMenu && (<MobileMenu show={handleToggle}/>)}
     </div>
)
}

export default Header;