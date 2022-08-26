import {useEffect, useState} from "react";
import { dbService } from "fbase";
import { Link } from "react-router-dom";
import ImgUpload from "components/ImgUpload";

const Home = ({userObj}) => {
	const [newProjects, setNewProjects] = useState([]);

	useEffect(() => {
		dbService
			.collection("projects")
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				const newArray = snapshot.docs.map((document) => ({
					id: document.id,
					...document.data()
				}));
			setNewProjects(newArray);
		});
	}, []);
	

	return (
		<div>
			<div>
				<ImgUpload userObj={userObj}/>
				<div style={{ marginTop: 30 }}>
					{newProjects.map((newProject) => (
						<Link to={`/project_items/${newProject.projectId}`}>
							<div className="project_container">
								<h1>{newProject.title}</h1>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;