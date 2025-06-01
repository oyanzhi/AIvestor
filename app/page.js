import "../styles/pagecss/landingpage.css";
import LogInsideBar from "../components/sidebar/loginsidebar.js";
import { CenterLoginButton } from "../components/buttons.js";
import IntroductionVideo from "../components/media/video.js";

function LandingPage() {
    return (
        <div>
            <div><LogInsideBar/></div>

            <section id="introsection">
                <div className="lefttext-container">
                    <div id="lefttext">
                        <h1 id="welcome">AI-Powered Investment Intelligence</h1>
                        <p id="description">
                            Smart portfolio guidance tailored to your risk profile. Harness the power of machine learning for smarter investments.
                        </p>
                    </div>
        
                    <div><CenterLoginButton/></div>
                </div>

                <div className="rightpicture-container">
                    <IntroductionVideo/>
                </div>
            </section>
            
        </div>
    );
}

export default LandingPage;