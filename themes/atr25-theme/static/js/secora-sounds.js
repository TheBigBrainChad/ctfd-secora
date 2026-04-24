(function() {
    if (window.bgmInitialized) return;
    window.bgmInitialized = true;

    const bgm = new Audio('/themes/atr25-theme/static/sounds/amogus.mp3');
    bgm.loop = true;
    bgm.volume = 0.40;

    const isHome = window.location.pathname === '/' || window.location.pathname === '/index';

    let shhAudio = null;
    if (isHome) {
        shhAudio = new Audio('/themes/atr25-theme/static/sounds/intro_v2.mp3');
        shhAudio.volume = 0.8;
    }

    let unlocked = false;
    let bgmTimePassed = !isHome; // If not home, time is already passed (0 delay)
    const delay = isHome ? 7000 : 0;
    
    const attemptBgmPlay = () => {
        bgm.play().catch(e => console.log("BGM blocked by browser."));
    };

    setTimeout(() => {
        bgmTimePassed = true;
        if (unlocked) {
            attemptBgmPlay();
        }
    }, delay);

    const unlockAudio = () => {
        if (!unlocked) {
            unlocked = true;
            
            if (isHome && shhAudio) {
                shhAudio.play().catch(e => console.log("Shh Audio blocked"));
            }

            if (bgmTimePassed) {
                attemptBgmPlay();
            } else {
                // Initialize context cleanly early without looping
                bgm.play().then(() => bgm.pause()).catch(()=>{});
            }
        }
    };

    document.addEventListener('click', unlockAudio, {once: true});
    document.addEventListener('keydown', unlockAudio, {once: true});
    document.addEventListener('touchstart', unlockAudio, {once: true});
})();
