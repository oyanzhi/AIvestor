import { useNavigate } from "react-router-dom";

function ToLandingPage() {
    const navigate = useNavigate();
    return () => navigate("/"); // Returns a lambda function for navigation
}

function ToLoginPage() {
    const navigate = useNavigate();
    return () => navigate("/loginpage"); // Returns a lambda function for navigation
}

function ToRegisterPage() {
    const navigate = useNavigate();
    return () => navigate("/registerpage"); // Returns a lambda function for navigation
}

function ToProfileSetupPage() {
    const navigate = useNavigate();
    return () => navigate("/profilesetuppage"); // Returns a lambda function for navigation
}

const Routings = { ToLandingPage, ToLoginPage, ToRegisterPage, ToProfileSetupPage };
export default Routings;