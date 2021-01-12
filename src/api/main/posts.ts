import app from 'firebase/app';
import db from './db';
import { IPostData } from './auth';
import { createRef, POSTS_COLLECTION, PROFILES_COLLECTION } from './helpers';

const modifyPostFromFirebase = async (post: any) => {
  const user = await post.user.get().then((snap: any) => snap.data());
  return {
    ...post,
    user,
    createdAt: post.createdAt.toDate(),
    updatedAt: post.updatedAt.toDate(),
  };
};

export const fetchPost = async (postId: string) => {
  const snapshot: any = await db.doc(`${POSTS_COLLECTION}/${postId}`).get();
  return modifyPostFromFirebase(snapshot.data());
};

export const fetchPosts = async (uid: string): Promise<Array<IPostData>> => {
  const snapshot = await db
    .collection(POSTS_COLLECTION)
    .where('user', '==', createRef(PROFILES_COLLECTION, uid))
    .get();
  const serverPosts = snapshot.docs.map(doc => doc.data()) as Array<IPostData>;
  return Promise.all(serverPosts.map((post: IPostData) => modifyPostFromFirebase(post)));
};

export const createPost = async (postData: IPostData, uid: string) => {
  const timestamp = app.firestore.FieldValue.serverTimestamp();
  const fullPostData = {
    ...postData,
    createdAt: timestamp,
    updatedAt: timestamp,
    user: createRef('profiles', uid),
  };
  const { id } = await db.collection(POSTS_COLLECTION).add(fullPostData);
  await db
    .collection(POSTS_COLLECTION)
    .doc(id)
    .update({
      ...fullPostData,
      id,
    });
  return fetchPost(id);
};

export const removePost = (postId: string) => db.collection(POSTS_COLLECTION).doc(postId).delete();

export const editPost = async (postData: IPostData) => {
  // Todo: in this case user is an object, not reference. We need to fix it.
  // eslint-disable-next-line no-param-reassign
  delete postData.user;
  const postId = postData.id;
  const timestamp = app.firestore.FieldValue.serverTimestamp();
  const fullPostData = {
    ...postData,
    updatedAt: timestamp,
  };
  await db.doc(`${POSTS_COLLECTION}/${postId}`).update(fullPostData);
  return fetchPost(postId);
};