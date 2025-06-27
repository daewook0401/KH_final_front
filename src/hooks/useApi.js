import { useEffect, useState } from 'react';
import axios from 'axios';

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
  const API_URL = window.ENV?.API_URL;
  const fetch = (overrideOptions = {}) => {
    setLoading(true);
    setError(null);

    const config = {
      url: API_URL + url,
      method: options.method || 'get',
      headers: {
        ...(options.auth && { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`}),
        ...(options.headers || {})
      },
      withCredentials: options.withCredentials || false,
      ...options,
      ...overrideOptions,
    };
    axios(config).then( res => {
          const { header: hd, body: bd } = res.data;
          if (hd.code[0] !== "S") {
            setError(hd.message);
          } else {
            setHeader(hd);
            setBody(bd);
          }
        })
        .catch(error => {
          console.error(error);
          setError(error.response.data);
        })
        .finally(() => {
          setLoading(false);
        });
  };

  useEffect(() => {
    if (immediate) fetch();
  }, [url]);

  return { header, body, error, loading, refetch: fetch };
};

export default useApi;