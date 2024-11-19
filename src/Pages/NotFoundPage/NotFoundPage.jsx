import s from "./NotFoundPage.module.scss";

function NotFoundPage() {
    return(
        <div className={s.container}>
           <h1>Вибачте, не вдалось знайти дану сторінку, можливо її було перейменовано або видалено!</h1>
           <div className={s.logoContainer}><p className={s.numberOne}>4</p><div className={s.logo}></div><p className={s.numberTwo}>4</p></div>
        </div>
    )
}

export default NotFoundPage;