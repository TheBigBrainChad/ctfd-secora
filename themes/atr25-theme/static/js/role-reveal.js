(function() {
    // 1. Scoped CSS Injection
    var style = document.createElement('style');
    style.textContent = `
        .secora-loader-overlay {
            position: fixed;
            inset: 0;
            z-index: 999999;
            background: radial-gradient(circle at center, rgba(139, 0, 0, 0.2) 0%, #000 60%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: secoraBgPulse 3s ease-in-out infinite;
        }
        .secora-loader-overlay.fade-out {
            animation: secoraFadeOut 1s ease-in forwards;
        }
        @keyframes secoraBgPulse {
            0%, 100% { background: radial-gradient(circle at center, rgba(139, 0, 0, 0.15) 0%, #000 60%); }
            50% { background: radial-gradient(circle at center, rgba(139, 0, 0, 0.3) 0%, #000 60%); }
        }
        @keyframes secoraFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .secora-loader-img {
            width: 200px;
            opacity: 0;
            animation: roleReveal 3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards, imgPulse 2s ease-in-out infinite 3s;
        }
        @keyframes roleReveal {
            0% { transform: scale(3); opacity: 0; }
            15% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes imgPulse {
            0%, 100% { filter: drop-shadow(0 0 10px rgba(80, 200, 120, 0.5)); }
            50% { filter: drop-shadow(0 0 25px rgba(80, 200, 120, 0.9)); }
        }
        .secora-loader-title {
            font-family: 'Varela Round', sans-serif;
            font-size: 5rem;
            font-weight: bold;
            color: #ff0000;
            text-shadow: -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 8px 0 rgba(0,0,0,0.8);
            margin-top: 30px;
            opacity: 0;
            animation: roleReveal 3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
            text-align: center;
        }
        .secora-loader-subtitle {
            font-family: 'Varela Round', sans-serif;
            font-size: 1.5rem;
            color: #fff;
            text-shadow: 2px 2px 0 #000;
            margin-top: 20px;
            min-height: 2rem;
            text-align: center;
        }
        .secora-cursor {
            display: inline-block;
            width: 3px;
            height: 1.5rem;
            background: #fff;
            margin-left: 5px;
            animation: secoraBlink 0.7s infinite;
            vertical-align: middle;
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

    // Start typewriter after 3 seconds (title animation finishes)
    setTimeout(typeWriter, 3000);

    // 4. Cleanup Sequence
    setTimeout(function() {
        overlay.className = 'secora-loader-overlay fade-out';
        setTimeout(function() {
            overlay.remove();
            style.remove();
        }, 1000);
    }, 8000);
})();
