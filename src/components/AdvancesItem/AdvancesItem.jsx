import { useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetProjectByIdQuery } from '../../redux/projectSlice/projectSlice';
import { useUpdateAdvanceMutation} from '../../redux/advances/advancesApi';
import {useCurrentQuery} from "../../redux/auth/authApi";
import {projectsApi} from "../../redux/projectSlice/projectSlice";
import AddAdvance from "../AddModals/AddAdvance/AddAdvance";
import Modal from '../Modal/Modal';
import DeleteModal from "../DeleteModal/DeleteModal";
import Add from '../Icons/Add/Add';
import Delete from '../Icons/Delete/Delete';
import Update from '../Icons/Update/UpdateIcon';
import UpdateOk from '../Icons/UpdateOk/UpdateOk';
import s from "./AdvancesItem.module.scss";


function AdvancesItem() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data: project} = useGetProjectByIdQuery(id);
    const { data: userData } = useCurrentQuery();
    const [mutate] = useUpdateAdvanceMutation(); 
    const [currentData, setCurrentData] = useState({});
    const [operations, setOperations] = useState('');
    
    const [data, setData] = useState(project);
   
   

    const [isShowAdd, setIsShowAdd] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [userRole, setUserRole] = useState(false);

    const handleToggle = (operation) => {
      if(operation === "add" || operations === "add") {
      setIsShowAdd((isShowAdd) => !isShowAdd);
      setOperations(operation);
      return;
      }
      if(operation === "delete" || operations === "delete") {
        setIsDelete((isDelete) => !isDelete);
        setOperations(operation);
        return;
      }
    };

  useEffect(() => {
    setData(project);
    if (userData) {
      const role = userData?.role;
      const isUserRole = role !== "customer";
         setUserRole(isUserRole);
    }   
}, [project, userData, userRole]); 

const addIsToggle = (id, currentIsShow, name) => {
  setData(prevData => {
    const newData = { ...prevData };
     const newAdvances = newData.advances.map(advance => {
      if(advance.id === id) {
        if(name === 'update') {
        return { ...advance, isShow: currentIsShow }; 
      }
      if(name === 'delete') {
        return { ...advance, isDelete: currentIsShow };
    }
      }
      return advance;
     })
     newData.advances = newAdvances;
     return newData;
  });
}

const onChange = (e) => {
  const { name, value, id } = e.currentTarget;
  setData(prevData => {
    const newData = { ...prevData };
     const newAdvances  = newData.advances.map(advance => {
      if(advance.id === id) {
        switch (name) {
          case name:
              return  {...advance, [name]: value};
          default:
            return advance;
        }
      }
      return advance;
     })
     newData.advances = newAdvances ;
     return newData;
  });
     };

     const handleSubmit = async (projId, advId, updateAdvance) => {
     
      const update = await mutate([projId, advId, updateAdvance]);
      if(update && update.data) { 
        toast(`Коментар: ${update.data.title} оновлено!`);
        dispatch(projectsApi.util.resetApiState());
        }  else {
        console.error('Unexpected response:', update.error.data.message);
        toast.error(update.error.data.message);
       
          }
         try {
        } catch (error) {          
        console.error('Error delete project:', error);  
        } 

     }

    return (
        <div>
            

      <div className={s.buttonsContainer}>
      <h3 className={s.title}>Аванс</h3>
      {userRole && (
            <button onClick={() => handleToggle("add")}><Add width={'24'} height={'24'}/></button>
      )}
  
      </div>
      <table className={s.iksweb}>
                <tbody>
                <tr className={s.titleRow}>
           <td className={s.oneRow}>№ з/п.</td>
                 <td className={s.threeRow}>Коментар</td>
                 <td className={s.threeRow}>Дата</td>
                 <td className={s.threeRow}>Сума в грн.</td>
             </tr>

                  {data?.advances &&
                    data?.advances.map(({id, comment, date, sum, isShow = false}, index) => (
                <tr key={id} className={s.dataRow}>
                <td className={s.oneRow}>
                  {index + 1}
                  {userRole && (
                    <button  
                  className={s.buttonUpdate}
                  onClick={() => {
                    isShow = !isShow;
                    addIsToggle(id, isShow, 'update');
                    if(!isShow) {
                       handleSubmit(data?._id, id, {comment, date, sum})
                    }
                    }}>
                    {isShow ? (<UpdateOk width='22' height='22'/>) :
                    (<Update width='22' height='22'/>)
                    }
                  
                  </button> 
                  )}
                    </td>
                       
                <td className={s.threeRow}>
                {!isShow ?
                (<p>{comment}</p>) :
                (<input id={id} name='comment'  className={s.input} value={comment} disabled={!isShow} onChange={onChange}/>) 
              }</td>
                <td className={s.threeRow}>
                {!isShow ?
                (<p>{date}</p>) :
                (<input id={id} name='date' className={s.input} value={date} disabled={!isShow} onChange={onChange}/>)
                }</td>
                <td className={s.fiveRow}>
                {!isShow ?
                (<p>{sum}</p>) :
                (<input id={id} name='sum' className={s.input} value={sum} disabled={!isShow} onChange={onChange}/>)  
              }  
                {userRole && (
                 <button type='button' className={s.buttonDelete}  onClick={() => 
                  {
                    handleToggle("delete");
                    setCurrentData({id, comment})
                }
                  }>
                <Delete width={"24"} height={"24"}/>
                </button> 
                )}

                </td>
                      </tr>
                    ))}

                  <tr className='title-row'>
                    <td colSpan='3'>Всього:</td>
                    <td className={s.threeSix}>{data?.advancesTotal}</td>
                  </tr>
                </tbody>
              </table>
              {isDelete && (<DeleteModal data={currentData} nameComponent={"deleteAdvance"} onModal={handleToggle}/>)}
              {isShowAdd && (<Modal onModal={handleToggle}><AddAdvance onModal={handleToggle }/></Modal>)}
        </div>
    )
}

export default AdvancesItem;