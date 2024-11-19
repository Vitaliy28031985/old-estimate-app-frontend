import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "../Modal/Modal";
import AddMaterial from "../AddModals/AddMaterial/AddMaterial";
import {projectsApi} from "../../redux/projectSlice/projectSlice";
import { useGetProjectByIdQuery } from '../../redux/projectSlice/projectSlice';
import {useCurrentQuery} from "../../redux/auth/authApi";
import {useUpdateMaterialMutation} from "../../redux/material/materialApi";
import DeleteModal from "../DeleteModal/DeleteModal";
import Add from "../Icons/Add/Add";
import Delete from "../Icons/Delete/Delete";
import Update from "../Icons/Update/UpdateIcon";
import UpdateOk from "../Icons/UpdateOk/UpdateOk";
import s from "./MaterialItem.module.scss";


function MaterialItem() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: project} = useGetProjectByIdQuery(id);
  const { data: userData } = useCurrentQuery();
  const [mutate] = useUpdateMaterialMutation();
  const [data, setData] = useState(project);
  const [currentData, setCurrentData] = useState({});
  const [userRole, setUserRole] = useState(false);
  const [operations, setOperations] = useState('');
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

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
    setData((prevData) => {
      const newData = { ...prevData };
      const newMaterials = newData.materials.map((material) => {
        if (material.id === id) {
          if (name === "update") {
            return { ...material, isShow: currentIsShow };
          }
          if (name === "delete") {
            return { ...material, isDelete: currentIsShow };
          }
        }
        return material;
      });
      newData.materials = newMaterials;
      return newData;
    });
  };

  const onChange = (e) => {
    const { name, value, id } = e.currentTarget;
    setData((prevData) => {
      const newData = { ...prevData };
      const newMaterials = newData.materials.map((material) => {
        if (material.id === id) {
          switch (name) {
            case name:
              return { ...material, [name]: value };
            default:
              return material;
          }
        }
        return material;
      });
      newData.materials = newMaterials;
      return newData;
    });
  };

  const handleSubmit = async (projId, matId, updateMaterial) => {
     const update = await mutate([projId, matId, updateMaterial]);
     if(update && update.data) { 
      toast(`Чек на матеріал: ${update.data.title} оновлено!`);
      dispatch(projectsApi.util.resetApiState());
      }  else {
      console.error('Unexpected response:', update.error.data.message);
      toast.error(update.error.data.message);
     
        }
       try {
      } catch (error) {          
      console.error('Error delete project:', error);  
      } 
  };

  return (
    <div>
      <div className={s.buttonsContainer}>
        <h3 className={s.title}>Матеріали</h3>
        {userRole && (
        <button onClick={() => handleToggle("add")}>
          <Add width={"24"} height={"24"} />
        </button>
        )} 
      </div>
      <table className={s.iksweb}>
        <tbody>
          <tr className={s.titleRow}>
            <td className={s.oneRow}>№ з/п.</td>
            <td className={s.twoRow}>Назва</td>
            <td className={s.threeRow}>№ рахунку</td>
            <td className={s.threeRow}>Дата</td>
            <td className={s.threeRow}>Сума в грн.</td>
          </tr>

          {data?.materials &&
            data?.materials.map(
              (
                {
                  id,
                  title,
                  order,
                  date,
                  sum,
                  isShow = false,
                  isDelete = false,
                },
                index
              ) => (
                <tr key={id} className={s.dataRow}>
                  <td className={s.oneRow}>
                    {index + 1}
                    {userRole && (
                    <button
                      className={s.buttonUpdate}
                      onClick={() => {
                        isShow = !isShow;
                        addIsToggle(id, isShow, "update");
                        if (!isShow) {
                          handleSubmit(data?._id, id, {
                            title,
                            order,
                            date,
                            sum,
                          });
                        }
                      }}
                    >
                      {isShow ? (
                        <UpdateOk width="22" height="22" />
                      ) : (
                        <Update width="22" height="22" />
                      )}
                    </button>
                    )}
                  </td>
                  <td className={s.twoRow}>
                    {!isShow ? (
                      <p>{title}</p>
                    ) : (
                      <input
                        id={id}
                        name="title"
                        className={s.inputTitle}
                        value={title}
                        disabled={!isShow}
                        onChange={onChange}
                      />
                    )}
                  </td>
                  <td className={s.threeRow}>
                    {!isShow ? (
                      <p>{order}</p>
                    ) : (
                      <input
                        id={id}
                        name="order"
                        className={s.input}
                        value={order}
                        disabled={!isShow}
                        onChange={onChange}
                      />
                    )}
                  </td>
                  <td className={s.threeRow}>
                    {!isShow ? (
                      <p>{date}</p>
                    ) : (
                      <input
                        id={id}
                        name="date"
                        className={s.input}
                        value={date}
                        disabled={!isShow}
                        onChange={onChange}
                      />
                    )}
                  </td>
                  <td className={s.fiveRow}>
                    {!isShow ? (
                      <p>{sum}</p>
                    ) : (
                      <input
                        id={id}
                        name="sum"
                        className={s.input}
                        value={sum}
                        disabled={!isShow}
                        onChange={onChange}
                      />
                    )}
                    {userRole &&  (

                    <button
                      type="button"
                      className={s.buttonDelete}
                      onClick={() => {
                        handleToggle("delete");
                        setCurrentData({id, title})
                      }}
                    >
                      <Delete width={"24"} height={"24"} />
                    </button>
                    )}
                  </td>
                </tr>
              )
            )}

          <tr className="title-row">
            <td colSpan="4">Всього:</td>
            <td className={s.threeSix}>{data?.materialsTotal}</td>
          </tr>
        </tbody>
      </table>
      {isDelete && (<DeleteModal data={currentData} nameComponent={"deleteMaterial"} onModal={handleToggle}/>)}
      {isShowAdd && (<Modal onModal={handleToggle}><AddMaterial onModal={handleToggle}/></Modal>)}

    </div>
  );
}

export default MaterialItem;
