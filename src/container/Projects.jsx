/** @format */

import React, { useEffect, useState } from "react";
import { MdBookmark, MdModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  addToCollection,
  removeFromCollection,
  loadCollections,
} from "../context/actions/collectionAction";

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects?.projects);
  const searchTerm = useSelector((state) =>
    state.searchTerm?.searchTerm ? state.searchTerm?.searchTerm : ""
  );
  const [filtered, setFiltered] = useState(null);

  useEffect(() => {
    dispatch(loadCollections());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm?.length > 0) {
      setFiltered(
        projects?.filter((project) => {
          const lowerCaseItem = project?.title.toLowerCase();
          return searchTerm
            .split("")
            .every((letter) => lowerCaseItem.includes(letter));
        })
      );
    } else {
      setFiltered(null);
    }
  }, [searchTerm, projects]);

  return (
    <div className="w-full py-6 flex items-center justify-center gap-6 flex-wrap">
      {filtered ? (
        <>
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </>
      ) : (
        <>
          {projects &&
            projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </>
      )}
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
  const dispatch = useDispatch();
  const collections = useSelector(
    (state) => state.collections?.collections || []
  );

  const isBookmarked = collections.some(
    (collectionProject) => collectionProject.id === project.id
  );

  const [editMode, setEditMode] = useState(null);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      dispatch(removeFromCollection(project.id));
    } else {
      dispatch(addToCollection(project));
    }
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full md:w-[450px] h-[375px] bg-secondary rounded-md p-4 flex flex-col items-center justify-center gap-4"
    >
      <div
        className="bg-primary w-full h-full rounded-md overflow-hidden"
        style={{ overflow: "hidden", height: "100%" }}
      >
        <iframe
          title="Result"
          srcDoc={project.output}
          style={{
            border: "none",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div className="flex items-center justify-start gap-3 w-full">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden bg-blue-500">
          {project?.user?.photoURL ? (
            <motion.img
              whileHover={{ scale: 1.2 }}
              src={project?.user?.photoURL}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-xl text-white font-semibold capitalize">
              {project?.user?.email[0]}
            </p>
          )}
        </div>
        <div>
          <p className="text-white text-lg capitalize">{project?.title}</p>
          <p className="text-primaryText text-sm capitalize">
            {project?.user?.displayName
              ? project?.user?.displayName
              : `${project?.user?.email.split("@")[0]}`}
          </p>
        </div>
        <motion.div
          className="cursor-pointer ml-auto"
          whileTap={{ scale: 0.9 }}
          onClick={handleBookmark}
        >
          <MdBookmark
            className={`text-primaryText text-3xl ${
              isBookmarked ? "text-yellow-500" : ""
            }`}
          />
        </motion.div>
        <Link to={`/project/${project.id}`}>
          <motion.div
            className="cursor-pointer ml-2"
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditMode(project.id)}
          >
            <MdModeEdit className="text-primaryText text-3xl" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default Projects;
