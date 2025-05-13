import { useState, useEffect } from "react";
import {
  limit,
  query,
  collection,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import Tweet from "./Tweet";

export interface ITweet {
  id: string;
  createdAt: number;
  photo?: string;
  video?: string;
  tweet: string;
  userId: string;
  username: string;
}

const TimeLine = () => {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { photo, video, userId, username, createdAt, tweet } =
            doc.data();
          return {
            id: doc.id,
            createdAt,
            photo,
            video,
            tweet,
            userId,
            username,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <div>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </div>
  );
};

export default TimeLine;
