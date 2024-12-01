import { useState } from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import {useLoginMutation, useGoogleQuery, useSendVerifyPasswordMutation, useVerifyPasswordMutation} from "../../redux/auth/authApi";
import {setCredentials} from "../../redux/auth/authSlice";
import {priceApi} from "../../redux/price/priceApi";
import {projectsApi} from "../../redux/projectSlice/projectSlice";
import s from "./Login.module.scss";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailTwo, setEmailTwo] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, SetNewPassword] = useState('');

    const [show, setShow] = useState(false);
    const [showCode, setShowCode] = useState(false);

    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [sendVerifyPassword] = useSendVerifyPasswordMutation();
    const [verifyPasswordF] = useVerifyPasswordMutation();
    //  const { data, error, isLoading, refetch } = useGoogleQuery();

//   // Функція для ініціації авторизації
//   const handleGoogleLogin = () => {
//     // Тут ви можете вручну викликати refetch для ініціації запиту до серверу
//     refetch();
//   };


    const loginData = {
        email,
        password,
      };


    const handleChange = e => {
        const {name, value,} = e.currentTarget;
        switch (name) {
          
           case 'email':
            setEmail(value);
            break;
            case 'password':
            setPassword(value);
            break;
            
            case 'emailTwo':
            setEmailTwo(value);
            break;
            
            case 'code':
            setCode(value);
            break;
            
             case 'newPassword':
            SetNewPassword(value);
            break;
        
           default:
           return;  
        }
     }

     const handleSubmit = async e => {
        e.preventDefault();
        if( email === '' || password === '') {
            toast.error("Заповніть усі поля")
            return
        }
        if(password.length < 6) {
            toast.error("введіть пароль з 6 і більше символів")
            return
        }
         
        try {
            const dataAnswers = await login(loginData).unwrap();
            dispatch(setCredentials(dataAnswers));
            dispatch(projectsApi.util.resetApiState());
            dispatch(priceApi.util.resetApiState());
            console.log(loginData);
            toast(`Користувача з Email: ${email} успішно увійшов в систему!`)

          } catch (error) {
            toast.error(`Користувача з Email: ${email} не існує, або Ви ввели невірний пароль!`, error);
          }
    // console.log({email, password});
    setEmail('')
    setPassword('')
     }
    
    const sendCode = async e => {
        e.preventDefault();
        if (emailTwo !== '')
            await sendVerifyPassword({ email: emailTwo });
            setShowCode(true);
        {

        }

        
        
    }

    const verifyPassword = async e => {
        e.preventDefault();
        if (code !== '' || newPassword !== '') {
            await verifyPasswordF({email: emailTwo, code: Number(code), password: newPassword})
            setShowCode(false);
            setShow(false);
        }  
        
        setCode('');
        SetNewPassword('');
        setEmailTwo('');
    }

    const handleGoogleLogin = async () =>
    {
        try {
            const response = await axios.get('https://team-estimate-app-backend.onrender.com/auth/google');
            window.location.href = response.request.responseURL;
        }
        catch (error) { console.error('Error during Google login', error); }
    };
    const disabled = email === '' && password === '';

    return(
    <div>
            <h1>Авторизація</h1>
            
            <button className={s.googleButton} onClick={handleGoogleLogin} >Продовжити з Google</button>
    
            <form className={s.form} onSubmit={handleSubmit}>
                <div>
                <div className={s.inputContainer}>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} placeholder="Введіть сюди свій email" />
                </div>
                <div className={s.inputContainer}>
                    <label for="password" >Пароль</label>
                    <input type="password" id="password" name="password" value={password} onChange={handleChange} placeholder="Введіть сюди свій пароль"/>
                </div>
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Увійти</button>
                </div>
            </form>
            <div className={s.forget}>
                {!show && (
                  <button className='button buttonForget'
                    onClick={() => {
                        setShow(show => !show);
                }}
                >Забули пароль</button>   
                )}
               
                {show && (<div className={s.showContainer}>
                    {!showCode ? (
                      <form onSubmit={sendCode} >
                        <input type="text" name='emailTwo' placeholder='rube@i.ua' onChange={handleChange} className={s.input} value={emailTwo} />
                    <button className='button'>Отримати код</button>
                    </form>    
                    ) :
                        (<form onSubmit={verifyPassword}>
                            <input type="text" name='code' placeholder='1234567892' onChange={handleChange} className={s.input} value={code} />
                            <input type="text" name="newPassword" placeholder='O#1234' onChange={handleChange} className={s.input} value={newPassword} />
                            <button className='button'>Змінити Пароль</button>
                        </form>)
                
                }
                  
                 </div>)}
            </div>
        </div>
    )
}

export default Login;
