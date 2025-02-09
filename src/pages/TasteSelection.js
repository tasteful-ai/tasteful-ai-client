import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchTasteCategories, updateTasteCategory } from "../store/slices/tasteSlice";
import "../styles/TasteSelection.css";

const TasteSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux에서 데이터 가져올 때 기본값 설정 (undefined 방지)
  const {
    genres = [],
    likeFoods = [],
    dislikeFoods = [],
    dietaryPreferences = [],
    spicyLevel = null,
  } = useSelector((state) => state.taste);

  const [step, setStep] = useState(1);

  // 선택된 값들 상태
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLikeFoods, setSelectedLikeFoods] = useState([]);
  const [selectedDislikeFoods, setSelectedDislikeFoods] = useState([]);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState([]);
  const [selectedSpicyLevel, setSelectedSpicyLevel] = useState(null);

  const maxSelections = 5;

  // 취향 데이터 불러오기
  useEffect(() => {
    dispatch(fetchTasteCategories()).then((result) => {
      const tasteData = result.payload;

      // 데이터가 없을 경우 예외 처리
      if (!tasteData) {
        console.error("취향 데이터를 불러오지 못했습니다.");
        return;
      }

      if (
        (!tasteData.genres?.length || tasteData.genres.length === 0) &&
        (!tasteData.likeFoods?.length || tasteData.likeFoods.length === 0) &&
        (!tasteData.dislikeFoods?.length || tasteData.dislikeFoods.length === 0) &&
        (!tasteData.dietaryPreferences?.length || tasteData.dietaryPreferences.length === 0) &&
        tasteData.spicyLevel === null &&
        location.state?.fromMypage !== true
      ) {
        navigate("/taste-selection");
      }
    });
  }, [dispatch, navigate, location]);

  // Redux에서 불러온 데이터 상태에 반영
  useEffect(() => {
    setSelectedGenres(genres);
    setSelectedLikeFoods(likeFoods);
    setSelectedDislikeFoods(dislikeFoods);
    setSelectedDietaryPreferences(dietaryPreferences);
    setSelectedSpicyLevel(spicyLevel);
  }, [genres, likeFoods, dislikeFoods, dietaryPreferences, spicyLevel]);

  // 선택 토글 함수
  const toggleSelection = (selected, setSelected, item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else if (selected.length < maxSelections) {
      setSelected([...selected, item]);
    } else {
      alert(`최대 ${maxSelections}개까지만 선택할 수 있습니다.`);
    }
  };

  // 다음 스텝 처리
  const handleNext = () => {
    let category = "";
    let requestData = {};

    switch (step) {
      case 1:
        category = "genres";
        requestData = { genres: selectedGenres };
        break;
      case 2:
        category = "likeFoods";
        requestData = { likeFoods: selectedLikeFoods };
        break;
      case 3:
        category = "dislikeFoods";
        requestData = { dislikeFoods: selectedDislikeFoods };
        break;
      case 4:
        category = "dietaryPreferences";
        requestData = { dietaryPreferences: selectedDietaryPreferences };
        break;
      case 5:
        category = "spicyLevel";
        requestData = { spicyLevel: selectedSpicyLevel || null };
        break;
      default:
        return;
    }

    if (step !== 5 && (!requestData[category] || requestData[category].length === 0)) {
      alert("취향을 1개 이상 선택해주세요.");
      return;
    }

    dispatch(updateTasteCategory({ category, data: requestData }))
      .then((result) => {
        if (result.error) {
          alert("저장 중 오류가 발생했습니다: " + result.error.message);
        } else {
          if (step < 5) {
            setStep(step + 1);
          } else {
            alert("취향이 저장되었습니다!");
            navigate("/");
          }
        }
      });
  };

  return (
    <div className="taste-selection">
      {step === 1 && (
        <>
          <h2>선호하는 음식 장르를 선택하세요</h2>
          <div className="tag-container">
            {["한식", "양식", "일식", "중식", "아시안", "멕시칸", "분식"].map((item) => (
              <button
                key={item}
                className={`tag ${selectedGenres.includes(item) ? "selected" : ""}`}
                onClick={() => toggleSelection(selectedGenres, setSelectedGenres, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2>좋아하는 음식을 선택하세요</h2>
          <div className="tag-container">
            {["찌개", "치킨", "피자", "고기", "샐러드"].map((item) => (
              <button
                key={item}
                className={`tag ${selectedLikeFoods.includes(item) ? "selected" : ""}`}
                onClick={() => toggleSelection(selectedLikeFoods, setSelectedLikeFoods, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2>싫어하는 음식을 선택하세요</h2>
          <div className="tag-container">
            {["순대", "닭발", "고기", "파스타", "곱창"].map((item) => (
              <button
                key={item}
                className={`tag ${selectedDislikeFoods.includes(item) ? "selected" : ""}`}
                onClick={() => toggleSelection(selectedDislikeFoods, setSelectedDislikeFoods, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h2>식단 성향을 선택하세요</h2>
          <div className="tag-container">
            {["저탄고지", "다이어트", "비건"].map((item) => (
              <button
                key={item}
                className={`tag ${selectedDietaryPreferences.includes(item) ? "selected" : ""}`}
                onClick={() => toggleSelection(selectedDietaryPreferences, setSelectedDietaryPreferences, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <h2>매운 정도를 선택하세요</h2>
          <div className="spicy-container">
            {["순한 맛", "보통", "매운 맛", "아주 매운 맛"].map((level, index) => (
              <button
                key={level}
                className={`spicy-button ${selectedSpicyLevel === index + 1 ? "selected" : ""}`}
                onClick={() => setSelectedSpicyLevel(index + 1)}
              >
                {level}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="button-group">
        <button onClick={handleNext} className="next-button">
          {step === 5 ? "완료" : "다음"}
        </button>
      </div>
    </div>
  );
};

export default TasteSelection;
