import { useParams  } from 'react-router-dom';
import { useGetProjectByIdQuery } from '../../redux/projectSlice/projectSlice';
import AddAllow from "./AddAllow/AddAllow";
import UpdateAllow from "./UpdateAllow/UpdateAllow";
import DeleteAllow from "./DeleteAllow/DeleteAllow";
import AddDiscount from "./AddDiscount/AddDiscount";
import AddLowEstimate from "./AddLowEstimate/AddLowEstimate";
import s from "./Settings.module.scss";
function Settings() {
    const {id} = useParams();
    const { data } = useGetProjectByIdQuery(id);
    return (
        <div className={s.container}>
            <div>
                <h3>Назва об'єкту: <span>{data?.title}</span></h3>
                <p>Адреса об'єкту: <span>{data?.description}</span></p>
            <div className={s.allowContainer}>
            <AddAllow/>  
            <UpdateAllow/>  
             <DeleteAllow/> 
              <AddLowEstimate/>
              <AddDiscount/> 
            </div>
            
            </div>
        </div>
    )
}
export default Settings;