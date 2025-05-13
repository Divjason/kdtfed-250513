import styled from "styled-components";
import PostTweetForm from "../components/PostTweetForm";
import TimeLine from "../components/TimeLine";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
  padding-right: 40px;
`;

const Home = () => {
  return (
    <Container>
      <PostTweetForm />
      <TimeLine />
    </Container>
  );
};

export default Home;
