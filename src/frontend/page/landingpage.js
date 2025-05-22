import "../pagecss/common.css";
import "../pagecss/landingpage.css";
import "../componentscss/buttoncontainercss/navigationbuttons.css";
import LogInsideBar from "../sidebar/loginsidebar.js";
import { CenterLoginButton } from "../components/buttons.js";
import IntroductionVideo from "../components/video.js";

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