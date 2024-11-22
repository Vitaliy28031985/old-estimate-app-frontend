import { useParams  } from 'react-router-dom';
import { useState, useEffect} from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import s from "./LowProjectItem.module.scss";
import Add from "../Icons/Add/Add"
import Update from "../Icons/Update/UpdateIcon";
import UpdateOk from "../Icons/UpdateOk/UpdateOk";
import Delete from "../Icons/Delete/Delete";
import { useGetProjectByIdQuery } from '../../redux/projectSlice/projectSlice';
import {projectsApi} from "../../redux/projectSlice/projectSlice";
import roundingNumberFn from "../../helpers/roundingNumberFn";
import Modal from "../Modal/Modal";
import AddLowEstimate from "../AddModals/AddLowEstimate/AddLowEstimate";
import AddLowPosition from "../AddModals/AddLowPosition/AddLowPosition";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useUpdateLowEstimateMutation } from "../../redux/lowEstimate/lowEstimateApi";
import { useCurrentQuery } from "../../redux/user/userApi";
import { useAddLowPositionMutation, useUpdateLowPositionMutation } from '../../redux/lowPosition/lowPositionApi';

function LowProjectItem() {
    const {id} = useParams();
    const dispatch = useDispatch();



    const { data: project} = useGetProjectByIdQuery(id);
    const { data: userData } = useCurrentQuery(); 
    const[data, setData] = useState(project);
    const[addLowPosition] = useAddLowPositionMutation();
    const[updateLowPosition] = useUpdateLowPositionMutation();
    const[updateLowEstimate] = useUpdateLowEstimateMutation();

    const [userRole, setUserRole] = useState(false);
    const [currentData, setCurrentData] = useState({});
    const [deleteEstimate, setDeleteEstimate] = useState(false);
    const [deletePosition, setDeletePosition] = useState(false);
    const [operations, setOperations] = useState('');
    const [showEstimateAdd, setShowEstimateAdd ] = useState(false);
    const [showPositionAdd, setShowPositionAdd] = useState(false);
    const [estId, setEstId] = useState('');
    const [isShowEstimate, setIsShowEstimate] = useState({});

    useEffect(() => {
      setData(project); 
      if (userData) {
          const role = userData?.role;
          const isUserRole = role !== "customer";
             setUserRole(isUserRole);
        }
        
    }, [project, userData, userRole]);

    
    const handleToggle = async (operation, data) => {
   
      if(operation === "estimate" || operations === "estimate") {
        setShowEstimateAdd(toggle => !toggle); 
          setOperations(operation);
         return;
      }
      if(operation === "position" || operations === "position") {
          setShowPositionAdd(toggle => !toggle); 
          setOperations(operation);
          
          if(data?.id) {
            await setEstId(data?.id)
        
          }
          
          if(data) {
            if(data.title !== undefined) {
              const newPosition = {idProj: id, idEst: estId, position: data}
              try {
              const add =  await addLowPosition(newPosition);
             
              if(add && add.data) { 
                toast(`Позицію ${data.title} успішно додано`)
                dispatch(projectsApi.util.resetApiState());
               
              } else {
                console.error('Unexpected response:', add.error.data.message);
                toast.error(add.error.data.message);
                }
         } catch (error) {
           toast.error(`User with the title: does not exist!`, error);
         }
         setOperations('');
           
          }  
         return;
      }   
  }
  if(operation === "deleteEstimate" || operations === "deleteEstimate") {
    setDeleteEstimate(toggle => !toggle); 
    setOperations(operation);
   return; 
  }
  if(operation === "deletePosition" || operations === "deletePosition") {
    setDeletePosition(toggle => !toggle); 
    setOperations(operation);
   return; 
  }
  }
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const generatePdf = () => {
      if (data) {
        const content = [
          { text: `Назва кошторису:          ${data?.title}`, fontSize: 25, bold: true },
          { text: `Адреса об'єкту:                                                 ${data?.description}`, fontSize: 14, margin: [0, 10, 0, 20] },
        ];
    
        data.estimates.forEach((estimate) => {
          content.push(
            { text: estimate?.title, fontSize: 20, bold: true, margin: [0, 30, 0, 10] },
            {
              table: {
                headerRows: 1,
                widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: '№ з/п.', style: 'tableHeader' },
                    { text: 'Назва', style: 'tableHeader' },
                    { text: 'Одиниця', style: 'tableHeader' },
                    { text: 'Кількість', style: 'tableHeader' },
                    { text: 'Ціна в грн.', style: 'tableHeader' },
                    { text: 'Сума в грн.', style: 'tableHeader' }
                  ],
                  ...(estimate?.positions?.map(
                    ({ title, unit, price, number, result }, index) => [
                      { text: index + 1, style: 'tableCell' },
                      { text: title || '', style: 'tableCell' },
                      { text: unit || '', style: 'tableCell' },
                      { text: number || '', style: 'tableCell' },
                      { text: price || '', style: 'tableCell' },
                      { text: result && roundingNumberFn(result), style: 'tableCell' }
                    ]
                  ) || []),
                  [{}, {}, {}, {}, { text: 'Всього:', style: 'tableTotal' }, { text:  estimate?.total && roundingNumberFn(estimate?.total), style: 'tableTotal' }]
                ],
              },
              layout: 'lightHorizontalLines',
              style: 'tableExample',
            }
          );
        });
    
        content.push({ text: `Загальна сума:                            ${data?.total && roundingNumberFn(data?.total)}`, fontSize: 30, marginTop: 30},)
        if(data?.discount) {
        content.push({ text: `Знижка:                                            ${data?.discount && roundingNumberFn(data?.discount)}`, fontSize: 30, marginTop: 30},)
        }
        content.push({ text: `Витрачено на матеріали:          ${data?.materialsTotal && roundingNumberFn(data?.materialsTotal)}`, fontSize: 30, marginTop: 30},)
        content.push({ text: `Аванс:                                             ${data?.advancesTotal && roundingNumberFn(data?.advancesTotal)}`, fontSize: 30, marginTop: 30},)
        content.push({ text: `До оплати:                                    ${data?.general && roundingNumberFn(data?.general)}`, fontSize: 30, marginTop: 30},)
    
        const styles = {
          tableExample: {
            margin: [0, 5, 0, 15],
            fontSize: 12,
            color: '#333',
          },
          tableHeader: {
            bold: true,
            fontSize: 14,
            color: 'white',
            fillColor: '#4CAF50', // Header background color
            alignment: 'center'
          },
          tableCell: {
            fontSize: 12,
            margin: [0, 5, 0, 5]
          },
          tableTotal: {
            bold: true,
            fontSize: 12,
            alignment: 'right'
          }
        };
    
        const pdfDoc = {
          content,
          styles
        };
    
        pdfMake.createPdf(pdfDoc).download(`${data?.title}.pdf`);
      }
    };
    

  const addIsToggle = (id, currentIsShow, name, type = 'position') => {
  console.log("position",  currentIsShow)
  setData(prevData => {
      const newData = { ...prevData };
      const newEstimates = newData.lowEstimates.map(estimate => {
          if (type === 'estimate' && estimate._id === id) {
              return { ...estimate, isShow: currentIsShow };
          }
          const newPositions = estimate.positions.map(position => {
            if (position.id === id) {
              if (name === 'update') {
                      return {  ...position, isShow: currentIsShow };
                  }
              if (name === 'delete') {
                
                      return {...position,  isDelete: currentIsShow };
                  }
              }
              return position;
          });
          return { ...estimate, positions: newPositions };
      });
      newData.lowEstimates = newEstimates;
      return newData;
  });
};

