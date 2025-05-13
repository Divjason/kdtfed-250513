import React, { useState } from "react";
import styled from "styled-components";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import type { ITweet } from "./TimeLine";
import { auth, db, storage } from "../firebase";

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  border: 1px solid var(--light-color);
  border-radius: 15px;
  margin-bottom: 40px;
  padding: 20px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 200px;
  height: 100%;
  border-radius: 15px;
`;

const Video = styled.video`
  width: 200px;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 15px;
`;

const Username = styled.span`
  display: inline-block;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Payload = styled.p`
  font-size: 2rem;
  margin-bottom: 40px;
`;

const DeleteButton = styled.button`
  background: tomato;
  color: var(--light-color);
  font-size: 1.4rem;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
`;

const EditButton = styled.button`
  background: #7f8689;
  color: var(--light-color);
  font-size: 1.4rem;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
`;

const EditorColumns = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UpdateButton = styled.button`
  background: #1d9bf0;
  color: var(--light-color);
  font-size: 1.4rem;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: #7f8689;
  color: var(--light-color);
  font-size: 1.4rem;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
`;

const SetContentButton = styled.label`
  color: var(--light-color);
  transition: color 0.3s;
  cursor: pointer;
  &:hover {
    color: #1d9bf0;
  }
  svg {
    width: 24px;
  }
`;

const SetContentInputButton = styled.input`
  display: none;
`;

const Tweet = ({ username, photo, video, tweet, userId, id }: ITweet) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<File | null>(null);
  const user = auth.currentUser;

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onUpdate = async () => {
    try {
      const ok = confirm("Are you sure you want to update this tweet?");
      if (!ok || user?.uid !== userId) return;

      const tweetDoc = await getDoc(doc(db, "tweets", id));
      if (!tweetDoc.exists()) throw new Error("Documents does not exist");

      const tweetData = tweetDoc.data();
      if (tweetData) {
        if (tweetData.photo) tweetData.fileType = "image";
        if (tweetData.video) tweetData.fileType = "video";
      }

      const existingFileType = tweetData.fileType || null;
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo || video) {
        const contentRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(contentRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onClickSetContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) setEditedContent(files[0]);
  };
  return (
    <Container>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        <EditorColumns>
          {user?.uid === userId ? (
            <>
              {isEditing ? (
                <>
                  <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                  <UpdateButton onClick={onUpdate}>Update</UpdateButton>
                  <SetContentButton htmlFor="edit-content">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z"
                      />
                    </svg>
                  </SetContentButton>
                  <SetContentInputButton
                    id="edit-content"
                    type="file"
                    accept="image/*, video/*"
                    onChange={onClickSetContent}
                  />
                </>
              ) : (
                <EditButton onClick={handleEdit}>Edit</EditButton>
              )}
              <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            </>
          ) : null}
        </EditorColumns>
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo}></Photo>
        </Column>
      ) : null}
      {video ? (
        <Column>
          <Video src={video}></Video>
        </Column>
      ) : null}
    </Container>
  );
};

export default Tweet;
