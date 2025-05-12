import "../pagecss/common.css";
import "../pagecss/profilesetuppage.css";
import "../componentscss/formcss/profilesetupform.css"
import MainSideBar from "../sidebar/mainsidebar.js";
import ProfileSetupForm from "../components/profilesetupform.js";

function ProfileSetupPage() {
    return (
        <div className="profilesetup-page">
            <div><MainSideBar noshow={["dashboard", "market", "settings"]} /></div>

            <div className="profile-container">
                <div className="profile-form">
                    <h1 id="profile-text">Setup Profile</h1>
                    <div><ProfileSetupForm /></div>
                </div>
            </div>
        </div>
    );
}

export default ProfileSetupPage;
