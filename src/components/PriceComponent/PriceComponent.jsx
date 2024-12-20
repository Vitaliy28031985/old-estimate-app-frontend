import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {useGetPriceQuery, useUpdatePriceMutation, useMiddleGetPriceQuery} from "../../redux/price/priceApi";

import AddPrice from '../AddModals/AddPrice/AddPrice';
import Modal from '../Modal/Modal';
import Add from "../Icons/Add/Add";
import Update from "../Icons/Update/UpdateIcon";
import UpdateOk from "../Icons/UpdateOk/UpdateOk";
import Delete from "../Icons/Delete/Delete";
import DeleteModal from "../DeleteModal/DeleteModal";
import s from "./PriceComponent.module.scss";


function PriceComponent() {
    const { data: price } = useGetPriceQuery();
    const { data: middlePrices } = useMiddleGetPriceQuery();
    const[mutate] = useUpdatePriceMutation();
    const [data, setData] = useState(price);
    const [currentData, setCurrentData] = useState({});
    const [operations, setOperations] = useState('');
    const [filter, setFilter] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [changePrices, setChangePrices] = useState(true);

    useEffect(() => {
        setData(price); 
    }, [price]); 
    
  
    
    const filterChange = e => setFilter(e.target.value);

    const normalizeFilter = filter.toLowerCase();

    const filteredContacts =  data?.filter(item =>
    item.title.toLowerCase().includes(normalizeFilter)) ?? [];

    const handleToggle = (operation) => {
        if(operation === "price" || operations === "price") {
            setShowModal(toggle => !toggle); 
            setOperations(operation);
           return;
        }
        if(operation === "delete" || operations === "delete") {
            setDeleteModal(toggle => !toggle); 
            setOperations(operation);
           return;
        }
        if (operation === "change" || operations === "change") {
            setChangePrices(toggle => !toggle); 
            setOperations(operation);
        }
        
    }
    

    const addIsToggle = (id, currentIsShow, name) => {
        setData(prevData => {
            const newData = prevData.map(price => {
                if (price.id === id) {
                    if(name === 'update') {
                        return { ...price, isShow: currentIsShow };
                    }
                    if(name === 'delete') {
                        return { ...price, isDelete: currentIsShow };
                    }
                }
                return price; 
            });
        
            return newData; 
        });
    };
    
    const onChange = (e) => {
        const { name, value, id } = e.currentTarget;
        setData(prevData => {
            const newData = prevData.map(price => {
                if (price.id === id) {
                    switch (name) {
                        case name:
                            return  {...price, [name]: value};
                        default:
                          return price;
                      }
                }
                return price; 
            });
        
            return newData; 
        });
    }
    


// const currentData = (item) => { 
//     console.log(item);
// return item;
// };

// console.log(currentData)

    return(
        <div>
              <div className={s.inputContainer}>
                    <input type="text" maxLength="20" name="title" id="title"
                    onChange={filterChange} value={filter}  
                    placeholder="Введіть сюди що Ви шукаєте" />
            </div>

            <div className={s.navButtons}>
                <button onClick={() => handleToggle("change")}>Прайс користувача</button>
                <button onClick={() => handleToggle("change")}>Прайс середніх цін</button>
            </div>

            <div className={s.titleContainer}>
                {changePrices ? (<> <h3>Прайс робіт</h3>
                <button onClick={() => handleToggle("price")} className={s.buttonAdd}><Add width={"27"} height={"27"}/></button>
                </>) : (<h3>Прайс робіт<br/>(середні ціни)</h3>)}
           
            
            </div> 
            {changePrices ? (
             <div>  
         <table className={s.iksweb}>
	<tbody>
		<tr className={s.tableMin}>
			<td className={s.rowOne}> <p>Найменування робіт</p>
            
            </td>
			<td className={s.twoRow}>Ціна за одиницю в грн.</td>
		</tr>
        {data && filteredContacts?.map(({id, _id, title, price, isShow = false, isDelete = false}) => (
           
        <tr key={_id}>
             
			<td className={s.rowOne} >
                
                   <button  
                  className={s.buttonUpdate}
                  onClick={async () => {
                    isShow = !isShow;
                    addIsToggle(id, isShow, 'update');
                    if(!isShow) {
                      const update =  await mutate({id: id, newData: {title, price: Number(price)}});
                      if(update && update.data) { 
                        toast(`Позицію парайсу: ${update.data.title} оновлено!`);
                     }  else {
                        console.error('Unexpected response:', update.error.data.message);
                        toast.error(update.error.data.message);
                       
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
                  {!isShow ? 
                  (<p className={s.inputTitle}>{title}</p>) :
                  (<input id={id} name='title' className={s.inputTitle} value={title} disabled={!isShow} onChange={onChange} />)
                  }
                </td>
			<td className={s.twoRow}> 
            {!isShow ? 
            (<p className={s.inputPrice}>{price}</p>) :
            (<input id={id} name='price' className={s.inputPrice} value={price} disabled={!isShow} onChange={onChange} />) 
            }
               <button className={s.buttonDelete} onClick={() => {
                isDelete = !isDelete;
                addIsToggle(id, isDelete, 'delete');
                setCurrentData({id, title}); 
                handleToggle("delete");
            }}>
                <Delete width={"24"} height={"24"}/>
                
                </button>                 
            </td>
          
		</tr>    
        ))}
		
	</tbody>
         </table>
        </div>
            ) : (
                     <div> 
         <table className={s.iksweb}>
	<tbody>
		<tr className={s.tableMin}>
			<td className={s.rowOne}> <p>Найменування робіт</p>
            
            </td>
			<td className={s.twoRow}>Ціна за одиницю в грн.</td>
		</tr>
        {middlePrices && middlePrices?.map(({id, _id, title, price, isShow = false, isDelete = false}) => (
           
        <tr key={_id}>
             
			<td className={s.rowOne} > <p className={s.inputTitle}>{title}</p></td>
			<td className={s.twoRow}> <p className={s.inputPrice}>{price}</p></td>
          
		</tr>    
        ))}
		
	</tbody>
         </table>
        </div>
            )}
        {/* <div>  
         <table className={s.iksweb}>
	<tbody>
		<tr className={s.tableMin}>
			<td className={s.rowOne}> <p>Найменування робіт</p>
            
            </td>
			<td className={s.twoRow}>Ціна за одиницю в грн.</td>
		</tr>
        {data && filteredContacts?.map(({id, _id, title, price, isShow = false, isDelete = false}) => (
           
        <tr key={_id}>
             
			<td className={s.rowOne} >
                
                   <button  
                  className={s.buttonUpdate}
                  onClick={async () => {
                    isShow = !isShow;
                    addIsToggle(id, isShow, 'update');
                    if(!isShow) {
                      const update =  await mutate({id: id, newData: {title, price: Number(price)}});
                      if(update && update.data) { 
                        toast(`Позицію парайсу: ${update.data.title} оновлено!`);
                     }  else {
                        console.error('Unexpected response:', update.error.data.message);
                        toast.error(update.error.data.message);
                       
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
                  {!isShow ? 
                  (<p className={s.inputTitle}>{title}</p>) :
                  (<input id={id} name='title' className={s.inputTitle} value={title} disabled={!isShow} onChange={onChange} />)
                  }
                </td>
			<td className={s.twoRow}> 
            {!isShow ? 
            (<p className={s.inputPrice}>{price}</p>) :
            (<input id={id} name='price' className={s.inputPrice} value={price} disabled={!isShow} onChange={onChange} />) 
            }
               <button className={s.buttonDelete} onClick={() => {
                isDelete = !isDelete;
                addIsToggle(id, isDelete, 'delete');
                setCurrentData({id, title}); 
                handleToggle("delete");
            }}>
                <Delete width={"24"} height={"24"}/>
                
                </button>                 
            </td>
          
		</tr>    
        ))}
		
	</tbody>
         </table>
        </div> */}
{deleteModal && (<DeleteModal data={currentData} nameComponent={"price"} onModal={handleToggle}/>)}
{showModal && (<Modal onModal={handleToggle}><AddPrice onModal={handleToggle}/></Modal>)}


        </div>
    )
}

export default PriceComponent;


