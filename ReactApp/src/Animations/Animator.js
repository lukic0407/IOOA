import React, { useEffect, useRef } from "react";
import lottie from 'lottie-web';
const Animator = (props) => {
    const anime = useRef(null);

    useEffect(() => {
        const {loop,animation} = props;
        console.log(typeof(loop));

        lottie.loadAnimation({
            container: anime.current,
            renderer: 'svg',
            loop: loop,
            autoplay: true,
            animationData: animation,
        })
    },[]);
return <div ref={anime}></div>;
}

export default Animator;