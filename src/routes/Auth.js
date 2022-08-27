import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { authService, firebaseInstance } from "fbase";

const Auth = ({userObj}) => {
	const onSocialClick = async (event) => {
		const {
			target : {name}
		} = event;
		let provider;

		if (name === "google"){
			provider = new firebaseInstance.auth.GoogleAuthProvider();
		}
		// const data = await authService.signInWithPopup(provider);
	}

	return(
		<div className="authContainer">
			<h1>Log In</h1>
			
			<div className="authBtns">
				<button onClick={onSocialClick} name="google" className="authBtn">
					Continue with Google <FontAwesomeIcon icon={faGoogle}/>
				</button>
			</div>

		</div>
	);
};

export default Auth;