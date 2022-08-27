import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { dbService } from "../firebase";

const Home = () => {
	const [newProjects, setNewProjects] = useState([]);

	useEffect(() => {
		dbService
			.collection("adforms")
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
				<div style={{ marginTop: 30 }}>
					{newProjects.map((newProject) => (
						<Link to="/project_items" state={{data: newProject.projectId}}>
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