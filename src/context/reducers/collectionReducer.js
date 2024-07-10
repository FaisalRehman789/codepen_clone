/** @format */

// collectionReducer.js
const initialState = {
  collections: [],
};

const collectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_COLLECTION":
      return {
        ...state,
        collections: [...state.collections, action.payload],
      };
    case "REMOVE_FROM_COLLECTION":
      return {
        ...state,
        collections: state.collections.filter(
          (project) => project.id !== action.payload
        ),
      };
    case "LOAD_COLLECTIONS":
      return {
        ...state,
        collections: action.payload,
      };
    default:
      return state;
  }
};

export default collectionReducer;
