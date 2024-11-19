import ProjectItem from "../../../components/ProjectItem/ProjectItem";
import s from "./Project.module.scss";

function Project() {
    return(
        <div className={s.container}>
           <ProjectItem/>
        </div>
    )
}

export default Project;