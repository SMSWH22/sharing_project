import React, { useState } from "react";
import { dbService, storageService } from "../../firebase";
import {v4 as uuidv4} from 'uuid';
import { map } from "@firebase/util";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ProjectForm = ({ userObj }) => {
    const [title, setTitle] = useState(""); //제목
    const [member, setMember] = useState(""); //멤버
    const [memberList, setMemberList] = useState([]);
    const [introduce, setIntroduce] = useState(""); //한줄소개
    const [tag, setTag] = useState(""); //태그
    const [tagList, setTagList] = useState([]);
    const [mainAttachment, setMainAttachment] = useState(""); //썸네일사진
    const [files, setFiles] = useState([]); // 파일 리스트
    const [fileList, setFileList] = useState([]);
    const [isUploading, setUploading] = useState(false); // 업로드 상태
    const [photoURL, setPhotosURL] = useState([]); // 업로드 완료된 사진 링크들
    const [newContentList, setNewContentList] = useState([]); //소개내용추가
    const [data, setData] = useState(""); 

    //멤버 리스트에 추가
    const onKeyPressMem = (event) => {  
        if (event.target.value.length !== 0 && event.key === 'Enter') {
            setMemberList([...memberList, member])
            setMember("")
        }
    }

    const onSubmit = async (event) => {
        //버튼을 클릭한 경우에만 제출하도록 변경
        event.preventDefault(); //새로고침 방지
        
        let attachmentUrl = "";
        const projectId = uuidv4();

        if (mainAttachment !== "") {
            console.log("사진있음")
            const attachmentRef = storageService
                .ref()
                .child(`${title}/${uuidv4()}`);
            const response = await attachmentRef.putString(mainAttachment, "base64");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        
        const ProjectFormObj = {
            title: title,
            member: memberList,
            introduce: introduce,
            tagList: tagList,
            content: newContentList,
            createdAt: Date.now(),
            attachmentUrl : attachmentUrl,
            projectId: projectId,
            data: data,
            //글 작성자(멤버에 항상 포함되도록)
        };
        await dbService.collection("projectforms").add(ProjectFormObj);

        setTitle("");
        setMemberList("");
        setIntroduce("");
        setTag("");
        setTagList([]);
        setNewContentList([]);
    };

    //태그 리스트에 추가
    const onKeyPressTag = (event) => {  
        if (event.target.value.length !== 0 && event.key === 'Enter') {
            console.log("onkeypresstag")
            setTagList([...tagList, tag])
            setTag("")
        }
    }


    const deleteTagItem = (event) => {
        const deleteTagItem = event.target.parentElement.firstChild.innerText

        const filteredTagList = tagList.filter(tag => tag !== deleteTagItem)
        setTagList(filteredTagList)
    }

    const onChange = (event) => {
        const {
            target: { value },
        } = event;

        if (event.target.id === "titleText") {
            setTitle(value);
        }
        else if (event.target.id === "memberText") {
            setMember(value);
        }
        else if (event.target.id === "introduceText") {
            setIntroduce(value);
        }
        else if (event.target.id === "tagText") {
            setTag(value);
        }
    };

    const onFileChange = (event) => {
        if(event.target.id === "mainAttachment"){
            const { 
                target: { files }, 
            } = event;
            const theFile = files[0];
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
                const {
                    currentTarget: { result },
                } = finishedEvent;
                setMainAttachment(result);
            };
            reader.readAsDataURL(theFile);
        }
    };
    
    const onClearAttachment = () => setMainAttachment(null);

    return (
        <>
            <h1>project form page</h1>
            <form className="form_container" onSubmit={false}>
                <p>프로젝트 소개 작성하기</p>
                <div className="input_p">
                    <span>제목 </span><hr></hr>
                    <input
                        className="input_title"
                        id="titleText"
                        type="text"
                        placeholder="제목"
                        size="30"
                        value={title}
                        onChange={onChange}
                        style={{ border: "none" }}
                    />
                </div>
                <br></br>
                <div className="input_p">
                    <span className="span_tag">멤버</span><hr></hr>
                    <div style={{ display: "inline-block" }}>
                        <input
                            type="text"
                            title="멤버"
                            name="memberText"
                            id="memberText"
                            placeholder="멤버추가"
                            value={member}
                            onChange={onChange}
                            onKeyPress={onKeyPressMem}
                            style={{ boxsizing: "content-box", width: "47px", border: "none" }}
                        />
                    </div>
                    <div>
                        {memberList.map((item, idx) => {
                            return (
                                <span className="txt_tag">
                                    <span key={idx}>{item} </span>
                                </span>
                            )
                        })}
                    </div>
                </div>
                <br></br>
                <div className="input_p">
                    <span>한 줄 소개</span><hr></hr>
                    <textarea
                        className="input_intro"
                        id="introduceText"
                        placeholder="한 줄 소개"
                        cols="70"
                        rows="3"
                        value={introduce}
                        onChange={onChange}
                        style={{ border: "none" }}
                    />
                </div>
                <br></br>
                <div className="input_p">
                    <span className="span_img">썸네일 사진 </span><hr></hr>
                    <input
                        className="input_img"
                        id="mainAttachment"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        style={{ border: "none" }}
                    />
                    {mainAttachment && (
                        <div className="attatchment">
                            <img src={mainAttachment} />
                            <button className="default_Btn" onClick={onClearAttachment}>Clear</button>
                        </div>
                    )}
                </div>
                <br></br>
                <div className="input_content">
                    <span>본문 작성</span><hr></hr>
                    <CKEditor
                        editor={ClassicEditor}
                        data=''
                        config={{
                            placeholder: '내용을 입력해 주세요.',
                        }}
                        onChange={(event, editor) => {
                            //console.log(editor.getData());
                            setData(editor.getData());
                        }}
                    />
                </div>
                <br></br>
                <div className="input_p">
                    <span className="span_tag">해시태그</span><hr></hr>
                    <span>#</span>
                    <div style={{ display: "inline-block" }}>
                        <input
                            type="text"
                            title="태그"
                            name="tagText"
                            id="tagText"
                            placeholder="태그입력"
                            value={tag}
                            onChange={onChange}
                            onKeyPress={onKeyPressTag}
                            style={{ boxsizing: "content-box", width: "47px", border: "none" }}
                        />
                        <div style={{ position: "absolute", top: "0px", left: "0px", visibility: "hidden", height: "0px", overflow: "scroll", whitespace: "pre", fontsize: "13px", fontweight: "400", fontstyle: "normal", letterspacing: "normal", texttransform: "none" }}></div>
                    </div>
                    <div>
                        {tagList.map((item, idx) => {
                            return (
                                <span className="txt_tag">
                                    <span key={idx}>#{item} </span>
                                    {/*<button className="btn_delete" onClick={deleteTagItem}>X</button>*/}
                                </span>
                            )
                        })}
                    </div>
                </div>
                <div>
                    <button className="default_Btn_Right" type="submit" onClick={onSubmit}>제출</button>
                </div>
            </form>
        </>
    );
}

export default ProjectForm;