import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import MakImage from "/src/assets/mak.png";

const { kakao } = window;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  cursor: pointer;
`;

const KakaoMap = ({ lat, lng, name }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!lat || !lng || !mapRef.current) return;

    const latitude = Number(lat);
    const longitude = Number(lng);

    const mapOption = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 4,
    };

    const map = new kakao.maps.Map(mapRef.current, mapOption);
    const imageSize = new kakao.maps.Size(85, 85);
    const markerImage = new kakao.maps.MarkerImage(MakImage, imageSize);
    const marker = new kakao.maps.Marker({
      position: map.getCenter(),
      image: markerImage,
    });
    marker.setMap(map);
  }, [lat, lng]);

  const handleMapClick = () => {
    if (!name || !lat || !lng) return;
    const encodedName = encodeURIComponent(name);
    const url = `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`;

    window.open(url, "_blank");
  };

  return <MapContainer ref={mapRef} onClick={handleMapClick} />;
};

export default KakaoMap;
