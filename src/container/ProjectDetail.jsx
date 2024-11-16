/** @format */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown, FaCss3, FaHtml5, FaJs } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import SplitPane from "react-split-pane";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { logo } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import { MdCheck, MdEdit } from "react-icons/md";
import { Alert, UserProfileDetails } from "../components";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import {
  addToCollection,
  removeFromCollection,
} from "../context/actions/collectionAction";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [output, setOutput] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [alert, setAlert] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections?.collections);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "Projects", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProject(data);
          setHtml(data.html);
          setCss(data.css);
          setJs(data.js);
          setTitle(data.title);
          setOutput(data.output);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    updateOutput();
  }, [html, css, js]);

  const updateOutput = () => {
    const combinedOutput = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
    setOutput(combinedOutput);
  };

  const updateFirestore = async () => {
    try {
      const docRef = doc(db, "Projects", projectId);
      await updateDoc(docRef, {
        html,
        css,
        js,
        title,
        output,
      });
      setAlert(true);
      setTimeout(() => setAlert(false), 2000);

      // Update collections if project is bookmarked
      const isBookmarked = collections.some(
        (collectionProject) => collectionProject.id === projectId
      );
      if (isBookmarked) {
        dispatch(removeFromCollection(projectId));
        dispatch(
          addToCollection({
            id: projectId,
            title,
            html,
            css,
            js,
            output,
            user: project.user, // Assuming user details are needed in collections
          })
        );
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleEdit = () => {
    if (user && project && user.uid === project.user.uid) {
      setIsTitleEditing(true);
    }
  };

  const handleTitleSave = () => {
    if (user && project && user.uid === project.user.uid) {
      setIsTitleEditing(false);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col items-start justify-start overflow-hidden">
        {/* Alert section */}
        <AnimatePresence>
          {alert && <Alert status={"Success"} alertMsg={"Project Saved..."} />}
        </AnimatePresence>

        {/* Header section */}
        <header className="w-full flex items-center justify-between px-12 py-4">
          <div className="flex items-center justify-center gap-6">
            <Link to={"/home/projects"}>
              <img
                src={logo}
                alt="logo"
                className="object-contain w-32 h-auto"
              />
            </Link>
            <div className="flex flex-col items-start justify-start">
              {/* Title */}
              <div className="flex items-center justify-center gap-3">
                <AnimatePresence>
                  {isTitleEditing &&
                  user &&
                  project &&
                  user.uid === project.user.uid ? (
                    <motion.input
                      key={"TitleInput"}
                      type="text"
                      placeholder="Your Title"
                      className="px-3 py-2 rounded-md bg-transparent text-primaryText text-base outline-none border-none"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  ) : (
                    <motion.p
                      key={"titleLabel"}
                      className="px-3 py-2 text-white text-lg"
                    >
                      {title}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {user && project && user.uid === project.user.uid ? (
                    isTitleEditing ? (
                      <motion.div
                        key={"MdCheck"}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer"
                        onClick={handleTitleSave}
                      >
                        <MdCheck className="text-2xl text-blue-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={"MdEdit"}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer"
                        onClick={handleTitleEdit}
                      >
                        <MdEdit className="text-2xl text-primaryText" />
                      </motion.div>
                    )
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Follow */}
              <div className="flex items-center justify-center px-3 -mt-2 gap-2">
                <p className="text-primaryText text-sm">
                  {project?.user?.displayName
                    ? project?.user?.displayName
                    : `${project?.user?.email.split("@")[0]}`}
                </p>
                <motion.p
                  whileTap={{ scale: 0.9 }}
                  className="text-[10px] bg-blue-500 rounded-sm px-2 py-[1px] text-primary font-semibold cursor-pointer"
                >
                  + Follow
                </motion.p>
              </div>
            </div>
          </div>

          {/* User section */}
          {user && project && user.uid === project.user.uid ? (
            <div className="flex items-center justify-center gap-4">
              <motion.button
                onClick={updateFirestore}
                whileTap={{ scale: 0.9 }}
                className="px-6 py-4 bg-primaryText cursor-pointer text-base text-primary font-semibold rounded-md"
              >
                Save
              </motion.button>
              <UserProfileDetails />
            </div>
          ) : (
            <>
              <UserProfileDetails />
            </>
          )}
        </header>

        {/* Coding section */}
        <div>
          {/* Horizontal section */}
          <SplitPane
            split="horizontal"
            minSize={100}
            maxSize={-100}
            defaultSize={"50%"}
          >
            {/* Top coding section */}
            <SplitPane split="vertical" minSize={500}>
              {/* HTML code */}
              <div className="w-full h-full flex flex-col items-start justify-start">
                <div className="w-full flex items-center justify-between">
                  <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                    <FaHtml5 className="text-xl text-red-500" />
                    <p className="text-primaryText font-semibold">HTML</p>
                  </div>

                  {/* Icons */}
                  <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                    <FcSettings className="text-xl " />
                    <FaChevronDown className="text-xl text-primaryText " />
                  </div>
                </div>
                <div className="w-full px-2">
                  <CodeMirror
                    value={html}
                    height="600px"
                    extensions={[javascript({ jsx: true })]}
                    theme={"dark"}
                    onChange={(value) => {
                      setHtml(value);
                    }}
                  />
                </div>
              </div>

              <SplitPane split="vertical" minSize={500}>
                {/* CSS code */}
                <div className="w-full h-full flex flex-col items-start justify-start">
                  <div className="w-full flex items-center justify-between">
                    <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                      <FaCss3 className="text-xl text-blue-500" />
                      <p className="text-primaryText font-semibold">CSS</p>
                    </div>

                    {/* Icons */}
                    <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                      <FcSettings className="text-xl " />
                      <FaChevronDown className="text-xl text-primaryText " />
                    </div>
                  </div>
                  <div className="w-full px-2">
                    <CodeMirror
                      value={css}
                      height="600px"
                      extensions={[javascript({ jsx: true })]}
                      theme={"dark"}
                      onChange={(value) => {
                        setCss(value);
                      }}
                    />
                  </div>
                </div>

                {/* JS code */}
                <div className="w-full h-full flex flex-col items-start justify-start">
                  <div className="w-full flex items-center justify-between">
                    <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3 border-t-gray-500">
                      <FaJs className="text-xl text-yellow-500" />
                      <p className="text-primaryText font-semibold">JS</p>
                    </div>

                    {/* Icons */}
                    <div className="cursor-pointer flex items-center justify-center gap-5 px-4">
                      <FcSettings className="text-xl " />
                      <FaChevronDown className="text-xl text-primaryText " />
                    </div>
                  </div>
                  <div className="w-full px-2">
                    <CodeMirror
                      value={js}
                      height="600px"
                      extensions={[javascript({ jsx: true })]}
                      theme={"dark"}
                      onChange={(value) => {
                        setJs(value);
                      }}
                    />
                  </div>
                </div>
              </SplitPane>
            </SplitPane>

            {/* Bottom output section */}
            <div className="w-full h-full flex items-center justify-center">
              <iframe
                title="output"
                srcDoc={output}
                frameBorder="0"
                className="w-full h-full"
              />
            </div>
          </SplitPane>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
