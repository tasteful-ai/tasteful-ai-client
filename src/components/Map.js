import React, { useEffect, useRef, useState } from "react";
import { loadKakaoMap } from "../utils/kakaoLoader";

const Map = () => {
  const mapRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadKakaoMap()
      .then((kakao) => {
        console.log("✅ 카카오 맵 API 로드 완료 (Map.js)");
        initMap();
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg("카카오 맵 API를 불러오지 못했습니다.");
      });
  }, []);

  const initMap = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("❌ 카카오 맵 API가 아직 로드되지 않았습니다.");
      return;
    }

    const kakao = window.kakao;
    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.9780),
      level: 3,
    };

    mapRef.current = new kakao.maps.Map(mapContainer, mapOption);
  };

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </div>
  );
};

export default Map;
