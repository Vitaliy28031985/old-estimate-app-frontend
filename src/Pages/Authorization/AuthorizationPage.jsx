import { useState } from 'react';
import Login from "../../components/Login/Login";
import Register from "../../components/Register/Register";
import s from "./AuthorizationPage.module.scss";
function AuthorizationPage() {
    const [toggle, setToggle] = useState(true);

    const handleToggle = () => {
        setToggle(toggle => !toggle);
    }
    return(
    <div className={s.container}>
        {toggle ? (<Login/>) : (<Register/>)}

    {toggle ? 
    (<p className={s.toggle}>У вас ще не має акаунту? <div onClick={handleToggle}>Зареєструватись</div></p>) :
    (<p className={s.toggle}>У вас вже є акаунт? <div onClick={handleToggle}>Увійти</div></p>)
    }

    </div>
    )
}

export default AuthorizationPage;