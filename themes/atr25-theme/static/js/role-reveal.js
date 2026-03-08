(function() {
    // 1. Scoped CSS Injection
    var style = document.createElement('style');
    style.textContent = `
        .secora-loader-overlay {
            position: fixed;
            inset: 0;
            z-index: 999999;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: secoraFadeIn 1s ease-out;
        }
        .secora-loader-overlay.fade-out {
            animation: secoraFadeOut 1s ease-in forwards;
        }
        @keyframes secoraFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes secoraFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .secora-loader-img {
            width: 200px;
            opacity: 0;
            animation: secoraImgFade 2s ease-out forwards;
        }
        @keyframes secoraImgFade {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        .secora-loader-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 4rem;
            font-weight: bold;
            color: #C51111;
            text-shadow: 0 0 20px rgba(197, 17, 17, 0.8), 0 0 40px rgba(197, 17, 17, 0.5);
            margin-top: 30px;
            opacity: 0;
            animation: secoraTitleFade 2s ease-out 0.5s forwards;
        }
        @keyframes secoraTitleFade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .secora-loader-subtitle {
            font-family: 'Fredoka One', sans-serif;
            font-size: 1.8rem;
            color: #fff;
            margin-top: 20px;
            min-height: 2rem;
        }
        .secora-cursor {
            display: inline-block;
            width: 3px;
            height: 1.8rem;
            background: #fff;
            margin-left: 5px;
            animation: secoraBlink 0.7s infinite;
        }
        @keyframes secoraBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // 2. DOM Structure
    var overlay = document.createElement('div');
    overlay.className = 'secora-loader-overlay';

    var img = document.createElement('img');
    img.className = 'secora-loader-img';
    img.src = '/themes/atr25-theme/static/img/crew-red.png';

    var title = document.createElement('h1');
    title.className = 'secora-loader-title';
    title.textContent = 'SECORA CTF';

    var subtitle = document.createElement('p');
    subtitle.className = 'secora-loader-subtitle';

    overlay.appendChild(img);
    overlay.appendChild(title);
    overlay.appendChild(subtitle);
    document.body.appendChild(overlay);

    // 3. Typewriter Effect
    var fullText = 'There are 45 Flags among us...';
    var cursor = document.createElement('span');
    cursor.className = 'secora-cursor';
    subtitle.appendChild(cursor);

    var index = 0;
    function typeWriter() {
        if (index < fullText.length) {
            subtitle.textContent = fullText.substring(0, index + 1);
            subtitle.appendChild(cursor);
            index++;
            setTimeout(typeWriter, 80);
        }
    }

    // Start typewriter after 2.5 seconds
    setTimeout(typeWriter, 2500);

    // 4. Cleanup Sequence
    setTimeout(function() {
        overlay.className = 'secora-loader-overlay fade-out';
        setTimeout(function() {
            overlay.remove();
            style.remove();
        }, 1000);
    }, 7000);
})();
