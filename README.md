# 프로젝트 상세페이지

## [ Firebase Project : lemona-detail ]
### 1. Authentication
- google 로그인 인증
- 상세페이지 수정 및 삭제 여부 결정하기 위해 임시 설정

### 2. Firestore Database
- collection : "projects"
- fields
  - "createdAt" : number
  - "creatorId" : string
  - "projectId" : number
    - 프로젝트 고유 번호
  - "attachmentUrl" : string
  - "title" : string
  - "member" : array[string]
  - "summary" : string
    - 한 줄 요약
  - "hashtag" : array[string]
  - "introduce" : array[{ "introduceTitle" : string , "introduceText" : string }]
    - { 소제목, 내용 }

### 3. Storage
- 프로젝트 썸네일 이미지 url 저장

## [ 오류 및 해야할 기능 ]

- 상세페이지
  - 상세페이지에서 내비게이션 눌렀을 때 새로고침해야 제대로 보임
  - '멤버' 정보 눌렀을 때 해당 멤버 프로필로 이동
  - ('해시태그' 정보 눌렀을 때 해당 해시태그로 search한 결과 보여주기)

- 수정
  - 썸네일 이미지 수정
  - 텍스트 수정 시 옆으로 무한하게 늘어남 -> 밑으로 되도록..
  - 멤버 및 해시태그 정보 삭제
  - (멤버 및 해시태그 추가 시 자동 리스트 검색 보이기)
  - 소개 문단 삭제/수정/추가
