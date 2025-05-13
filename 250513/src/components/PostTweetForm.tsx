import React, { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 250px;
  background: var(--dark-color);
  color: var(--light-color);
  font-size: 1.8rem;
  border: 2px solid var(--light-color);
  padding: 20px;
  resize: none;
  transition: all 0.3s;
  &::placeholder {
    opacity: 1;
    transition: opacity 0.3s;
  }
  &:focus {
    outline: none;
    border-color: var(--button-color);
    &::placeholder {
      opacity: 0;
    }
  }
`;

const AttachFileButton = styled.label`
  width: 100%;
  color: var(--button-color);
  border: 1px solid var(--button-color);
  padding: 10px;
  text-align: center;
  font-size: 1.8rem;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    background: var(--button-color);
    color: var(--light-color);
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  width: 100%;
  padding: 10px;
  background: var(--light-color);
  color: var(--button-color);
  font-size: 1.8rem;
  border: none;
  transition: opacity 0.3s;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const PostTweetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const maxFileSize = 3 * 1024 * 1024;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > maxFileSize) {
        alert("The Maximum Capacity that can be uploaded is 3MB");
        return;
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Annoymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        const fileType = file.type;

        if (fileType.startsWith("image/")) {
          await updateDoc(doc, {
            photo: url,
          });
        }

        if (fileType.startsWith("video/")) {
          await updateDoc(doc, {
            video: url,
          });
        }
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        value={tweet}
        onChange={onChange}
        placeholder="What is Happening?"
        required
      />
      <AttachFileButton htmlFor="file">
        {file ? "Contents Added ✅" : "Add Contents"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*, video/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
};

export default PostTweetForm;
