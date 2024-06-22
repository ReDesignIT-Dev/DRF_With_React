import React from "react";
import ReactLoading from "react-loading";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className='loading-div'>
      <div className='loading-component mb-5 mt-5'>
        <ReactLoading type={"spinningBubbles"} color={"green"} height={"100%"} width={"100%"} />
      </div>
      <div className='fs-3'>Please wait</div>
    </div>
  );
};

export default Loading;
