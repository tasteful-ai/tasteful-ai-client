import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { loadKakaoMap } from "../utils/kakaoLoader";
import "../styles/Location.css";

const Location = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [placesList, setPlacesList] = useState([]);
  const [currentInfowindow, setCurrentInfowindow] = useState(null); // 현재 열린 인포윈도우

  useEffect(() => {
    loadKakaoMap()
      .then((kakao) => {
        console.log("✅ 카카오 맵 API 로드 완료 (Location.js)");
        setIsKakaoLoaded(true);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (isKakaoLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setCurrentPosition(userLocation);
          console.log("📍 현재 위치:", userLocation);

          // 지도 객체 생성 (현재 위치 기준)
          const mapContainer = document.getElementById("map");
          const mapOption = {
            center: userLocation,
            level: 3,
          };
          const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
          setMap(kakaoMap);

          // 현재 위치 마커 추가
          new window.kakao.maps.Marker({
            position: userLocation,
            map: kakaoMap,
            title: "내 위치",
          });
        },
        (error) => {
          console.error("❌ 위치 정보를 가져올 수 없습니다.", error);
          const defaultLocation = new window.kakao.maps.LatLng(37.5665, 126.9780);
          setCurrentPosition(defaultLocation);
        }
      );
    }
  }, [isKakaoLoaded]);

  const searchPlaces = (keyword) => {
    console.log(`🔍 '${keyword}' 검색 실행`);

    if (!isKakaoLoaded || !window.kakao || !window.kakao.maps) {
      console.error("❌ 카카오 맵 API가 아직 로드되지 않았습니다.");
      return;
    }

    if (!currentPosition) {
      console.error("❌ 현재 위치 정보를 가져오지 못했습니다. 기본 위치에서 검색합니다.");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log("✅ 검색 결과:", data);
          displayMarkers(data);
          setPlacesList(data); // 검색된 데이터를 placesList 상태에 저장
        } else {
          console.error("❌ 검색 결과 없음");
        }
      },
      {
        location: currentPosition,
        radius: 5000,
        size: 10,
      }
    );
  };

  const displayMarkers = (places) => {
    if (!map) {
      console.error("❌ 지도 객체가 없습니다.");
      return;
    }

    // 기존 마커 삭제
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const newMarkers = places.map((place, index) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: place.place_name,
      });

      // 마커 클릭 시 인포윈도우 토글
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${index + 1}. ${place.place_name}</div>`, // 숫자 추가
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (currentInfowindow) {
          currentInfowindow.close(); // 이전 열린 인포윈도우 닫기
        }

        // 새 인포윈도우 열기
        infowindow.open(map, marker);
        setCurrentInfowindow(infowindow); // 새 인포윈도우 상태로 업데이트
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const goToCurrentLocation = () => {
    if (!currentPosition) {
      alert("위치 정보를 가져올 수 없습니다.");
      return;
    }
    map.setCenter(currentPosition); // 현재 위치로 이동
    map.setLevel(5); // Level 5는 약 250m 정도의 줌 레벨
  };

  const goToMarker = (index) => {
    if (markers[index]) {
      map.setCenter(markers[index].getPosition()); // 해당 마커로 이동
      map.setLevel(3); // 지도 확대

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${index + 1}. ${placesList[index].place_name}</div>`,
      });

      // 해당 마커와 연결된 인포윈도우 열기
      infowindow.open(map, markers[index]);

      // 이전 인포윈도우를 닫고, 새로운 인포윈도우를 열기
      if (currentInfowindow) {
        currentInfowindow.close();
      }
      setCurrentInfowindow(infowindow); // 현재 열린 인포윈도우 상태로 업데이트
    }
  };

  return (
    <div className="location-container">
      <header>
        <h1>가까운 맛집, 지금 바로 확인해보세요!  🍽</h1>
        <SearchBar onSearch={searchPlaces} />
      </header>
      <div className="content-wrapper">
        <div id="map" className="map"></div>
        <div className="places-list">
          <h2>검색된 맛집 목록</h2>
          {placesList.length > 0 ? (
            <ul>
              {placesList.map((place, index) => (
                <li
                  key={index}
                  onClick={() => goToMarker(index)}
                  className="place-item"
                >
                  <strong>{index + 1}. {place.place_name}</strong>
                  <br />
                  {place.address_name}
                  <br />
                  {place.phone || "전화번호 없음"}
                </li>
              ))}
            </ul>
          ) : (
            <p>검색된 맛집이 없습니다.</p>
          )}
        </div>
      </div>
      <button className="current-location-btn" onClick={goToCurrentLocation}>
        현위치로 돌아가기
      </button>
    </div>
  );
};

export default Location;
