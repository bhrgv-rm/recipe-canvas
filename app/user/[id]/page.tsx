import React from "react";

const USER_ID_PAGE = ({ params }: { params: { id: string } }) => {
  return <div>{`Welcome ${params.id}`}</div>;
};

export default USER_ID_PAGE;
