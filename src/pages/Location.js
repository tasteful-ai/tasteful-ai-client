import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { loadKakaoMap } from "../utils/kakaoLoader";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/Location.css";

const Location = () => {
  const navigate = useNavigate();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [placesList, setPlacesList] = useState([]);
  const [currentInfowindow, setCurrentInfowindow] = useState(null);
  const alertShown = useRef(false);

  // ✅ 모달 상태 추가 (채팅과 동일한 방식)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // "alert", "error"

  const handleClose = () => setShowModal(false);
  const handleShow = (message, type = "alert") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken && !alertShown.current) {
      alertShown.current = true;
      handleShow("로그인이 필요합니다.", "alert");
    } else {
      loadKakaoMap()
        .then(() => {
          console.log("✅ 카카오 맵 API 로드 완료 (Location.js)");
          setIsKakaoLoaded(true);
        })
        .catch((error) => console.error(error));
    }
  }, [navigate]);

  useEffect(() => {
    if (isKakaoLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setCurrentPosition(userLocation);
          console.log("📍 현재 위치:", userLocation);

          const mapContainer = document.getElementById("map");
          const mapOption = {
            center: userLocation,
            level: 3,
          };
          const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
          setMap(kakaoMap);

          new window.kakao.maps.Marker({
            position: userLocation,
            map: kakaoMap,
            title: "내 위치",
          });
        },
        (error) => {
          console.error("❌ 위치 정보를 가져올 수 없습니다.", error);
          handleShow("위치 정보를 가져올 수 없습니다. 기본 위치(서울)로 설정합니다.", "error");
          const defaultLocation = new window.kakao.maps.LatLng(37.5665, 126.9780);
          setCurrentPosition(defaultLocation);
        }
      );
    }
  }, [isKakaoLoaded]);

  const searchPlaces = (keyword) => {
    console.log(`🔍 '${keyword}' 검색 실행`);

    if (!isKakaoLoaded || !window.kakao || !window.kakao.maps) {
      handleShow("❌ 카카오 맵 API가 아직 로드되지 않았습니다.", "error");
      return;
    }

    if (!currentPosition) {
      handleShow("❌ 현재 위치 정보를 가져오지 못했습니다. 기본 위치에서 검색합니다.", "error");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log("✅ 검색 결과:", data);
          displayMarkers(data);
          setPlacesList(data);
        } else {
          handleShow("❌ 검색된 결과가 없습니다.", "error");
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
      handleShow("❌ 지도 객체가 없습니다.", "error");
      return;
    }

    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const newMarkers = places.map((place, index) => {
      const position = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: place.place_name,
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${index + 1}. ${place.place_name}</div>`,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (currentInfowindow) {
          currentInfowindow.close();
        }

        infowindow.open(map, marker);
        setCurrentInfowindow(infowindow);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const goToCurrentLocation = () => {
    if (!currentPosition) {
      handleShow("위치 정보를 가져올 수 없습니다.", "error");
      return;
    }
    map.setCenter(currentPosition);
    map.setLevel(5);
  };

  const goToMarker = (index) => {
    if (markers[index]) {
      map.setCenter(markers[index].getPosition());
      map.setLevel(3);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${index + 1}. ${placesList[index].place_name}</div>`,
      });

      infowindow.open(map, markers[index]);

      if (currentInfowindow) {
        currentInfowindow.close();
      }
      setCurrentInfowindow(infowindow);
    }
  };

  return (
    <div className="location-container">
      <header>
        <h1>가까운 맛집, 지금 바로 확인해보세요! 🍽</h1>
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

      {/* ✅ 모달 컴포넌트 (채팅과 동일한 스타일) */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          {modalType === "alert" && (
            <Button variant="primary" onClick={() => navigate("/login")}>
              로그인
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Location;
