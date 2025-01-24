import React, { useEffect, useState } from "react";


export const Counter = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log(`현재 카운트 값 : ${count}`)
    }, [count])

    const handleIncrement = () => {
        setCount(count + 1);
    }

    return (
        <div>
            <h1>카운터 예제</h1>
            <p>Count : {count}</p>
            <button onClick={handleIncrement}> + </button>
        </div>
    )
}