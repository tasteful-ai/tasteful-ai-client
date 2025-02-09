import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchTasteCategories, updateTasteCategory } from "../store/slices/tasteSlice";
import "../styles/TasteSelection.css";

const TasteSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { genres, likeFoods, dislikeFoods, dietaryPreferences, spicyLevel } = useSelector((state) => state.taste);
  const [step, setStep] = useState(1);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLikeFoods, setSelectedLikeFoods] = useState([]);
  const [selectedDislikeFoods, setSelectedDislikeFoods] = useState([]);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState([]);
  const [selectedSpicyLevel, setSelectedSpicyLevel] = useState(null);

  const maxSelections = 5;

  useEffect(() => {
    dispatch(fetchTasteCategories()).then((result) => {
      const tasteData = result.payload;

      if (
        tasteData &&
        !tasteData.genres.length &&
        !tasteData.likeFoods.length &&
        !tasteData.dislikeFoods.length &&
        !tasteData.dietaryPreferences.length &&
        tasteData.spicyLevel === null &&
        location.state?.fromMypage !== true
      ) {
        navigate("/taste-selection");
      }
    });
  }, [dispatch, navigate, location]);

  useEffect(() => {
    setSelectedGenres(genres);
    setSelectedLikeFoods(likeFoods);
    setSelectedDislikeFoods(dislikeFoods);
    setSelectedDietaryPreferences(dietaryPreferences);
    setSelectedSpicyLevel(spicyLevel);
  }, [genres, likeFoods, dislikeFoods, dietaryPreferences, spicyLevel]);

  const toggleSelection = (selected, setSelected, item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else if (selected.length < maxSelections) {
      setSelected([...selected, item]);
    } else {
      alert(`최대 ${maxSelections}개까지만 선택할 수 있습니다.`);
    }
  };

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
        break;
    }

    if (step !== 5 && requestData[category].length === 0) {
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

  const handleSkip = () => {
    switch (step) {
      case 1:
        setSelectedGenres([]);
        break;
      case 2:
        setSelectedLikeFoods([]);
        break;
      case 3:
        setSelectedDislikeFoods([]);
        break;
      case 4:
        setSelectedDietaryPreferences([]);
        break;
      case 5:
        setSelectedSpicyLevel(null);
        break;
      default:
        break;
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="taste-selection">
      {step === 1 && (
        <>
          <h2>선호하는 음식 장르가 있나요?</h2>
          <div className="tag-container">
            {["한식", "양식", "일식", "중식", "아시안", "멕시칸", "분식", "패스트푸드", "도시락", "야식", "디저트", "커피", "주류"].map((item) => (
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
          <h2>좋아하는 음식을 알려주세요!</h2>
          <div className="tag-container">
            {["찌개", "치킨", "피자", "고기", "샐러드", "냉면", "족발", "보쌈", "파스타", "돈까스", "덮밥", "스시", "카레", "햄버거", "국밥", "라면", "떡볶이"].map((item) => (
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
          <h2>싫어하는 음식을 알려주세요!</h2>
          <div className="tag-container">
            {["순대", "닭발", "치킨", "피자", "고기", "샐러드", "야채", "족발", "보쌈", "어패류", "파스타", "곱창", "해물", "팥", "카레"].map((item) => (
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
          <h2>식단 성향을 알려주세요!</h2>
          <div className="tag-container">
            {["저탄고지", "저속노화", "단짠단짠", "자극적", "느끼느끼", "다이어트", "비건", "유당불내증", "미트러버"].map((item) => (
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
          <h2>매운 정도를 선택하세요!</h2>
          <div className="spicy-container">
            {["1단계 : 맵지 않은 순한 맛", "2단계 : 진라면 순한 맛", "3단계 : 신라면 정도", "4단계 : 불닭볶음면 정도", "5단계 : 핵불닭볶음면 이상!"].map((level, index) => (
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
        {step < 5 && (
          <button onClick={handleSkip} className="skip-button">
            건너뛰기
          </button>
        )}
        <button onClick={handleNext} className="next-button">
          {step === 5 ? "완료" : "다음"}
        </button>
      </div>
    </div>
  );
};

export default TasteSelection;