import { useNavigate } from "react-router-dom";

function AllRoutings() {
    const navigate = useNavigate();
    return {
        Landing: () => navigate("/"),
        Login: () => navigate("/loginpage"),
        Register: () => navigate("/registerpage"),
        ProfileSetUp: () => navigate("/profilesetup")
    }
}

export default AllRoutings;