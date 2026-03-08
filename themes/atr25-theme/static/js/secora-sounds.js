// Click Sound
const clickSound = new Audio('/themes/atr25-theme/static/sounds/click.mp3');
clickSound.volume = 0.3;
document.addEventListener('click', function(e) {
  const tag = e.target.tagName;
  if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT') {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }
}, true);
document.addEventListener('shown.bs.modal', function(e) {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
});

// Intro Sound
const introSound = new Audio('/themes/atr25-theme/static/sounds/intro.mp3');
introSound.volume = 0.5;

// Background Music
const bgm = new Audio('/themes/atr25-theme/static/sounds/bgm.mp3');
bgm.loop = true;
bgm.volume = 0.3;
document.addEventListener('click', function() {
  if (bgm.paused) { bgm.play().catch(function(){}); }
}, { once: true });

// Wrong Flag Sound
const wrongSound = new Audio('/themes/atr25-theme/static/sounds/wrong.mp3');
wrongSound.volume = 0.5;

(function() {
  var originalFetch = window.fetch;
  window.fetch = function(url, options) {
    var isFlagSubmit = options && options.method === 'POST' && url && url.includes('api/challenges');
    
    return originalFetch.apply(this, arguments).then(function(response) {
      if (isFlagSubmit) {
        response.clone().json().then(function(data) {
          if (data && data.data && data.data.status === 'incorrect') {
            wrongSound.currentTime = 0;
            wrongSound.play().catch(function(){});
          }
        }).catch(function(){});
      }
      return response;
    });
  };
})();

// Role Reveal Loading Screen
(function() {
  var path = window.location.pathname;
  if(path !== '/' && path !== '/index') return;
  
  // CSS
  var s = document.createElement('style');
  s.textContent = '.secora-loader-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center}.secora-loader-overlay.fade-out{opacity:0;transition:opacity 1s}.secora-loader-img{width:200px;animation:fadeIn 1s}.secora-loader-title{color:#C51111;font-size:3em;font-family:Orbitron,sans-serif;text-shadow:0 0 20px #C51111;margin:20px 0;animation:glow 1.5s infinite alternate}.secora-loader-text{color:#22C55E;font-size:1.5em;font-family:Courier New,monospace}@keyframes glow{from{text-shadow:0 0 10px #C51111}to{text-shadow:0 0 30px #C51111,0 0 10px #fff}}@keyframes fadeIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}.secora-loader-overlay *{animation:none}';
  document.head.appendChild(s);
  
  // HTML
  var o = document.createElement('div');
  o.className = 'secora-loader-overlay';
  o.innerHTML = '<img src=/themes/atr25-theme/static/img/role-reveal.png class=secora-loader-img><div class=secora-loader-title>SECORA CTF</div><div class=secora-loader-text></div>';
  document.body.appendChild(o);
  
  introSound.play().catch(function(){});
  
  var p = o.querySelector('.secora-loader-text');
  var c = document.createElement('span');
  c.textContent = '_';
  var idx = 0;
  function tw(text) {
    if(idx < text.length) {
      p.textContent = text.substring(0, idx+1);
      p.appendChild(c);
      idx++;
      setTimeout(function() { tw(text); }, 80);
    }
  }
  
  fetch('/api/v1/challenges')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var count = d.data ? d.data.length : 5;
      setTimeout(function() { tw('There are ' + count + ' Flags among us...'); }, 2500);
    })
    .catch(function() {
      setTimeout(function() { tw('There are 5 Flags among us...'); }, 2500);
    });
  
  setTimeout(function() {
    o.className = 'secora-loader-overlay fade-out';
    setTimeout(function() { o.remove(); s.remove(); }, 1000);
  }, 7000);
})();

// Transparent Navbar
(function() {
  var s = document.createElement('style');
  s.textContent = '.navbar { background: rgba(0,0,0,0.7) !important; backdrop-filter: blur(10px); }';
  document.head.appendChild(s);
})();

// Stars Background
(function() {
  var s = document.createElement('style');
  s.textContent = 'body { background: #03040b; } .stars-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1; } .star { position: absolute; background: #fff; border-radius: 50%; animation: twinkle 3s infinite; } @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }';
  document.head.appendChild(s);
  
  var sb = document.createElement('div');
  sb.className = 'stars-bg';
  for(var i = 0; i < 80; i++) {
    var star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
    star.style.animationDelay = Math.random() * 3 + 's';
    sb.appendChild(star);
  }
  document.body.appendChild(sb);
})();

// Force transparent navbar
(function() {
  var style = document.createElement('style');
  style.textContent = '.navbar { background: rgba(0,0,0,0.8) !important; backdrop-filter: blur(10px) !important; } .navbar-dark { background: rgba(0,0,0,0.8) !important; }';
  document.head.appendChild(style);
})();