const onChange = (e) => {
  const { name, value, id } = e.currentTarget;
  setData(prevData => {
      const newData = { ...prevData };
      const newEstimates = newData?.lowEstimates.map(estimate => {
          if (estimate.id === id && name === 'title') {
              return { ...estimate, title: value };
          }
          const newPositions = estimate.positions.map(position => {
              if (position._id === id) {
                  return { ...position, [name]: value };
              }
              return position;
          });
          return { ...estimate, positions: newPositions };
      });
      newData.lowEstimates = newEstimates;
      return newData;
  });
};



    
    return (
        <>
    
        <div>

        <div className={s.buttonAddContainer}>
        <button className={s.createPdfFileButton} 
        onClick={generatePdf}
        >Створити PDF файл</button>
       {userRole && (
         <button type='button' 
         className={s.createPdfFileButton} 
         onClick={() => handleToggle("estimate")}
         >Додати таблицю</button>
      )}
       
       </div>

       
        {data && (
          <>
        
            {data.lowEstimates && data?.lowEstimates?.map((item, index) => (
              <div key={item.id}>
                <div className={s.buttonAddContainer}>
                {isShowEstimate[item.id] ? (
                          
                 <input
                  type="text"
                  name="title"
                  value={item.title}
                  id={item.id}
                  onChange={onChange}
                  className={s.titleInputTablet}
                  />) : (
                  <p className={s.titleTable}>{item.title}</p>
                )}
                {userRole && (
                    <>
                 <button type='button' 
                 className={s.buttonAddTitle }
                 onClick={ async () => {
                  handleToggle("deleteEstimate");
                  await setCurrentData({id: item?.id, title: item?.title});
                }}
                 >
                  <Delete width={"24"} height={"24"}/>
                  </button>
                  {!isShowEstimate[item.id] ? (
                  <button className={s.buttonUpdateEstimate}
                  id={item._id}
                  onClick={() => {
                    setIsShowEstimate(prevState => ({ ...prevState, [item.id]: true }))
                    console.log(item.title)
                   
                }}
                  >
                    <Update width='28' height='28'/>
                      </button>) : (
                  <button className={s.buttonUpdateEstimate}
                  id={item._id}
                  onClick={async() => {
                    const update = await updateLowEstimate([data?._id, item?.id, {title: item?.title}]);
                    if(update && update.data) { 
                      // toast(`Таблицю кошторису: ${item?.title} оновлено!`);
                       dispatch(projectsApi.util.resetApiState()); 
                       setIsShowEstimate(prevState => ({ ...prevState, [item.id]: false }))
                       }  else {
                        // console.error('Unexpected response:', update.error.data.message);
                        // toast.error(update.error.data.message);
                       
                        }
                      try {
                      } catch (error) {          
                        console.error('Error delete project:', error);  
                    }                   
                }}
                  >
                    <UpdateOk width='28' height='28'/>
                      </button>)}

                </>
             )}
                
                
                </div>     
                
                <table className={s.iksweb}>
                  <tbody>
                  <tr className={s.titleRow}>
             <td className={s.oneRow}>№ з/п.</td>
                   <td className={s.twoRow}>Назва 
                   {userRole && (
                   <button type='button' 
                    onClick={() => handleToggle('position', {id: item?.id})}
                    className={s.buttonAdd}>
                   <Add width={"20"} height={"20"}/>
                  </button> 
                  )}
                   </td>
                   <td className={s.threeRow}><p className={s.threeRowTitleText}>Одиниця</p></td>
                   <td className={s.threeRow}><p className={s.threeRowTitleText}>Кількість</p></td>
                   <td className={s.threeRow}><p className={s.threeRowTitleText}>Ціна в грн.</p></td>
                   <td className={s.threeSix}>Сума в грн.</td>
               </tr>
    
                    {item.positions &&
                      item.positions.map(({ _id, id, title, unit, price, number, result, isShow = false, isDelete = false }, index) => (
                  <tr key={_id} className={s.dataRow}>
                  <td className={s.oneRow}>
                    {index + 1}
                    {userRole && (
                      <button  
                    className={s.buttonUpdate}
                    onClick={ async() => {
                      isShow = !isShow;
                      addIsToggle(id, isShow, 'update');
                      if (!isShow) {
                        console.log(isShow)
                        const update = await updateLowPosition([data._id, item.id, id, {title, unit, number, price: Number(price)}]);
                          dispatch(projectsApi.util.resetApiState());                       
                        if(update && update.data) { 
                          // toast(`Позицію кошторису: ${update.data.title} оновлено!`);
                           
                           }  else {
                            // console.error('Unexpected response:', update.error.data.message);
                            // toast.error(update.error.data.message);
                           
                            }
                          try {
                          } catch (error) {          
                            console.error('Error delete project:', error);  
                        } 
          
                      }
                      }}
                    >
                      {isShow ? (<UpdateOk width='22' height='22'/>) :
                      (<Update width='22' height='22'/>)
                      }
                    
                    </button> 
                    )}
                   
                    </td>
                  <td>
                  <p>{title}</p>
                  </td>                 
                  <td className={s.threeRow}>{!isShow ? 
                  (<p>{unit}</p>) : 
                  (
                  <input type='text' id={_id} name='unit'  className={s.input} value={unit} disabled={!isShow} 
                    onChange={onChange}
                    />
                  )
                  }</td>
                  <td className={s.threeRow}>
                  {!isShow ? 
                  (<p>{number}</p>) :
                  (<input type='number' id={_id} name='number' className={s.input} value={number} disabled={!isShow}
                   onChange={onChange}
                   />)}
                   </td>
                 
                  <td className={s.fiveRow}>
                      {!isShow ? 
                  (<p>{price}</p>) :
                  (<input type='number' id={_id} name='price' className={s.input} value={price} disabled={!isShow} 
                    onChange={onChange}
                    />)
                  }</td>
                  <td className={s.threeSix}>
                    {result && roundingNumberFn(result)}
                    {userRole && (
                     <button className={s.buttonDeletePosition} 
                    onClick={async () => {
                      isDelete = !isDelete;
                      handleToggle("deletePosition");
                      await setCurrentData({estimateId: item?.id, positionId: id, title})
                    }
                    }
                    >
                      <Delete width={"20"} height={"20"}/>
                    </button>  
    
                   )}
                                    
                    </td>
                        </tr>
                      ))}
    
                    <tr className={s.titleRow}>
                      <td colSpan='5'>Всього:</td>
                      <td className={s.threeSix}>{item.total && roundingNumberFn(item.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
    
        <div className={s.total}>
          <p>Загальна сума: </p>
          {data && <p>{data?.lowTotal && roundingNumberFn(data?.lowTotal)}</p>}
        </div>

        
          <div className={s.total}>
            <p>Витрачено на матеріали:</p>
            {data?.materialsTotal && (
          <p>{data?.materialsTotal && roundingNumberFn(data?.materialsTotal)}</p> )}
        </div> 
       
        
           <div className={s.total}>
            <p>Аванс:            </p>
            {data?.advancesTotal && (
          <p>{data?.advancesTotal && roundingNumberFn(data?.advancesTotal)}</p>)}
        </div>
        
        
         <div div className={s.totalGeneral}>
          <p>До оплати:</p>
          {data?.general && (
          <p>{data?.lowGeneral && roundingNumberFn(data?.lowGeneral)}</p>)}
        </div> 
        {deleteEstimate && (<DeleteModal data={currentData} nameComponent={"deleteLowEstimate"} onModal={handleToggle}/>)}
        {deletePosition && (<DeleteModal data={currentData} nameComponent={"deleteLowPosition"} onModal={handleToggle}/>)}
        {showEstimateAdd && (<Modal onModal={handleToggle}><AddLowEstimate onModal={handleToggle}/></Modal>)}
        {showPositionAdd && (<Modal onModal={handleToggle}><AddLowPosition onModal={handleToggle}/></Modal>)}
       
      </div>
     
    </>
        
      );
}
export default LowProjectItem;
