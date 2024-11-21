/** @format */

import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Collections, Home, NewProjects, ProjectDetail } from "./container";
import { auth, db } from "./config/firebase.config";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { Spinner } from "./components";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";
import { SET_PROJECTS } from "./context/actions/projectActions";
import { addToCollection } from "./context/actions/collectionAction";

const App = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        setDoc(doc(db, "users", userCred?.uid), userCred?.providerData[0]).then(
          () => {
            dispatch(SET_USER(userCred?.providerData[0]));
            navigate("/home/auth", { replace: false });
            navigate("/home/projects", { replace: true });
          }
        );
      }

      setIsLoading(false);
    });

    return () => unSubscribe();
  }, []);

  useEffect(() => {
    const projectQuery = query(
      collection(db, "Projects"),
      orderBy("id", "desc")
    );

    const unSubscribe = onSnapshot(projectQuery, (querySnaps) => {
      const projectList = querySnaps.docs.map((doc) => doc.data());
      dispatch(SET_PROJECTS(projectList));
    });

    return unSubscribe;
  }, []);

  useEffect(() => {
    const collectionQuery = query(
      collection(db, "Collections"),
      orderBy("id", "desc")
    );

    const unSubscribe = onSnapshot(collectionQuery, (querySnaps) => {
      const collectionList = querySnaps.docs.map((doc) => doc.data());
      collectionList.forEach((item) => {
        dispatch(addToCollection(item));
      });
    });

    return unSubscribe;
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : (
        <div className="w-screen h-screen flex items-start justify-start overflow-hidden">
          <Routes>
            <Route path="/home/*" element={<Home />} />
            <Route path="/newProject" element={<NewProjects />} />
            <Route path="/project/:projectId" element={<ProjectDetail />} />
            <Route path="/home/collections" element={<Collections />} />

            <Route path="*" element={<Navigate to={"/home"} />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
