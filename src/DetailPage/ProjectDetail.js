import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt,faXmark,faCirclePlus,faPlus,faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import ProjectDetailShow from "./ProjectDetailShow";

const ProjectDetail = ({userObj}) => {
	const {id} = useParams();
	const nowProjectId = parseInt(id);

	// 프로젝트 정보
	const [itemDetail, setItemDetail] = useState({
		id: "",
		url: "",
		title: "",
		summary: "",
		member: [],
		hashtag: [],
		introduce: [],
	});

	const [projectOwner, setProjectOwner] = useState(false);
	const [detailEditing, setDetailEditing] = useState(false);

	const [newTitle, setNewTitle] = useState(itemDetail.title);

	const [newMemberName, setNewMemberName] = useState(null);
	const [newMember, setNewMember] = useState([...itemDetail.member]);

	const [newSummary, setNewSummary] = useState(itemDetail.summary);

	const [newHashtagName, setNewHashtagName] = useState(null);
	const [newHashtag, setNewHashtag] = useState([...itemDetail.hashtag]);

	// 추가
	const [newIntroduceTitle, setNewIntroduceTitle] = useState(null);
	const [newIntroduceText, setNewIntroduceText] = useState(null);
	const [newIntroduceObj, setNewIntroduceObj] = useState({introduceTitle: null, introduceText: null})

	// 수정
	const [newIntroduce, setNewIntroduce] = useState([...itemDetail.introduce]);


	useEffect(async () => {
		dbService
			.collection("projects")
			.where("projectId", "==", nowProjectId)
			.get()
			.then(function(querySnapshot) {
				const newArray = querySnapshot.docs.map((document) => ({
					id: document.id,
					...document.data()
				}));

				setItemDetail({
					id: newArray[0].id,
					url: newArray[0].attachmentUrl,
					title: newArray[0].title,
					summary: newArray[0].summary,
					member: newArray[0].member,
					hashtag: newArray[0].hashtag,
					introduce: newArray[0].introduce,
				});

				setNewTitle(newArray[0].title);
				setNewMember([...newArray[0].member]);
				setNewSummary(newArray[0].summary);
				setNewHashtag([...newArray[0].hashtag]);
				setNewIntroduce([...newArray[0].introduce]);
				
				if (newArray[0].creatorId == userObj.uid){
					setProjectOwner(true);
				}
				else{
					setProjectOwner(false);
				}
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
			});
	}, []);

	const onDeleteClick = async () => {
		const ok = window.confirm("삭제하시겠습니까?");

		if (ok){
			await dbService.doc(`projects/${itemDetail.id}`).delete();
			if (itemDetail.url !== ""){
				await storageService.refFromURL(itemDetail.url).delete();
			}
			window.location.replace("/");
		}
	};

	const toggleEditing = () => setDetailEditing((prev) => !prev);

	const onChange = (event) => {
		const {
			target: {value}
		} = event;

		switch (event.target.id){
			case "inputTitle":
				setNewTitle(value);
				break;

			case "inputMember":
				setNewMemberName(value);
				break;
			
			case "inputSummary":
				setNewSummary(value);
				break;

			case "inputHashtag":
				setNewHashtagName(value);
				break;
			
			case "inputIntroduceTitle":
				setNewIntroduceTitle(value);
				break;

			case "inputIntroduceText":
				setNewIntroduceText(value);
				break;
		}
	}

	const onAddMemberClick = () => {
		if (newMemberName !== ""){
			setNewMember([...newMember, newMemberName]);
			setNewMemberName("");
		}
	}

	const onAddHashtagClick = () => {
		if (newHashtagName !== ""){
			setNewHashtag([...newHashtag, newHashtagName]);
			setNewHashtagName("");
		}
	}

	const onSubmit = async (event) => {
		event.preventDefault();
		console.log(newMember);

		await dbService.doc(`projects/${itemDetail.id}`).update({
			title: newTitle,
			member: newMember,
			summary: newSummary,
			hashtag: newHashtag
		});

		setItemDetail({
			id: itemDetail.id,
			url: itemDetail.url,
			title: newTitle,
			summary: newSummary,
			member: newMember,
			hashtag: newHashtag,
			introduce: itemDetail.introduce
		});

		setDetailEditing(false);
		// window.location.reload();
	};

	return (
		<div>

			{detailEditing ? (

				<div className="detail_container">
					<form onSubmit={onSubmit}>

						{/* Img */}
						<div style={{paddingBottom:"40px"}}>
							<img src={`${itemDetail.url}`}/>
							<div>
								<span style={{ fontSize:"14px", paddingRight:"10px"}}>Edit photo</span>
								<FontAwesomeIcon icon={faPlus}/>
							</div>
						</div>
								
						{/* Title */}
						<div className="list_update">
							<span>제목</span>
							<input
								onChange={onChange}
								value={newTitle}
								required
								placeholder="Edit Title"
								autoFocus
								id="inputTitle"
							/>
						</div>

						{/* Member */}
						<div  className="list_update">

							<span>
								멤버
								<div className="input_member">
									<input 
										type="text" 
										placeholder="Name"
										maxLength="15" 
										onChange={onChange}
										id="inputMember"
									/>
									<FontAwesomeIcon 
										icon={faCirclePlus} 
										size="1x" 
										style={{paddingLeft:"10px"}}
										onClick={onAddMemberClick}
									/>
								</div>
							</span>

							{newMember.map((memberName) => (
								<div className="member">
									{memberName}
									<FontAwesomeIcon icon={faXmark} size="1x" style={{paddingLeft:"10px"}} />
								</div>
							))}
						</div>
						
						{/* Summary */}
						<div className="list_update">
							<span>한줄소개</span>
							<input
								onChange={onChange}
								value={newSummary}
								required
								placeholder="Edit Summary"
								autoFocus
								id="inputSummary"
							/>
						</div>
						
						{/* Hashtag */}
						<div className="list_update">
							<span>
								해시태그
								<div className="input_hashtag">
									<input 
										type="text" 
										placeholder="Hashtag"
										maxLength="15" 
										onChange={onChange}
										id="inputHashtag"
									/>
									<FontAwesomeIcon 
										icon={faCirclePlus} 
										size="1x" 
										style={{paddingLeft:"10px"}}
										onClick={onAddHashtagClick}
									/>
								</div>
							</span>
							{newHashtag.map((hashtag) => (
								<div className="hashtag">
									{hashtag} 
									<FontAwesomeIcon icon={faXmark} size="1x" style={{paddingLeft:"10px"}} />
								</div>
							))}
						</div>
						
						{/* Introduce */}
						{itemDetail.introduce.map((item) => (
							<div className="list_update">
								<span className="inputIntroduce">
									<FontAwesomeIcon icon={faCircleXmark} size="1x" style={{paddingLeft:"10px"}} />
									<input
										value={item.introduceTitle}
										required
										placeholder="Edit Introduce Title"
										autoFocus
										id="inputIntroduceTitle"
										onChange={onChange}
									/>
								</span>
								
								<input
									value={item.introduceText}
									required
									placeholder="Edit Introduce Text"
									autoFocus
									id="inputIntroduceText"
									onChange={onChange}
								/>
							</div>
						))}

						{/* update */}
						<input type="submit" value="Update Project" className="formBtn" />
					</form>

					{/* Cancel */}
					<div>
						<button onClick={toggleEditing} className="formBtn">Cancel</button>
					</div>
				</div >

			) : (
				<div className="detail_container">

					<ProjectDetailShow itemDetail={itemDetail} />
					{projectOwner && (
						<div style={{ paddingBottom:"20px"}}>
							<span onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} size="2x" style={{ padding:"10px"}}/>
							</span>
							<span onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} size="2x" style={{ padding:"10px"}}/>
							</span>
						</div>
					)}
				
				</div >
			)}
		</div>
	);
};

export default ProjectDetail;