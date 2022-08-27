import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt,faXmark,faCirclePlus,faPlus,faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import ProjectDetailShow from "./ProjectDetailShow";
import { v4 as uuidv4 } from "uuid";
import ReactHtmlParser from "html-react-parser";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ProjectDetail = ({userObj}) => {
	// const {id} = useParams();
	
	const location = useLocation();
	const nowProjectId = location.state.data;

	// 프로젝트 정보
	const [itemDetail, setItemDetail] = useState({
		id: "",
		attachmentUrl: "",
		title: "",
		introduce: "",
		member: [],
		tagList: [],
		content: "",
	});

	const [projectOwner, setProjectOwner] = useState(false);
	const [detailEditing, setDetailEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	// 수정 프로젝트 정보
	const [newThumbnailBool, setNewThumbnailBool] = useState(false);
	const [newThumbnail, setNewThumbnail] = useState("");

	const [newTitle, setNewTitle] = useState(null);
	const [newMemberName, setNewMemberName] = useState(null);		
	const [newMember, setNewMember] = useState(null);		
	const [newIntroduce, setNewIntroduce] = useState(null);
	const [newTagListName, setNewTagListName] = useState(null);		
	const [newTagList, setNewTagList] = useState(null);	

	const [newContent, setNewContent] = useState(null);
	

	// 해당 프로젝트 정보 가져오기
	useEffect(async () => {
		dbService
			.collection("projectforms")
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
					thumbnail: newArray[0].thumbnail,
					title: newArray[0].title,
					introduce: newArray[0].introduce,
					member: newArray[0].member,
					tagList: newArray[0].tagList,
					content: newArray[0].content,
				});

				setNewTitle(newArray[0].title);
				setNewMember([...newArray[0].member]);
				setNewIntroduce(newArray[0].introduce);
				setNewTagList([...newArray[0].tagList]);
				setNewContent(newArray[0].content);
				
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
			await dbService.doc(`projectforms/${itemDetail.id}`).delete();
			if (itemDetail.thumbnail !== ""){
				await storageService.refFromURL(itemDetail.thumbnail).delete();
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
			
			case "inputIntroduce":
				event.target.style.height = "1px";
				event.target.style.height = (12+event.target.scrollHeight)+"px";
				setNewIntroduce(value);
				break;

			case "inputTagList":
				setNewTagListName(value);
				break;

			// case "addContentHeader":
			// 	setNewContentHeader(value);
			// 	break;
			
			// case "addContentContext":
			// 	event.target.style.height = "1px";
			// 	event.target.style.height = (12+event.target.scrollHeight)+"px";
			// 	setNewContentContext(value);
			// 	break;
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
			setNewThumbnailBool(true);
			setNewThumbnail(result);
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
	const onDeleteMember = (event) => {
		const newMemArray = newMember;
		newMemArray.splice(event.target.id, 1);
		setNewMember([...newMemArray]);
	}

	// 해시태그 추가
	const onAddTagListClick = () => {
		if (newTagListName !== ""){
			setNewTagList([...newTagList, newTagListName]);
			setNewTagListName("");
		}
	}

	// 해시태그 삭제
	const onDeleteTagList = (event) => {
		console.log(event.target.id);
		const newTagArray = newTagList;
		newTagArray.splice(event.target.id, 1);
		setNewTagList([...newTagArray]);
	}

	// // 소개 추가
	// const onAddContent = () => {
	// 	const newContentObj = {header: newContentHeader, context: newContentContext};
	// 	setNewContent([...newContent, newContentObj]);
	// 	setNewContentHeader("");
	// 	setNewContentContext("");
	// }

	// // 소개 삭제
	// const onDeleteContent = async (event) => {
	// 	console.log(event.target.id);
	// 	const newContentArray = newContent;
	// 	newContentArray.splice(event.target.id, 1);
	// 	setNewContent([...newContentArray]);
	// }

	// 수정 취소
	const cancelEditing = () => {
		setNewThumbnail("");
		setNewThumbnailBool(false);
		setNewTitle(itemDetail.title);
		setNewMember([...itemDetail.member]);
		setNewIntroduce(itemDetail.introduce);
		setNewTagList([...itemDetail.tagList]);

		// setIntroduceIndex("");
		setNewContent(itemDetail.content);
		// setNewContentHeader("");
		// setNewContentContext("");
		
		setDetailEditing((prev) => !prev);
	}

	// 수정 제출
	const onSubmit = async (event) => {
		event.preventDefault();

		let newThumbnailUrl = "";
		// 이미지 변경된 경우, storage 이전 이미지 삭제 후 새로운 이미지 저장
		if (newThumbnail !== ""){
			await storageService.refFromURL(itemDetail.thumbnail).delete();

			const attachmentRef = storageService
				.ref()
				.child(`${itemDetail.nowProjectId}/${uuidv4()}`);
		
			const response = await attachmentRef.putString(newThumbnail, "data_url");
			newThumbnailUrl = await response.ref.getDownloadURL();
		}
		
		
		// db 업데이트
		await dbService.doc(`projectforms/${itemDetail.id}`).update({
			thumbnail: newThumbnailUrl,
			title: newTitle,
			member: newMember,
			introduce: newIntroduce,
			tagList: newTagList,
			content: newContent
		});

		// 프로젝트 정보 업데이트
		setItemDetail({
			id: itemDetail.id,
			thumbnail: newThumbnailUrl,
			title: newTitle,
			introduce: newIntroduce,
			member: newMember,
			tagList: newTagList,
			content: newContent
		});

		setDetailEditing(false);
		setNewThumbnail("");
		setNewThumbnailBool(false);

		// setIntroduceIndex("");
	};

	return (
		<div>

			{detailEditing ? (

				<div className="detail_container">
					<form onSubmit={onSubmit}>

						{/* Img */}
						<div style={{paddingBottom:"40px"}}>
							{newThumbnailBool ? (
								<img src={`${newThumbnail}`}/>
							) : (
								<img src={itemDetail.thumbnail}/>
							)}

							<div>
								<label htmlFor="attach-file" className="factoryInput__label">
									<span>Edit Thumbnail</span>
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
									<FontAwesomeIcon id={index} onClick={onDeleteMember} icon={faXmark} size="1x" style={{paddingLeft:"10px", cursor:"pointer"}}  />
									
									{/* {loading ? (
										""
									) : (
										
									)} */}
									
								</div>
							))}
						</div>
						
						{/* Introduce */}
						<div className="list_update">
							<span>한줄소개</span>
							<textarea
								onChange={onChange}
								value={newIntroduce}
								required
								placeholder="Edit Introduce"
								autoFocus
								id="inputIntroduce"
								style={{
									
								}}
							/>
						</div>
						
						{/* tagList */}
						<div className="list_update">
							<span>
								해시태그
								<div className="input_hashtag">
									<input 
										type="text" 
										placeholder="Hashtag"
										value={newTagListName}
										maxLength="15" 
										onChange={onChange}
										id="inputTagList"
									/>
									<FontAwesomeIcon 
										icon={faCirclePlus} 
										size="1x" 
										style={{paddingLeft:"10px", cursor:"pointer"}}
										onClick={onAddTagListClick}
									/>
								</div>
							</span>
							{newTagList.map((hashtag, index) => (
								<div className="hashtag">
									#{hashtag} 
									<FontAwesomeIcon id={index} onClick={onDeleteTagList} icon={faXmark} size="1x" style={{paddingLeft:"10px", cursor:"pointer"}} />
								</div>
							))}
						</div>
						
						{/* Content */}
						<div className="list_update">
							<span>본문 내용</span>
							<CKEditor
								editor={ClassicEditor}
								data={`${newContent}`}
								config={{
									placeholder: '내용을 입력해 주세요.',
								}}
								onChange={(event, editor) => {
									//console.log(editor.getData());
									setNewContent(editor.getData());
								}}
							/>
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
					<div style={{ paddingBottom:"20px"}}>
							<span onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} size="2x" style={{ padding:"10px"}}/>
							</span>
							<span onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} size="2x" style={{ padding:"10px"}}/>
							</span>
						</div>
					{/* {projectOwner && (
						
					)} */}
				
				</div >
			)}
		</div>
	);
};

export default ProjectDetail;
