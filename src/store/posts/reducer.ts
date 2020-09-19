import {
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  FETCH_POSTS_FAILED,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  IPostsReducer,
  PostsActionsType,
} from './types';
import {
  FAILURE_STATUS,
  IDLE_STATUS,
  LOADING_STATUS,
  SUCCESS_STATUS,
} from '../../utils/constants/other';

export const initialState: IPostsReducer = {
  posts: [],

  fetchPostsStatus: IDLE_STATUS,
  fetchPostsError: null,

  addPostStatus: IDLE_STATUS,
  addPostError: null,

  removePostStatus: IDLE_STATUS,
  removePostError: null,
};

export const postsReducer = (
  state: IPostsReducer = initialState,
  action: PostsActionsType,
): IPostsReducer => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST: {
      return { ...state, fetchPostsStatus: LOADING_STATUS };
    }
    case FETCH_POSTS_FAILED: {
      return { ...state, fetchPostsError: action.payload, fetchPostsStatus: FAILURE_STATUS };
    }
    case FETCH_POSTS_SUCCESS: {
      return { ...state, fetchPostsStatus: SUCCESS_STATUS, posts: action.payload };
    }

    case ADD_POST_REQUEST: {
      return { ...state, addPostStatus: LOADING_STATUS };
    }
    case ADD_POST_SUCCESS: {
      return { ...state, addPostStatus: SUCCESS_STATUS, posts: [action.payload, ...state.posts] };
    }
    case ADD_POST_FAILURE: {
      return { ...state, addPostStatus: FAILURE_STATUS, addPostError: action.payload };
    }

    default:
      return { ...state };
  }
};