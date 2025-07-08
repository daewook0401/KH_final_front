// AdminUserManagement.jsx
import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import DropdownMenu from "./DropdownMenu";
import useApi from "../../../hooks/useApi";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter]     = useState("");
  const [keyword, setKeyword]           = useState("");
  // useApi는 쿼리 없이 한 번만 호출
  const { header, body, error, loading, refetch: memberListApi } =
    useApi("/api/member/member-list");
  const {refetch:adminUpdateApi} = useApi("/api/member/admin-update", {method: 'post'}, false);
  // 드롭다운 메뉴 상태
  const [openMenuId, setOpenMenuId] = useState(null);
  const buttonRefs = useRef({});

  // 처음 마운트 시 한 번만 데이터 불러오기
  useEffect(() => {
    memberListApi().then(res => {
      setUsers(res.body.items);
    });             // params 없이 한 번만 호출
  }, []);

  // 검색 버튼 클릭 시만 호출
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      isActive:     statusFilter || "",
      isStoreOwner: roleFilter   || "",
      search:       keyword.trim() || "",
    });
    console.log();
    memberListApi({ url: `/api/member/member-list?${params.toString()}` })
      .then(res => {
        console.log(res);
        if(res.header.code[0] === 'S'){
          setUsers(res.body.items);
        } else {
          setUsers([]);
        }
      })
      .catch(console.error);
  };

  // 드롭다운 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        openMenuId !== null &&
        buttonRefs.current[openMenuId] &&
        !buttonRefs.current[openMenuId].contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [openMenuId]);

  // 상태 토글 및 역할 변경은 여전히 로컬에서만 예시 처리
  const handleStatusToggle = (user) => {
    const newStatus = user.isActive === "Y" ? "N" : "Y";
    adminUpdateApi({data: {"memberId":user.memberId, "isActive":newStatus}}).then(res =>{
      if(res.header.code[0] === "S"){
        setUsers(users.map(x =>
          x.memberNo === user.memberNo ? { ...x, isActive: newStatus } : x
        ));
      }
    }).catch(console.error);
  };
    // 역할(등급) 변경 API 호출 + 로컬 갱신
  const handleRoleChange = async (user) => {
    const newRole = user.isStoreOwner === "Y" ? "N" : "Y";
    adminUpdateApi({data: {"memberId":user.memberId, "isStoreOwner":newRole}}).then(res =>{
      if(res.header.code[0] === "S"){
        setUsers(users.map(x =>
          x.memberNo === user.memberNo ? { ...x, isStoreOwner: newRole } : x
        ));
      }
    }).catch(console.error);
  };


  if (loading){
    return <p>로딩 중</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">관리자 · 유저 관리</h1>

      {/* 검색 폼 */}
      <form
        className="flex flex-wrap items-center gap-2 mb-6"
        onSubmit={handleSearch}
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">전체 상태</option>
          <option value="Y">활성</option>
          <option value="N">비활성</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">전체 등급</option>
          <option value="Y">사장님</option>
          <option value="N">일반회원</option>
        </select>

        <input
          type="text"
          placeholder="아이디·이름·닉네임·이메일 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-md focus:outline-none"
        />

        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
        >
          검색
        </button>
      </form>

      {/* 유저 테이블 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">아이디</th>
              <th className="px-4 py-2 text-left">이름</th>
              <th className="px-4 py-2 text-left">닉네임</th>
              <th className="px-4 py-2 text-left">이메일</th>
              <th className="px-4 py-2 text-center">상태</th>
              <th className="px-4 py-2 text-center">등급</th>
              <th className="px-4 py-2 text-center">•••</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  조회된 유저가 없습니다.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isOpen = openMenuId === u.memberNo;
                const btnRect =
                  buttonRefs.current[u.memberNo] &&
                  buttonRefs.current[u.memberNo].getBoundingClientRect();
                return (
                  <tr
                    key={u.memberNo}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{u.memberId}</td>
                    <td className="px-4 py-3">{u.memberName}</td>
                    <td className="px-4 py-3">{u.memberNickName}</td>
                    <td className="px-4 py-3">{u.memberEmail}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
                          u.isActive === "Y"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.isActive === "Y" ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
                          u.isStoreOwner === "Y"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.isStoreOwner === "Y" ? "사장님" : "일반회원"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        ref={(el) => (buttonRefs.current[u.memberNo] = el)}
                        onClick={() =>
                          setOpenMenuId((prev) =>
                            prev === u.memberNo ? null : u.memberNo
                          )
                        }
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <FiMoreVertical size={20} />
                      </button>
                      {isOpen && btnRect && (
                        <DropdownMenu
                          anchorRect={btnRect}
                          onClose={() => setOpenMenuId(null)}
                        >
                          <button
                            onClick={() => {
                              handleStatusToggle(u);
                              setOpenMenuId(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {u.isActive === "Y" ? "비활성화" : "활성화"}
                          </button>
                          <button
                            onClick={() => {
                              handleRoleChange(u);
                              setOpenMenuId(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {u.isStoreOwner === "Y"
                              ? "일반회원으로"
                              : "사장님으로"}
                          </button>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUserManagement;