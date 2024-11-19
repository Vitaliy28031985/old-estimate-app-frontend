import { NavLink } from 'react-router-dom';
import {useLogoutMutation} from "../../../redux/auth/authApi";
import { unsetCredentials } from '../../../redux/auth/authSlice';
import { useDispatch } from 'react-redux';
import {priceApi} from "../../../redux/price/priceApi";
import {projectsApi} from "../../../redux/projectSlice/projectSlice";
import s from './MobileMenu.module.scss';

function MobileMenu({show}) {

    const dispatch = useDispatch();
    const [logout] = useLogoutMutation();
   

    const handleCloseNavMenu = async () => {
        await logout();
       dispatch(unsetCredentials());
       dispatch(projectsApi.util.resetApiState());
       dispatch(priceApi.util.resetApiState());
        };

return (
    <div className={s.container}>
        <div className={s.content}>
        <nav>
            <ul>
            <li onClick={show}><NavLink className={({ isActive }) => `linkTest` + (isActive ? ` link-min` : '')} to='/price'>Прайс</NavLink></li>
            <li onClick={show}><NavLink className={({ isActive }) => `linkTest` + (isActive ? ` link-min` : '')} to='/profile'>Профіль</NavLink></li>
            <li onClick={show}><NavLink className={({ isActive }) => `linkTest` + (isActive ? ` link-min` : '')} to='/projects'>Кошториси</NavLink></li>
            </ul>
        </nav>
        <button onClick={handleCloseNavMenu} className={s.button}>Вийти</button>
        </div>
    </div>
)

}

export default MobileMenu;