import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";
import ProjectDetail from "../DetailPage/ProjectDetail";

const AppRouter = ({isLoggedIn, userObj, refreshUser }) => {

	return (
		<Router>
			{isLoggedIn && <Navigation userObj={userObj} />}

			<Routes>	
				<Route exact path="/"
					element = {<Home userObj={userObj}/>}
				/>
				
				<Route path="/project_items/:id"
					element = {<ProjectDetail userObj={userObj}/>}
				/>
				
				<Route exact path="/profile"
					element = {<Profile refreshUser={refreshUser} userObj={userObj}/>}
				/>
				{/* {isLoggedIn ? (
					<>
						
					</>
					
				) : (
					<Route exact path="/"
						element = {<Auth userObj={userObj}/>}
					/>
				)} */}
			</Routes>
		</Router>
	)
}

export default AppRouter;