import React, { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetProjectByIdQuery } from '../../../redux/projectSlice/projectSlice';
import {useAddProjectPriceMutation} from "../../../redux/projectPrice/projectPriceApi";
import {projectsApi} from "../../../redux/projectSlice/projectSlice";
import Mic from "../../Icons/Mic/Mic";
import s from "./AddProjectPrice.module.scss";

function AddProjectPrice({onModal}) {
    const {id} = useParams();
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const {data} = useGetProjectByIdQuery();
    const [ addProjectPrice] = useAddProjectPriceMutation();

    useEffect( () => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognitionInstance =  new SpeechRecognition();
          setRecognition(recognitionInstance);
                  
        } else {
          console.log('Розпізнавання мови не підтримується в цьому браузері.');
        }
      }, []);

     
      if (recognition) {
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
            
            const transcriptArr =  transcript.split('');
            for(let i = 0; i < transcriptArr.length; i++) {
                if(i === 0) 
                {
                    transcriptArr[i] = transcript.charAt(0).toUpperCase();  
                }
            }
            setTitle(transcriptArr.join(""))
         
        
        };
      }

      const startRecording = () => {
        if (recognition && !isRecording) {
            recognition.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (recognition && isRecording) {
            recognition.stop();
            setIsRecording(false);
        }
    };

    const handleStartRecordingClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };
    


    const handleChange = e => {
        const {name, value} = e.currentTarget;
        switch (name) {
           case 'title':
            setTitle(value);
             break;
            case 'price':
            setPrice(value);
            break;
               default:
               return;  
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (title === '' && price === '') {
            toast.error("Заповніть усі поля!");
            return;
        }

        if (data?.price.find(data => data.title === title)) {
            toast.error("Таке найменування роботи вже існує");
            setTitle('')
            setPrice('')
            return;
        }
    
        try {
            const newPrice = Number(price);
            const newPriceData = {id, newPrice: {title, price: newPrice}}
                const add = await addProjectPrice(newPriceData);
                
                if (add && add.data) {
                    dispatch(projectsApi.util.resetApiState());
                    toast(`Найменування роботи ${add.data.title} створено!`);                  
                    } else {
                         console.error('Unexpected response:', add.error.data.message);
                         toast.error(add.error.data.message);
                         }
                  } catch (error) {
                    toast.error(`User with the title: ${title} does not exist!`, error);
                  }

        setTitle('');
        setPrice('');
        onModal()
    }

 
    

    const disabled = title === '' || price === '';

    return (
        <div>
            <form className={s.container} onSubmit={handleSubmit}>
            <div className={s.inputContainer}>
                    <label  for="title">Найменування роботи</label>
                    <div className={s.titleInputContainer}>
                    <input type="text" name="title" id="title"  value={title} onChange={handleChange} 
                    placeholder="Введіть сюди назву роботи" />
                    <div className={s.titleButton} onClick={handleStartRecordingClick}><Mic width={"24px"} height={"24px"}/></div>
                    </div>
            </div>
            <div className={s.inputContainer}>
                    <label  for="price">Ціна роботи</label>
                    <input type="number" name="price" id="price"  value={price} onChange={handleChange} 
                    placeholder="Введіть сюди ціну роботи" />
                </div>
                <button disabled={disabled} className={disabled ? "button-disabled" : "button"} type="submit">Додати</button>
            </form>
        </div>
    )
}

export default AddProjectPrice;