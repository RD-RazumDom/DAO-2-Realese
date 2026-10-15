function initSidePanel() {
    var descr = document.getElementById('descr');
    var clBtn = document.getElementById('cl');

    if (!descr || !clBtn) return;

    descr.style.display = 'none';
    descr.style.right = '-265px';
    clBtn.style.display = 'block';
    clBtn.style.right = '0px';
    clBtn.value = '>>';
}

var rt;
var tid;
var isAnimating = false;

function oc() {
    if (isAnimating) return;

    var descr = document.getElementById('descr');
    var clBtn = document.getElementById('cl');

    if (!descr || !clBtn) return;

    isAnimating = true;

    if (clBtn.value === '>>') {
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

var sd_list = [/*#MD_SD_LIST*/];
var currentVolume = 100;

function onLoad() {
    initSidePanel();
    initFileList();
    initVolumeControl();
    initEventListeners();
}

function initFileList() {
    const fileSelect = document.getElementById('sd_listing');

    if (!fileSelect) return;

    fileSelect.innerHTML = '';

    if (Array.isArray(sd_list)) {
        sd_list.forEach(function(file) {
            if (file) {
                const option = new Option(file, file);
                fileSelect.add(option);
            }
        });
    }

    fileSelect.ondblclick = function() {
        if (this.selectedIndex < 0) return;
        const selectedFile = this.options[this.selectedIndex].value;
        const sourceInput = document.getElementById('source_url');
        if (sourceInput) sourceInput.value = 'sd://' + selectedFile;
        onPlay();
    };
}

function initVolumeControl() {
    const volumeSlider = document.getElementById('volume');
    if (!volumeSlider) return;

    const rawVolume = /*#MD_VOLUME*/ 100;
    const parsed = parseInt(rawVolume, 10);
    currentVolume = Number.isFinite(parsed) ? Math.min(254, Math.max(0, parsed)) : 100;
    volumeSlider.value = currentVolume;
    updateVolumeIndicator(currentVolume);
}

function initEventListeners() {
    const clBtn = document.getElementById('cl');
    const volumeSlider = document.getElementById('volume');

    if (clBtn && !clBtn.dataset.listenerAttached) {
        clBtn.addEventListener('click', oc);
        clBtn.dataset.listenerAttached = '1';
    }

    if (volumeSlider && !volumeSlider.dataset.listenerAttached) {
        volumeSlider.addEventListener('change', function() {
            setVolume(this.value);
        });
        volumeSlider.dataset.listenerAttached = '1';
    }
}

// запросы для плеера
function onPlay() {
    const sourceInput = document.getElementById('source_url');
    if (!sourceInput) return;

    const sourceUrl = sourceInput.value;
    if (sourceUrl) {
        httpGetAsync('/play.cgi?url=' + encodeURIComponent(sourceUrl), null);
        showNotification('Воспроизведение начато');
    } else {
        showNotification('Укажите источник для воспроизведения', true);
    }
}

function onPause() {
    const sourceInput = document.getElementById('source_url');
    if (!sourceInput) return;

    const sourceUrl = sourceInput.value;
    httpGetAsync('/pause.cgi?url=' + encodeURIComponent(sourceUrl), null);
    showNotification('Воспроизведение приостановлено');
}

function onStop() {
    httpGetAsync('/stop.cgi', null);
    showNotification('Воспроизведение остановлено');
}

// слайдер громкости
function setVolume(value) {
    currentVolume = parseInt(value, 10);
    if (!Number.isFinite(currentVolume)) currentVolume = 0;
    if (currentVolume < 0) currentVolume = 0;
    if (currentVolume > 254) currentVolume = 254;
    httpGetAsync('/volume.cgi?val=' + currentVolume, null);
    updateVolumeIndicator(currentVolume);
}

function updateVolumeIndicator(value) {
    const indicator = document.getElementById('volume-percentage');
    if (indicator) indicator.textContent = value + '%';
}

var activeNotifications = {};

function showNotification(message, isError) {
    if (activeNotifications[message]) return;
    activeNotifications[message] = true;

    const notification = document.createElement('div');
    notification.className = 'notification' + (isError ? ' error' : '');
    notification.textContent = message;
    document.body.appendChild(notification);

    if (isError) console.warn(message);

    requestAnimationFrame(function() {
        notification.classList.add('show');
        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                delete activeNotifications[message];
            }, 300);
        }, 3000);
    });
}

function httpGetAsync(theUrl, callback) {
    const xmlHttp = new XMLHttpRequest();
    let notified = false;

    function notifyOnce(msg) {
        if (notified) return;
        notified = true;
        showNotification(msg, true);
    }

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200 && callback) {
                callback(xmlHttp.responseText);
            } else if (xmlHttp.status !== 0 && xmlHttp.status !== 200) {
                notifyOnce('Ошибка запроса: ' + xmlHttp.statusText);
            }
        }
    };
    xmlHttp.onerror = function() {
        notifyOnce('Сетевая ошибка');
    };
    xmlHttp.open('GET', theUrl, true);
    xmlHttp.send(null);
}

window.addEventListener('DOMContentLoaded', onLoad);