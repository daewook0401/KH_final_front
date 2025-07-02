import { useEffect, useState } from "react";
import axios from "../api/AxiosInterCeptor";

/**
 * 공통 API 요청 훅
 * @param {string} url - 요청 URL
 * @param {boolean} immediate - mount 시 바로 호출할지 여부
 */
const useApi = (url, options = {}, immediate = true) => {
  const [loading, setLoading] = useState(immediate);
  const [header, setHeader] = useState(null);
  const [body, setBody] = useState(null);
  const [error, setError] = useState(null);
  const fetch = (overrideOptions = {}) => {
    setLoading(true);
    setError(null);

    const config = {
      url,
      method: options.method || "get",
      headers: options.headers || {},
      withCredentials: options.withCredentials || false,
      ...options,
      ...overrideOptions,
    };
    console.log(config);
    const promise = axios(config)
      .then( res => {
          const { header: hd, body: bd } = res.data;
          if (hd.code[0] !== "S") {
            setError(hd.message);
          } else {
            setHeader(hd);
            setBody(bd);
          }
          return res.data;
        })
        .catch(err => {
          const msg =
          err.response?.data?.header?.message ||
          err.response?.data?.message ||
          err.message;
          setError(msg);
        })
    promise.finally(() => setLoading(false));
    return promise;
  };

  useEffect(() => {
    if (immediate) fetch();
  }, [url]);

  return { header, body, error, loading, refetch: fetch };
};

export default useApi;
