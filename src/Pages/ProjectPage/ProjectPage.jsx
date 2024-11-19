import { useParams, Outlet, NavLink,  useNavigate  } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { useGetProjectByIdQuery, useGetProjectLowByIdQuery } from '../../redux/projectSlice/projectSlice';
import ForbiddenPage from '../ForbiddenPage/ForbiddenPage';
import s from "./ProjectPage.module.scss";


function ProjectPage() {
    const {id} = useParams();
    const navigate = useNavigate();   
    const { data: project} = useGetProjectByIdQuery(id);
    const { data: projectSmall} = useGetProjectLowByIdQuery(id);
   
    const[data, setData] = useState(project);
    const [dataLow, setDataLow] = useState(projectSmall);
    const [showForbidden, setShowForbidden] = useState(false);

    const navigateLow = () => navigate(`/project/${id}/low`);
    const navigateLarge = () =>  navigate(`/project/${id}`);
    const emptyLargeEstimates = !project?.estimates?.length;  
  
    useEffect(() => {
        setData(project);
        if(projectSmall) {
            setDataLow(projectSmall) 
        } 
   
        if (emptyLargeEstimates) {
            navigateLow();
        } 
        else{
            navigateLarge();
        }

        if (!data) {
            const timer = setTimeout(() => {
              setShowForbidden(true);
            }, 1500); 
      
            return () => clearTimeout(timer); 
          }
        
          }, [project, dataLow, showForbidden, data]);

    return(
        <div className={s.container}>
            {data ? (
                <>
            <div>
            <div>
                <p className={s.title}>Назва кошторису: <span>{data?.title}</span></p>
                <p className={s.description}>Адреса об'єкту: <span>{data?.description}</span></p>
            </div>
            <ul className={s.linkContainer }>
                
                {data?.estimates && (
                 <li>
                    <NavLink className={({ isActive }) => isActive ? `${s.link} ${s['link-min']}` : s.link} end   to={`/project/${id}`}>Кошторис</NavLink>
                </li>   
                )}
                {data?.estimates && (
                 <li>
                    <NavLink className={({ isActive }) => isActive ? `${s.link} ${s['link-min']}` : s.link} to={`/project/${id}/price`}>Прайс</NavLink>
                </li>    
                )}
               
                {dataLow?.lowEstimates.length !== 0 && dataLow?.lowEstimates  && (
                <li>
                    <NavLink className={({ isActive }) => isActive ? `${s.link} ${s['link-min']}` : s.link} to={`/project/${id}/low`}>{!project?.estimates?.length ? "Кошторис" : "Знижений кошторис"}</NavLink>
                </li>
                )} 
                   
                {data?.estimates && (
                 <li>
                    <NavLink className={({ isActive }) => isActive ? `${s.link} ${s['link-min']}` : s.link} to={`/project/${id}/materials`}>Матеріали</NavLink>
                </li>    
                )}
               {data?.estimates && (
                <li>
                    <NavLink className={({ isActive }) => isActive ? `${s.link} ${s['link-min']}` : s.link} to={`/project/${id}/advances`}>Аванс</NavLink>
                </li>
               )}
                
            </ul>
           </div>

            <Outlet />
            </>
            ) : 
            (<div>{showForbidden && (<ForbiddenPage />)}</div>)}
            
          
        </div>
    )
}
export default ProjectPage;


