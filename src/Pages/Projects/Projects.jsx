import ProjectsComponent from "../../components/Projects/Projects";
import s from "./Projects.module.scss";

function Projects() {
    return (
        <div className={s.container}>
           <ProjectsComponent/>
        </div>
    )
}

export default Projects;