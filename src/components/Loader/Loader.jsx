import React from 'react';
import logo from "../../img/logo.png"
import s from './Loader.module.scss';


function Loader() {
  return (
    
    <div className={s.loader}>
      <img className={s.logo} src={logo} alt="" />  
    </div>

  );
}

export default Loader;
