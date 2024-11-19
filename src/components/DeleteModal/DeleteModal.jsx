import { useParams  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDeletePriceMutation} from "../../redux/price/priceApi";
import { useDeleteProjectMutation } from '../../redux/projectSlice/projectSlice';
import {useDeletePositionMutation} from '../../redux/position/positionApi';
import {useDeleteEstimateMutation} from '../../redux/estimate/estimateApi';
import {useDeleteProjectPriceMutation} from '../../redux/projectPrice/projectPriceApi';
import {useDeleteMaterialMutation} from "../../redux/material/materialApi";
import { useDeleteAdvanceMutation} from '../../redux/advances/advancesApi';
import {projectsApi} from "../../redux/projectSlice/projectSlice";
import s from "./DeleteModal.module.scss";

function DeleteModal({data, nameComponent, onModal}) {
    const {id} = useParams();
    const dispatch = useDispatch();
    
    const [deletePrice] = useDeletePriceMutation();
    const [deleteProject] = useDeleteProjectMutation();
    const [deleteEstimate] = useDeleteEstimateMutation();
    const [deletePosition] = useDeletePositionMutation();
    const [deleteProjectPrice] = useDeleteProjectPriceMutation();
    const [deleteMaterial] = useDeleteMaterialMutation();
    const [deleteAdvance] = useDeleteAdvanceMutation();

    const deleteFunction = async () => {
        // Загальний прайс

        if(nameComponent === "price") {
             await deletePrice(data._id);
            try {
             toast(`"${data.title}" успішно видалена!`);   
            } catch (error) {
                toast.error(`Сталась помилка, вид роботи не видалено!`, error);
              }
            
            onModal();
            return;
        }
      

        //прайс кошторису
        if(nameComponent === "deleteProjectPrice") {
            const deleteProjectPriceData = { idPro: id, idPrice: data.id}; 

            try {
                const deletePriceProject = await deleteProjectPrice(deleteProjectPriceData);
                
                if (deletePriceProject && deletePriceProject.data) {
                 toast(deletePriceProject.data.message);
               
                 dispatch(projectsApi.util.resetApiState());
             
                 } else {
                      console.error('Unexpected response:', deletePriceProject.error.data.message);
                      toast.error(deletePriceProject.error.data.message);
                     
                      }
                      } catch (error) {          
                      console.error('Error delete price:', error);
                      
                  }  
            onModal();
            return;
        }
       // видалення кошторису

        if(nameComponent === "projects") {
                 
        
        
        try {
            const projectDelete = await deleteProject(data?._id);
            
            if (projectDelete && projectDelete.data) {
                toast(`"${data.title}" успішно видалена!`);
           
             dispatch(projectsApi.util.resetApiState());
         
             } else {
                  console.error('Unexpected response:', projectDelete.error.data.message);
                  toast.error(projectDelete.error.data.message);
                 
                  }
                  } catch (error) {          
                  console.error('Error delete project:', error);  
              } 

            onModal();
            return; 
        }

        //Видалення таблиць і рядків

        if(nameComponent === "deleteEstimate") {
            
            const deleteEstimateData = {idPro: id, idEst: data.id}

            try {
                const estimateDelete = await deleteEstimate(deleteEstimateData);
                
                if (estimateDelete && estimateDelete.data) {
                    toast(`"${data.title}" успішно видалена!`);
               
                 dispatch(projectsApi.util.resetApiState());
             
                 } else {
                      console.error('Unexpected response:', estimateDelete.error.data.message);
                      toast.error(estimateDelete.error.data.message);
                     
                      }
                      } catch (error) {          
                      console.error('Error delete project:', error);  
                  } 
            onModal();
            return;
        }

        if(nameComponent === "deletePosition") {

            const deletePositionData = {idPro: id, idEst: data.estimateId, idPos: data.positionId}
            

            try {
                const positionDelete = await deletePosition(deletePositionData);
                
                if (positionDelete && positionDelete.data) {
                    toast(`"${data.title}" успішно видалена!`);
               
                 dispatch(projectsApi.util.resetApiState());
             
                 } else {
                      console.error('Unexpected response:', positionDelete.error.data.message);
                      toast.error(positionDelete.error.data.message);
                     
                      }
                      } catch (error) {          
                      console.error('Error delete project:', error);  
                  } 

            onModal();
            return;
        }
        // видалення матеріалів
        if(nameComponent === "deleteMaterial") {
            
            const deleteMaterialData = {idPro: id, idMat: data.id};
            
            try {
                const materialDelete = await deleteMaterial(deleteMaterialData);
                
                if (materialDelete && materialDelete.data) {
                    toast(`"${data.title}" успішно видалена!`);
               
                 dispatch(projectsApi.util.resetApiState());
             
                 } else {
                      console.error('Unexpected response:', materialDelete.error.data.message);
                      toast.error(materialDelete.error.data.message);
                     
                      }
                      } catch (error) {          
                      console.error('Error delete project:', error);  
                  } 

            onModal();
            return; 
        }

        // видалення авансу

        if(nameComponent === "deleteAdvance") {
            
            const deleteAdvanceData = {idPro: id, idAdv: data.id};
           
            try {
                const advanceDelete = await deleteAdvance(deleteAdvanceData);
                
                if (advanceDelete && advanceDelete.data) {
                    toast(`"${data.comment}" успішно видалена!`);
               
                 dispatch(projectsApi.util.resetApiState());
             
                 } else {
                      console.error('Unexpected response:', advanceDelete.error.data.message);
                      toast.error(advanceDelete.error.data.message);
                     
                      }
                      } catch (error) {          
                      console.error('Error delete project:', error);  
                  }

            onModal();
            return; 
        }
    }

    return (
    
          <div className={s.container}>
          
          {data.title && ( <h4>Ви бажаєте видалити "{data.title}"?</h4>)}
          {data.comment && (<h4>Ви бажаєте видалити "{data.comment}"?</h4>)}
              

            <div className={s.buttonsContainer}>
                <button onClick={deleteFunction} className={s.buttonDelete}>Так</button>
                <button onClick={onModal} className={s.button}>Ні</button>
            </div>             
           
          </div>
    //   
    )
}

export default DeleteModal;
