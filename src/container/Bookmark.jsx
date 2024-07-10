/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdBookmark, MdModeEdit } from "react-icons/md";
import { removeFromCollection } from "../context/actions/collectionAction";

const Bookmark = ({ project }) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const collections =
    useSelector((state) => state.collections?.collections) || [];

  const searchTerm = useSelector((state) =>
    state.searchTerm?.searchTerm ? state.searchTerm?.searchTerm : ""
  );

  const isBookmarked = collections.some(
    (collectionProject) => collectionProject.id === project?.id
  );

  const [editMode, setEditMode] = useState(null);

  const [filteredCollections, setFilteredCollections] = useState([]);

  useEffect(() => {
    // Filter collections based on searchTerm
    if (searchTerm?.length > 0) {
      const filtered = collections.filter((collectionProject) => {
        const lowerCaseTitle = collectionProject.title.toLowerCase();
        return searchTerm
          .split("")
          .every((letter) => lowerCaseTitle.includes(letter));
      });
      setFilteredCollections(filtered);
    } else {
      setFilteredCollections(collections);
    }
  }, [searchTerm, collections]);

  const handleRemoveFromCollection = (projectId) => {
    dispatch(removeFromCollection(projectId));
  };

  return (
    <div className="w-full py-6 flex items-center justify-center gap-6 flex-wrap">
      {filteredCollections.length > 0 ? (
        filteredCollections.map((collectionProject, index) => (
          <motion.div
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
                srcDoc={collectionProject.output}
                style={{
                  border: "none",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
            <div className="flex items-center justify-start gap-3 w-full">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden bg-emerald-500">
                {collectionProject?.user?.photoURL ? (
                  <motion.img
                    whileHover={{ scale: 1.2 }}
                    src={collectionProject?.user?.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-xl text-white font-semibold capitalize">
                    {collectionProject?.user?.email[0]}
                  </p>
                )}
              </div>
              <div>
                <p className="text-white text-lg capitalize">
                  {collectionProject?.title}
                </p>
                <p className="text-primaryText text-sm capitalize">
                  {collectionProject?.user?.displayName
                    ? collectionProject?.user?.displayName
                    : `${collectionProject?.user?.email.split("@")[0]}`}
                </p>
              </div>
              <motion.div
                className="cursor-pointer ml-auto"
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFromCollection(collectionProject.id);
                }}
              >
                <MdBookmark
                  className={`text-primaryText text-3xl ${
                    !isBookmarked ? "text-yellow-500" : ""
                  }`}
                />
              </motion.div>
              <Link to={`/project/${collectionProject.id}`}>
                <motion.div
                  className="cursor-pointer ml-2"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditMode(collectionProject.id)}
                >
                  <MdModeEdit className="text-primaryText text-3xl" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-5xl text-center text-white shadow-lg py-10">
          No collections found
        </p>
      )}
    </div>
  );
};

export default Bookmark;
