import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi";

const test = () => {
  const {header, body, error, isLoading, fetch } = useApi("/api/test", {method: 'post'});
  if (isLoading){
    return <p>로딩 중</p>
  }
  if (error) {
    return <p>에러: {error.toString()}</p>;
  }
  return (
    <div>
      <h2>Response Header</h2>
      <p>코드: {header?.code}</p>
      <p>메시지: {header?.message}</p>
    </div>
  );
};
export default test;