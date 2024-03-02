import React from "react";

const DeleteModal = ({ handleDelete, onClose }) => {
  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[300px] max-w-full h-[200px] bg-white rounded-xl p-4 flex flex-col relative justify-evenly"
      >
        <p
          onClick={onClose}
          className="absolute right-3 top-2 text-2xl font-extrabold text-red-600 cursor-pointer"
        >
          X
        </p>
        <h3>Are you sure really want to delete this account </h3>
        <button
          onClick={handleDelete}
          className="border border-red-600 p-1 text-gray-500 hover:text-white hover:bg-red-600 transition-all duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
