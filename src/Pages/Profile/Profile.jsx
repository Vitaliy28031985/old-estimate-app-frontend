import ProfileComponent from "../../components/Profile/Profile";
import s from "./Profile.module.scss";

function Profile() {
    return (
        <div className={s.container}>
            <ProfileComponent/>
        </div>
    )
}

export default Profile;