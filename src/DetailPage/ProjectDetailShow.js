const ProjectDetailShow = ({itemDetail}) => {
	return (
		<>
			<div>
				<img src={`${itemDetail.url}`}/>
			</div>
					
			<div className="list">
				<span>제목</span>
				<div>{`${itemDetail.title}`}</div>
			</div>
				
			<div  className="list">
				<span>멤버</span>
				{itemDetail.member.map((memberName) => (
					<div className="member">{memberName}</div>
				))}
			</div>
			
			<div className="list">
				<span>한줄소개</span>
				<div>{`${itemDetail.summary}`}</div>
			</div>
			
			<div className="list">
				<span>해시태그</span>
				{itemDetail.hashtag.map((hashtag) => (
					<div className="hashtag">{hashtag}</div>
				))}
			</div>
			
			{itemDetail.introduce.map((item) => (
				<div className="list">
					<span>{item.introduceTitle}</span>
					<div>{item.introduceText}</div>
				</div>
			))}
		</>
	);
};

export default ProjectDetailShow;