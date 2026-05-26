// Theme switching functionality
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update checkbox state
    const toggleCheckbox = document.getElementById('theme-toggle');
    if (toggleCheckbox) {
        toggleCheckbox.checked = newTheme === 'dark';
    }
}

function checkTheme() {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set theme based on saved preference or device preference
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update checkbox state
    const toggleCheckbox = document.getElementById('theme-toggle');
    if (toggleCheckbox) {
        toggleCheckbox.checked = theme === 'dark';
        toggleCheckbox.addEventListener('change', toggleTheme);
    }
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkTheme();
});

function initSidePanel() {
  var descr = document.getElementById('descr');
  var clBtn = document.getElementById('cl');
  
  descr.style.display = 'none';
  clBtn.style.display = 'block';
  clBtn.style.right = '2px';
  descr.style.right = '-245px';
}

var rt;
var tid;
var isAnimating = false;

function oc() {
  if (isAnimating) return;
  isAnimating = true;
  
  var descr = document.getElementById('descr');
  var clBtn = document.getElementById('cl');
  
  if (clBtn.value == '>>') {
    // Выдвигаем описание
    descr.style.display = 'block';
    rt = -265;
    
    tid = setInterval(function() {
      rt += 5;
      descr.style.right = rt + 'px';
      clBtn.style.right = (rt + 245) + 'px';
      
      if (rt >= 0) {
        clearInterval(tid);
        clBtn.value = '<<';
        descr.style.right = '0px';
        clBtn.style.right = '245px';
        isAnimating = false;
      }
    }, 5);
  } else {
    rt = 0;
    
    tid = setInterval(function() {
      rt -= 5;
      descr.style.right = rt + 'px';
      clBtn.style.right = (rt + 245) + 'px';
      
      if (rt <= -265) {
        clearInterval(tid);
        clBtn.value = '>>';
        descr.style.display = 'none';
        clBtn.style.right = '0px';
        isAnimating = false;
      }
    }, 5);
  }
}

var sd_list = [/*#MD_SD_LIST*/ null];
var isSidebarVisible = false;
var currentVolume = 100;

function onLoad() {
    initSidePanel();
    initFileList();
    initVolumeControl();
    initEventListeners();
    checkTheme();
}

function initFileList() {
    const fileSelect = document.getElementById('sd_listing');
    
    fileSelect.innerHTML = '';
    
    sd_list.forEach(file => {
        if (file) {
            const option = new Option(file, file);
            fileSelect.add(option);
        }
    });
    
    fileSelect.ondblclick = function() {
        const selectedFile = this.options[this.selectedIndex].value;
        document.getElementById('source_url').value = "sd://" + selectedFile;
        onPlay();
    };
}

function initVolumeControl() {
    const volumeSlider = document.getElementById('volume');
    
    currentVolume = Math.round((/*#MD_VOLUME*/ 1));
    volumeSlider.value = currentVolume;
    updateVolumeIndicator(currentVolume);
}

function initEventListeners() {
    document.getElementById('cl').addEventListener('click', oc);
    
    document.getElementById('volume').addEventListener('input', function() {
        setVolume(this.value);
    });
}


// запросы для плеера
function onPlay() {
    const sourceUrl = document.getElementById("source_url").value;
    if (sourceUrl) {
        httpGetAsync("/play.cgi?url=" + encodeURIComponent(sourceUrl), null);
        showNotification("Воспроизведение начато");
    } else {
        showNotification("Укажите источник для воспроизведения", true);
    }
}

function onPause() {
    const sourceUrl = document.getElementById("source_url").value;
    httpGetAsync("/pause.cgi?url=" + encodeURIComponent(sourceUrl), null);
    showNotification("Воспроизведение приостановлено");
}

function onStop() {
    httpGetAsync("/stop.cgi", null);
    showNotification("Воспроизведение остановлено");
}


// слайдер громкости
function setVolume(value) {
    currentVolume = parseInt(value);
    
    const serverValue = Math.round((currentVolume / 100));
    httpGetAsync("/volume.cgi?val=" + serverValue, null);
    updateVolumeIndicator(currentVolume);
}

function updateVolumeIndicator(value) {
    document.getElementById('volume-percentage').textContent = value + '%';
}

function toggleSidebar() {
    const sidebar = document.getElementById('descr');
    const button = document.getElementById('cl');
    
    isSidebarVisible = !isSidebarVisible;
    
    if (isSidebarVisible) {
        sidebar.style.right = '0';
        button.style.right = '100px';
        button.value = '<<';
    } else {
        sidebar.style.right = '-100px';
        button.style.right = '0';
        button.value = '>>';
    }
}

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification' + (isError ? ' error' : '');
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }, 10);
}

function httpGetAsync(theUrl, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200 && callback) {
                callback(xmlHttp.responseText);
            } else if (xmlHttp.status !== 200) {
                showNotification("Ошибка запроса: " + xmlHttp.statusText, true);
            }
        }
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function checkTheme() {
    // Реализация зависит от вашего theme.js
    // Например: applyTheme(localStorage.getItem('theme') || 'light');
}

window.addEventListener('DOMContentLoaded', onLoad);