import React from 'react';

const ProfileHeader = ({ title }) => {
  return (
    <>
      <div className="flex justify-content-between align-items-center w-full mb-5">
        <h1 className="text-3xl font-bold m-0">{title}</h1>
      </div >
    </>
  );
};

export default ProfileHeader;

