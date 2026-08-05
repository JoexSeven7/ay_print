// ============================================
// HERO VIDEO SLIDESHOW + INTERACTIVE HOTSPOTS
// ============================================

const heroVideos = [
    'videos/realestvid3.mp4',
    'videos/realestvid2.mp4'
];

const CROSSFADE_DURATION = 1000;
const VIDEO_SWITCH_INTERVAL = 4000;

let currentVideoIndex = 0;
let activeVideoEl = null;
let inactiveVideoEl = null;
let slideshowTimer = null;

// ---- Hotspot Data ----
const heroHotspots = [
    {
        id: 'pool',
        top: '85%',
        left: '85%',
        icon: 'fa-swimming-pool',
        title: 'Private Infinity Pool',
        desc: 'Temperature-controlled pool with panoramic garden views.'
    },
    {
        id: 'kitchen',
        top: '48%',
        left: '22%',
        icon: 'fa-utensils',
        title: "Chef's Kitchen",
        desc: 'Fully equipped with premium appliances and marble countertops.'
    },
    {
        id: 'view',
        top: '35%',
        left: '90%',
        icon: 'fa-mountain-sun',
        title: 'Scenic Lekki Views',
        desc: 'Unobstructed views of the peninsula from the master suite.'
    },
    {
        id: 'security',
        top: '75%',
        left: '10%',
        icon: 'fa-shield-halved',
        title: '24/7 Smart Security',
        desc: 'CCTV surveillance, perimeter fencing, and access control.'
    }
];

// ---- Video Crossfade Logic ----
function initHeroSlideshow() {
    const videoA = document.getElementById('heroVideoA');
    const videoB = document.getElementById('heroVideoB');
    
    if (!videoA || !videoB) return;
    if (heroVideos.length === 0) return;

    activeVideoEl = videoA;
    inactiveVideoEl = videoB;

    // Set initial video
    activeVideoEl.src = heroVideos[0];
    activeVideoEl.classList.add('opacity-100');
    activeVideoEl.classList.remove('opacity-0');
    
    activeVideoEl.play().catch(() => {
        // Autoplay blocked — poster fallback already set in HTML
        console.warn('Hero video autoplay blocked; static poster displayed.');
    });

    startSlideshow();

    // Pause when tab is hidden to save bandwidth
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseSlideshow();
        } else {
            startSlideshow();
            if (activeVideoEl) activeVideoEl.play().catch(() => {});
        }
    });
}

function startSlideshow() {
    stopSlideshow();
    if (heroVideos.length > 1) {
        slideshowTimer = setInterval(switchVideo, VIDEO_SWITCH_INTERVAL);
    }
}

function pauseSlideshow() {
    clearInterval(slideshowTimer);
}

function stopSlideshow() {
    if (slideshowTimer) clearInterval(slideshowTimer);
}

function switchVideo() {
    if (!activeVideoEl || !inactiveVideoEl) return;
    if (heroVideos.length <= 1) return;

    currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;

    inactiveVideoEl.src = heroVideos[currentVideoIndex];
    inactiveVideoEl.load();

    // Crossfade
    inactiveVideoEl.classList.remove('opacity-0');
    inactiveVideoEl.classList.add('opacity-100');
    
    activeVideoEl.classList.remove('opacity-100');
    activeVideoEl.classList.add('opacity-0');

    setTimeout(() => {
        const temp = activeVideoEl;
        activeVideoEl = inactiveVideoEl;
        inactiveVideoEl = temp;
        activeVideoEl.play().catch(() => {});
    }, CROSSFADE_DURATION);
}

// ---- Hotspot Logic ----
function initHeroHotspots() {
    const container = document.getElementById('hotspotsContainer');
    if (!container) return;

    // Hide on mobile/touch devices for better UX
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        container.style.display = 'none';
        return;
    }

    container.innerHTML = heroHotspots.map(spot => `
        <div class="hero-hotspot" style="top: ${spot.top}; left: ${spot.left};" aria-label="${escapeAttr(spot.title)}">
            <i class="fas ${spot.icon} text-xs text-[#8b2635] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
            <div class="hero-hotspot-card">
                <h4><i class="fas ${spot.icon}"></i> ${escapeHtml(spot.title)}</h4>
                <p>${escapeHtml(spot.desc)}</p>
            </div>
        </div>
    `).join('');
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlideshow();
    initHeroHotspots();
});