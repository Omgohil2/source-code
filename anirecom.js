// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Animate stats on scroll
const animateOnScroll = () => {
    const stats = document.querySelectorAll('.stat h3');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    });

    stats.forEach(stat => {
        stat.style.animationPlayState = 'paused';
        observer.observe(stat);
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe portfolio items and sections
document.querySelectorAll('.portfolio-item, .about, .contact').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
}); 

window.addEventListener('load', animateOnScroll);

const API_KEY = 'AIzaSyCCMHrto2XCcfdFLz6Yk8p9YOlvwaURKEs';
    const CHANNEL_ID = 'UU09Gi59MsLXEfVmJZuItnig'; // Replace with your channel's ID
    const MAX_RESULTS = 3;

    // 1. Convert Channel ID to Upload Playlist ID (Change 'UC' to 'UU')
    const UPLOAD_PLAYLIST_ID = CHANNEL_ID.replace(/^UC/, 'UU');

    async function getLatestVideos() {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOAD_PLAYLIST_ID}&maxResults=${MAX_RESULTS}&key=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const container = document.getElementById('youtube-feed');

            data.items.forEach(item => {
                const videoId = item.snippet.resourceId.videoId;
                const title = item.snippet.title;
                
                const videoHTML = `
                    <div style="width: 300px;">
                        <iframe width="100%" height="200" 
                            src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" allowfullscreen>
                        </iframe>
                        <p style="font-family: sans-serif; font-size: 14px;">${title}</p>
                    </div>
                `;
                container.innerHTML += videoHTML;
            });
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
        }
    }

    getLatestVideos();

