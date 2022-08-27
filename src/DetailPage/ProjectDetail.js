import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt,faXmark,faCirclePlus,faPlus,faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import ProjectDetailShow from "./ProjectDetailShow";
import { v4 as uuidv4 } from "uuid";

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
	const [nowIndex, setNowIndex] = useState(null);

	// 수정 프로젝트 정보
	const [newUrlBool, setNewUrlBool] = useState(false);
	const [newUrl, setNewUrl] = useState("");

	const [newTitle, setNewTitle] = useState(null);
	const [newMemberName, setNewMemberName] = useState(null);		
	const [newMember, setNewMember] = useState(null);		
	const [newSummary, setNewSummary] = useState(null);
	const [newHashtagName, setNewHashtagName] = useState(null);		
	const [newHashtag, setNewHashtag] = useState(null);	

	// const [newIntroduceIndex, setIntroduceIndex] = useState("");
	const [newIntroduceTitle, setNewIntroduceTitle] = useState(null);
	const [newIntroduceText, setNewIntroduceText] = useState(null);
	// const [newIntroduceObj, setNewIntroduceObj] = useState({introduceTitle: null, introduceText: null})
	const [newIntroduce, setNewIntroduce] = useState({introduceTitle: null, introduceText: null});

	// 해당 프로젝트 정보 가져오기
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

				// 현재 프로젝트 정보 저장
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

	// 프로젝트 삭제
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

	// 수정
	const toggleEditing = () => setDetailEditing((prev) => !prev);

	// 수정 입력란
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

			case "addIntroduceTitle":
				setNewIntroduceTitle(value);
				break;
			
			case "addIntroduceText":
				setNewIntroduceText(value);
				break;
		}
	}

	// 이미지 파일 변경
	const onFileChange = (event) => {
		const {
			target: {files}
		} = event;

		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const{
				currentTarget : {result}
			} = finishedEvent;
			setNewUrlBool(true);
			setNewUrl(result);
		};
		if (Boolean(theFile)){
			reader.readAsDataURL(theFile);
		}

	};

	// 멤버 추가
	const onAddMemberClick = () => {
		if (newMemberName !== ""){
			setNewMember([...newMember, newMemberName]);
			setNewMemberName("");
		}
	}

	// 멤버 삭제
	const deleteMember = (event) => {
		console.log(newMember);
		const newMemArray = newMember;
		newMemArray.splice(event.target.id, 1);
		setNewMember([...newMemArray]);
	}

	// 해시태그 추가
	const onAddHashtagClick = () => {
		if (newHashtagName !== ""){
			setNewHashtag([...newHashtag, newHashtagName]);
			setNewHashtagName("");
		}
	}

	// 해시태그 삭제
	const deleteHashtag = (event) => {
		const newHashArray = newHashtag;
		newHashArray.splice(event.target.id, 1);
		setNewHashtag([...newHashArray]);
	}

	// 소개 추가
	const onAddIntroduce = () => {
		const newIntroduceObj = {introduceTitle: newIntroduceTitle, introduceText: newIntroduceText};
		setNewIntroduce([...newIntroduce, newIntroduceObj]);
		setNewIntroduceTitle("");
		setNewIntroduceText("");
	}

	// 소개 삭제
	const deleteIntroduce = async (event) => {
		
		console.log(event.target.id);
		const newIntroduceArray = newIntroduce;
		newIntroduceArray.splice(event.target.id, 1);
		setNewIntroduce([...newIntroduceArray]);
	}

	console.log(newIntroduce);

	// 수정 취소
	const cancelEditing = () => {
		setNewUrl("");
		setNewUrlBool(false);
		setNewTitle(itemDetail.title);
		setNewMember([...itemDetail.member]);
		setNewSummary(itemDetail.summary);
		setNewHashtag([...itemDetail.hashtag]);

		// setIntroduceIndex("");
		setNewIntroduce([...itemDetail.introduce]);
		setNewIntroduceTitle("");
		setNewIntroduceText("");
		
		setDetailEditing((prev) => !prev);
	}

	// 수정 제출
	const onSubmit = async (event) => {
		event.preventDefault();

		let newAttachmentUrl = "";
		// 이미지 변경된 경우, storage 이전 이미지 삭제 후 새로운 이미지 저장
		if (newUrl !== ""){
			await storageService.refFromURL(itemDetail.url).delete();

			const attachmentRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}`);
		
			const response = await attachmentRef.putString(newUrl, "data_url");
			newAttachmentUrl = await response.ref.getDownloadURL();
		}
		
		// db 업데이트
		await dbService.doc(`projects/${itemDetail.id}`).update({
			attachmentUrl: newAttachmentUrl,
			title: newTitle,
			member: newMember,
			summary: newSummary,
			hashtag: newHashtag,
			introduce: newIntroduce
		});

		// 프로젝트 정보 업데이트
		setItemDetail({
			id: itemDetail.id,
			url: newAttachmentUrl,
			title: newTitle,
			summary: newSummary,
			member: newMember,
			hashtag: newHashtag,
			introduce: newIntroduce
		});

		setDetailEditing(false);
		setNewUrl("");
		setNewUrlBool(false);

		
		// setIntroduceIndex("");
	};

	return (
		<div>

			{detailEditing ? (

				<div className="detail_container">
					<form onSubmit={onSubmit}>

						{/* Img */}
						<div style={{paddingBottom:"40px"}}>
							{newUrlBool ? (
								<img src={`${newUrl}`}/>
							) : (
								<img src={itemDetail.url}/>
							)}

							<div>
								<label htmlFor="attach-file" className="factoryInput__label">
									<span>Edit Img</span>
									<FontAwesomeIcon icon={faPlus}/>
								</label>

								<input 
									id="attach-file"
									type="file" 
									accept="image/*"
									onChange={onFileChange}
									style={{
										opacity: 0
									}} 
								/>
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
										value={newMemberName}
										maxLength="15" 
										onChange={onChange}
										id="inputMember"
									/>
									<FontAwesomeIcon 
										icon={faCirclePlus} 
										size="1x" 
										style={{paddingLeft:"10px", cursor:"pointer"}}
										onClick={onAddMemberClick}
									/>
								</div>
							</span>

							{newMember.map((memberName, index) => (
								<div className="member">
									{memberName}
									<FontAwesomeIcon id={index} onClick={deleteMember} icon={faXmark} size="1x" style={{paddingLeft:"10px", cursor:"pointer"}}  />
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
										value={newHashtagName}
										maxLength="15" 
										onChange={onChange}
										id="inputHashtag"
									/>
									<FontAwesomeIcon 
										icon={faCirclePlus} 
										size="1x" 
										style={{paddingLeft:"10px", cursor:"pointer"}}
										onClick={onAddHashtagClick}
									/>
								</div>
							</span>
							{newHashtag.map((hashtag, index) => (
								<div className="hashtag">
									{hashtag} 
									<FontAwesomeIcon id={index} onClick={deleteHashtag} icon={faXmark} size="1x" style={{paddingLeft:"10px", cursor:"pointer"}} />
								</div>
							))}
						</div>
						
						{/* Introduce */}
						<div className="list_update">
							{newIntroduce.map((item, index) => (
									<div className="introduce_list">
										<span className="input_introduce">
											{console.log(index)}
											<FontAwesomeIcon id={index} onClick={deleteIntroduce} icon={faCircleXmark} size="1x" style={{paddingLeft:"10px", cursor:"pointer"}} />

											<input
												value={item.introduceTitle}
												placeholder="Edit Introduce Title"
												autoFocus
												id={index}
												onChange={onChange}
												className="inputIntroduceTitle"
											/>
										</span>
										
										<input
											value={item.introduceText}
											placeholder="Edit Introduce Text"
											autoFocus
											id={index}
											onChange={onChange}
											className="inputIntroduceText"
										/>
									</div>								
								
							))}

							{/* 소개 추가 */}
							<div className="introduce_list">
								<span className="input_introduce">
									<FontAwesomeIcon onClick={onAddIntroduce} icon={faCirclePlus} size="1x" style={{paddingLeft:"10px", cursor:"pointer"}} />
									<input
										placeholder="Introduce Title"
										autoFocus
										value={newIntroduceTitle}
										onChange={onChange}
										id="addIntroduceTitle"
									/>
								</span>
										
								<input
									placeholder="Introduce Text"
									autoFocus
									value={newIntroduceText}
									onChange={onChange}
									id="addIntroduceText"
								/>
							</div>
						</div>

						{/* update */}
						<input type="submit" value="Update Project" className="formBtn" />
					</form>

					{/* Cancel */}
					<div>
						<button onClick={cancelEditing} className="formBtn">Cancel</button>
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
