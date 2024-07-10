/** @format */

// collectionActions.js
export const addToCollection = (project) => (dispatch, getState) => {
  dispatch({
    type: "ADD_TO_COLLECTION",
    payload: project,
  });

  const collections = getState().collections.collections;
  localStorage.setItem("collections", JSON.stringify(collections));
};

export const removeFromCollection = (projectId) => (dispatch, getState) => {
  dispatch({
    type: "REMOVE_FROM_COLLECTION",
    payload: projectId,
  });

  const collections = getState().collections.collections;
  localStorage.setItem("collections", JSON.stringify(collections));
};

export const loadCollections = () => (dispatch) => {
  const collections = JSON.parse(localStorage.getItem("collections")) || [];
  dispatch({
    type: "LOAD_COLLECTIONS",
    payload: collections,
  });
};
