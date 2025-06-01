import "../../styles/componentcss/mediacss/introductionvideo.css"

function IntroductionVideo() {
    return (
        //should be in public folder for public assets
        //maybe can look into react's video module
        <video id="introvid" controls>
            <source src="/sourcefiles/introductionvideo.mp4" type="video/mp4"></source> 
        </video> 
    )
}

export default IntroductionVideo;