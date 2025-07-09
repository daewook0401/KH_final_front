import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../common/Header/Header";
import useApi from "../../../hooks/useApi";
import { idRegex, pwRegex } from "../../../components/Regex";
import { AuthContext } from "../../../provider/AuthContext";
import {
  CustomGoogleLoginForm,
  CustomKakaoLoginForm,
} from "../../../components/Button/CustomLoginForm";

const Login = () => {
  const [formData, setFormData] = useState({
    memberId: "",
    memberPw: "",
    authLogin: "N",
  });
  const [longTimeAuth, setLongTimeAuth] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const {
    header: loginHeader = {},
    body: loginBody = {},
    error: loginError,
    loading: loginLoading,
    refetch: loginApi,
  } = useApi("/api/auth/tokens", { method: "post" }, false) || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgreementChange = (e) => {
    setLongTimeAuth(e.target.checked);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { memberId, memberPw } = formData;

    // 입력 검증
    if (!idRegex.test(memberId)) {
      alert("유효한 아이디 형식이 아닙니다.");
      return;
    }
    if (!pwRegex.test(memberPw)) {
      alert("유효한 비밀번호 형식이 아닙니다.");
      return;
    }

    const authLoginValue = longTimeAuth ? "Y" : "N";

    loginApi({
      withCredentials: true,
      data: {
        memberId,
        memberPw,
        authLogin: authLoginValue,
      },
    })
      .then(({ header = {}, body = {} }) => {
        if (header.code[0] === "S") {
          if (body.items.loginInfo.isActive === "N") {
            alert("비활성화된 계정이거나 정지된 계정입니다.");
            return;
          }
          login(body.items.loginInfo, body.items.tokens, false, longTimeAuth);
          navigate("/");
        } else {
          alert(`로그인 실패: ErrorCode ${header.code}`);
        }
      })
      .catch((err) => {
        alert("로그인 중 오류가 발생했습니다.");
        console.error(err);
      });
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="w-full max-w-sm p-8 space-y-4 bg-white border border-gray-200 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-red-500">
            로그인
          </h1>

          {/* 소셜 로그인 버튼 */}
          <div className="flex flex-col space-y-3">
            <CustomKakaoLoginForm />
            <CustomGoogleLoginForm />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="memberId"
                className="block text-sm font-bold text-gray-700"
              >
                아이디
              </label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-white border-2 border-black focus:outline-none rounded-md"
                placeholder="아이디 입력"
                required
              />
            </div>

            <div>
              <label
                htmlFor="memberPw"
                className="block text-sm font-bold text-gray-700"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="memberPw"
                name="memberPw"
                value={formData.memberPw}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-white border-2 border-black focus:outline-none rounded-md"
                placeholder="비밀번호 입력"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-red-500 hover:bg-red-700 rounded-md"
            >
              로그인
            </button>
          </form>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="agreement"
              checked={longTimeAuth}
              onChange={handleAgreementChange}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label
              htmlFor="agreement"
              className="ml-2 block text-sm text-gray-900"
            >
              로그인 유지
            </label>
          </div>

          <div className="space-y-4 text-sm text-center">
            <div>
              <Link to="/finding-id" className="text-gray-600 hover:underline">
                아이디 찾기
              </Link>
              <span className="mx-2 text-gray-300">|</span>
              <Link
                to="/finding-password"
                className="text-gray-600 hover:underline"
              >
                비밀번호 찾기
              </Link>
            </div>
            <div>
              <p>
                계정이 없으신가요?{" "}
                <Link
                  to="/sign-up"
                  className="font-bold text-red-500 hover:underline"
                >
                  회원가입 하러가기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
