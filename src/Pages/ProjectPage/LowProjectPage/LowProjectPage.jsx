import LowProjectItem from "../../../components/LowProjectItem/LowProjectItem";
import s from  "./LowProjectPage.module.scss";

function LowProjectPage() {
    return(
        <div className={s.container}>
            <LowProjectItem/>
        </div>
    )
}

export default LowProjectPage;