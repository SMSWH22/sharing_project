import BoxItem from "components/BoxItem";
import BoxItemAd from "components/BoxItemAd";
import BoxItemTo from "components/BoxItemTo";
import { dbService } from "firebase_";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
width: 100vw;
display: flex;
flex-direction: column;
align-items: center;
`

const MainLemona = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: row;
`

const LemonaSec = styled.div`
  width: 40vw;
  height: 200px;
  border: 1px solid black;
  margin: 70px;
`

const Search = styled.div`
  height: 50px;
  width: 80%;
  border: 1px solid black;
  border-radius: 30px;
  flex-direction: row;
  align-items: center;
  display:flex;
  align-items:center; 
`

const Hot = styled.div`
font-size: 14px;
  width: 90px;
  height: 40px;
  color: #707070;
  background-color: #CCE8FF;
  border-radius: 20px;
  text-align: center;
  margin: 35px 85vw 0 0;
  padding: 12px;
`

const MainPost = styled.div`
  display: grid;
  border: 1px;
  width: 30vw;
  height: auto;
 // border: 1px solid black;
  margin: 30px;
  justify-content: center;
`;
const PostListWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size:: small;
  row-gap: 8x;
  grid-template-columns: repeat(1, auto);
  flex-direction: column;
//border: 1px solid blue;
`;


const PostContainer = styled.div`
  width: 100%;
  // border: 1px solid red;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: nowrap;
  `;


const Home = ({ userObj }) => {
    const [search, setSearch] = useState("");
    const [projects, setProjects] = useState([]); //모든 프로젝트 게시글
    const [togethers, setTogethers] = useState([]); //모든 구인게시글
    const [ads, setAds] = useState([]); //모든 홍보게시글

    const [newProjects, setNewProjects] = useState([]); //모든 프로젝트 게시글
    const [newTogethers, setNewTogethers] = useState([]); //모든 구인게시글
    const [newAds, setNewAds] = useState([]); //모든 홍보게시글

    const [asking, setAsking] = useState(false);

    //모든 프로젝트 불러오기
    useEffect(() => {
        dbService.collection("projectforms").orderBy("view", "desc")
            .onSnapshot((snapshot) => {
                const postObj = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProjects(postObj);
                console.log(postObj)
            });

        dbService.collection("togetherforms").orderBy("view", "desc")
            .onSnapshot((snapshot) => {
                const postObj = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTogethers(postObj);
            });

        dbService.collection("adforms").orderBy("view", "desc")
            .onSnapshot((snapshot) => {
                const postObj = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAds(postObj);
            });
    }, []);

    //검색어 변경
    const onChangeSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    };

    //검색 기능
    const onSearch = (e) => {
        e.preventDefault();
        if (search === null || search === '') { //검색어 없는경우 리스트반환
            setAsking(false)
        }
        else {//검색 구현
            let newArr = projects.filter(data =>
                data.title.includes(search)
            );
            setNewProjects(newArr)
            let newArr2 = ads.filter(data =>
                data.title.includes(search)
            );
            setNewAds(newArr2)
            let newArr3 = togethers.filter(data =>
                data.title.includes(search)
            );
            setNewTogethers(newArr3)
            setAsking(true)
        }
        setSearch("");
    }

    return (
        <>
            <Container>
                <MainLemona>
                    <LemonaSec></LemonaSec>
                    <LemonaSec></LemonaSec>
                </MainLemona>
                <form onSubmit={e => onSearch(e)} style={{
                    height: "50px",
                    width: "80vw",
                    border: "1px solid black",
                    borderRadius: "10px",
                    flexdirection: "row",
                    alignitems: "center",
                    display: "flex",
                }}>
                    <input
                        className="searchInput"
                        placeholder="검색어를 입력해주세요"
                        type="text"
                        value={search}
                        onChange={onChangeSearch}
                        style={{
                            height: "auto",
                            width: "80vw",
                            marginleft: "25px",
                            fontsize: "14px",
                            display: "inline-block",
                            textAlign: "center",
                            fontSize: "16px"
                        }} />
                    <button
                        className="searchBtn"
                        style={{
                            height: "auto",
                            width: "10vw",
                            borderradius: "20px",
                            fontsize: "14px",
                            border: "none",
                            backgroundcolor: "#AAAAAA",
                            cursor: "pointer",
                            display: "inline-block",
                            borderRadius: "10px",
                        }}
                    >
                        🔍
                    </button>
                </form>

                <Hot>
                    <span className="hotSpan" style={{ margin: "5px" }}>🔥HOT</span>
                </Hot>

                <div>
                    {asking ? (
                        <>
                            <h2 style={{
                                padding: "10px",
                                backgroundColor: "#e8eaf6",
                                width: "90%",
                                marginLeft: "3%",
                                textAlign: "center",
                                marginBottom: "0px",
                            }}>검색결과</h2>

                            <PostContainer>
                                <MainPost>
                                    <PostListWrapper>
                                        <h3 style={{
                                            padding: "10px",
                                            borderLeft: "7px solid #FFEB3B",
                                            backgroundColor: "#fffde7",
                                            width: "90%",
                                            marginLeft: "3%",
                                        }}>프로젝트 검색결과</h3>
                                        {newProjects.map((list) => (
                                            <BoxItem
                                                key={list.id}
                                                userObj={userObj}
                                                listObj={list}
                                                isOwner={false}
                                                {...list}
                                            />
                                        ))}
                                    </PostListWrapper>
                                </MainPost>

                                <MainPost>
                                    <PostListWrapper>
                                        <h3 style={{
                                            padding: "10px",
                                            borderLeft: "7px solid #2196f3",
                                            backgroundColor: "#e3f2fd",
                                            width: "90%",
                                            marginLeft: "3%",
                                        }}>함께해요 검색결과</h3>
                                        {newTogethers.map((list) => (
                                            <BoxItemTo
                                                key={list.id}
                                                userObj={userObj}
                                                listObj={list}
                                                isOwner={false}
                                                {...list}
                                            />
                                        ))}
                                    </PostListWrapper>
                                </MainPost>

                                <MainPost>
                                    <PostListWrapper>
                                        <h3 style={{
                                            padding: "10px",
                                            borderLeft: "7px solid #FFEB3B",
                                            backgroundColor: "#fffde7",
                                            width: "90%",
                                            paddingLeft: "20px",
                                            marginLeft: "3%",
                                        }}>홍보해요 검색결과</h3>
                                        {newAds.map((list) => (
                                            <BoxItemAd
                                                key={list.id}
                                                userObj={userObj}
                                                listObj={list}
                                                isOwner={false}
                                                {...list}
                                            />
                                        ))}
                                    </PostListWrapper>
                                </MainPost>
                            </PostContainer>
                        </>
                    ) : (
                        <PostContainer>
                            <MainPost>
                                <h3 style={{
                                    padding: "10px",
                                    borderLeft: "7px solid #FFEB3B",
                                    backgroundColor: "#fffde7",
                                    width: "90%",
                                    marginLeft: "3%",
                                }}>프로젝트 인기글</h3>
                                <PostListWrapper>
                                    {projects.map((list) => (
                                        <BoxItem
                                            key={list.id}
                                            userObj={userObj}
                                            listObj={list}
                                            isOwner={false}
                                            {...list}
                                        />
                                    ))}
                                </PostListWrapper>
                            </MainPost>

                            <MainPost>
                                <PostListWrapper>
                                    <h3 style={{
                                        padding: "10px",
                                        borderLeft: "7px solid #2196f3",
                                        backgroundColor: "#e3f2fd",
                                        width: "90%",
                                        marginLeft: "3%",
                                    }}>함께해요 인기글</h3>
                                    {togethers.map((list) => (
                                        <BoxItemTo
                                            key={list.id}
                                            userObj={userObj}
                                            listObj={list}
                                            isOwner={false}
                                            {...list}
                                        />
                                    ))}
                                </PostListWrapper>
                            </MainPost>

                            <MainPost>
                                <PostListWrapper>
                                    <h3 style={{
                                        padding: "10px",
                                        borderLeft: "7px solid #FFEB3B",
                                        backgroundColor: "#fffde7",
                                        width: "90%",
                                        paddingLeft: "20px",
                                        marginLeft: "3%",
                                    }}>홍보해요 인기글</h3>
                                    {ads.map((list) => (
                                        <BoxItemAd
                                            key={list.id}
                                            userObj={userObj}
                                            listObj={list}
                                            isOwner={false}
                                            {...list}
                                        />
                                    ))}
                                </PostListWrapper>
                            </MainPost>
                        </PostContainer>
                    )}
                </div>
            </Container>
        </>
    )
}
export default Home;