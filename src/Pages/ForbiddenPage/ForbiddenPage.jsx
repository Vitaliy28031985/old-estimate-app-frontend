import s from "./ForbiddenPage.module.scss";

function ForbiddenPage() {
    return (
        <div className={s.container}>
            <div>
            <div className={s.titleContainer}>
                <h2 className={s.title}>Цей кошторис Вам не доступний</h2>
                <p>будь ласка, зверніться за доступом до власника кошторису!!!</p>
            </div>
            <div className={s.picture}></div>
            </div>
        </div>
    )}

    export default ForbiddenPage;