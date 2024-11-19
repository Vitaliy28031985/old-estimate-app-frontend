import AdvancesItem from "../../../components/AdvancesItem/AdvancesItem";
import s from "./AdvancesPage.module.scss";


function AdvancesPage() {
    return(
        <div className={s.container}>
            <AdvancesItem/>
        </div>
    )
}

export default AdvancesPage;