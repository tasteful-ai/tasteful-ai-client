import React from "react";

const SampleView = () => {
    return (
        <div>
            나는 샘플뷰
        </div>
    )
}

export const SamplePage = () => {
    return (
        <div>
            <h1>샘플페이지1</h1>
            <p>이곳은 샘플페이지 입니다.</p>
            <SampleView />
            <SampleView />
            <SampleView />
            <SampleView />
        </div>
    )
}
