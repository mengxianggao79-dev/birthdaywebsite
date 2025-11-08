// ========== 全局变量 ==========
const bgMusic = document.getElementById('bgMusic');
const musicControl = document.getElementById('musicControl');
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseModal = document.getElementById('surpriseModal');
const closeModal = document.querySelector('.close-modal');
const fireworkBtn = document.getElementById('fireworkBtn');
const fireworkCanvas = document.getElementById('fireworkCanvas');
const particleCanvas = document.getElementById('particleCanvas');

// ========== 生日倒计时 ==========
// 设置生日日期（请修改为实际生日日期）
const birthdayDate = new Date('2025-12-25 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = birthdayDate - now;
    
    if (distance < 0) {
        // 如果生日已过，显示0
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// 每秒更新倒计时
setInterval(updateCountdown, 1000);
updateCountdown();

// ========== 背景音乐控制 ==========
let isPlaying = false;

musicControl.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicControl.querySelector('.music-icon').classList.remove('playing');
    } else {
        bgMusic.play();
        musicControl.querySelector('.music-icon').classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// 页面加载后尝试自动播放（某些浏览器可能需要用户交互才能播放）
window.addEventListener('load', () => {
    bgMusic.play().then(() => {
        isPlaying = true;
        musicControl.querySelector('.music-icon').classList.add('playing');
    }).catch(err => {
        console.log('自动播放被阻止，需要用户点击音乐按钮');
        isPlaying = false;
    });
});

// ========== 粒子背景动画 ==========
const particleCtx = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > particleCanvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > particleCanvas.height || this.y < 0) {
            this.speedY *= -1;
        }
    }
    
    draw() {
        particleCtx.fillStyle = `rgba(155, 139, 126, ${this.opacity})`;
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleCtx.fill();
    }
}

const particles = [];
for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// 窗口大小改变时更新画布
window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
});

// ========== 滚动动画（简化版AOS） ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// 观察所有带 data-aos 属性的元素
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ========== 导航菜单高亮 ==========
const sections = document.querySelectorAll('.content-section');
const navDots = document.querySelectorAll('.nav-dot');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 300) {
            current = section.getAttribute('id');
        }
    });
    
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('href') === `#${current}`) {
            dot.classList.add('active');
        }
    });
});

// ========== 惊喜弹窗 ==========
surpriseBtn.addEventListener('click', () => {
    surpriseModal.classList.add('active');
    // 添加五彩纸屑效果
    createConfetti();
});

closeModal.addEventListener('click', () => {
    surpriseModal.classList.remove('active');
});

surpriseModal.addEventListener('click', (e) => {
    if (e.target === surpriseModal) {
        surpriseModal.classList.remove('active');
    }
});

// 五彩纸屑效果
function createConfetti() {
    const colors = ['#9B8B7E', '#C9B8A8', '#A89F91', '#F5F1ED'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = 3000;
            
            document.body.appendChild(confetti);
            
            let posY = -10;
            let posX = parseFloat(confetti.style.left);
            let rotation = 0;
            
            const fall = setInterval(() => {
                posY += 5;
                posX += Math.sin(posY / 30) * 2;
                rotation += 5;
                
                confetti.style.top = posY + 'px';
                confetti.style.left = posX + 'px';
                confetti.style.transform = `rotate(${rotation}deg)`;
                
                if (posY > window.innerHeight) {
                    clearInterval(fall);
                    confetti.remove();
                }
            }, 20);
        }, i * 30);
    }
}

// ========== 烟花效果 ==========
const fireworkCtx = fireworkCanvas.getContext('2d');
fireworkCanvas.width = window.innerWidth;
fireworkCanvas.height = window.innerHeight;

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.exploded = false;
        
        // 上升阶段
        this.rocketY = window.innerHeight;
        this.targetY = y;
        this.speed = 5;
        
        // 创建爆炸粒子
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                alpha: 1,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`
            });
        }
    }
    
    update() {
        if (!this.exploded) {
            this.rocketY -= this.speed;
            if (this.rocketY <= this.targetY) {
                this.exploded = true;
            }
        } else {
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1; // 重力
                p.alpha -= 0.01;
            });
        }
    }
    
    draw() {
        if (!this.exploded) {
            fireworkCtx.fillStyle = 'white';
            fireworkCtx.beginPath();
            fireworkCtx.arc(this.x, this.rocketY, 3, 0, Math.PI * 2);
            fireworkCtx.fill();
        } else {
            this.particles.forEach(p => {
                if (p.alpha > 0) {
                    fireworkCtx.globalAlpha = p.alpha;
                    fireworkCtx.fillStyle = p.color;
                    fireworkCtx.beginPath();
                    fireworkCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    fireworkCtx.fill();
                }
            });
            fireworkCtx.globalAlpha = 1;
        }
    }
    
    isDone() {
        return this.exploded && this.particles.every(p => p.alpha <= 0);
    }
}

let fireworks = [];
let fireworkInterval;

fireworkBtn.addEventListener('click', () => {
    fireworkCanvas.classList.add('active');
    
    // 清除之前的烟花
    fireworks = [];
    
    // 每500ms发射一个烟花，持续10秒
    let count = 0;
    fireworkInterval = setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.5;
        fireworks.push(new Firework(x, y));
        
        count++;
        if (count >= 20) {
            clearInterval(fireworkInterval);
            
            // 5秒后隐藏画布
            setTimeout(() => {
                fireworkCanvas.classList.remove('active');
                fireworks = [];
            }, 5000);
        }
    }, 500);
});

function animateFireworks() {
    if (fireworkCanvas.classList.contains('active')) {
        fireworkCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        fireworkCtx.fillRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
        
        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            
            if (firework.isDone()) {
                fireworks.splice(index, 1);
            }
        });
    }
    
    requestAnimationFrame(animateFireworks);
}

animateFireworks();

// 窗口大小改变时更新烟花画布
window.addEventListener('resize', () => {
    fireworkCanvas.width = window.innerWidth;
    fireworkCanvas.height = window.innerHeight;
});

// ========== 平滑滚动 ==========
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

// ========== 视频播放优化 ==========
const video = document.getElementById('messageVideo');
if (video) {
    // 进入视口时暂停背景音乐
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !video.paused) {
                if (isPlaying) {
                    bgMusic.volume = 0.3; // 降低背景音乐音量
                }
            }
        });
    }, { threshold: 0.5 });
    
    videoObserver.observe(video);
    
    video.addEventListener('play', () => {
        if (isPlaying) {
            bgMusic.volume = 0.3;
        }
    });
    
    video.addEventListener('pause', () => {
        if (isPlaying) {
            bgMusic.volume = 1;
        }
    });
    
    video.addEventListener('ended', () => {
        if (isPlaying) {
            bgMusic.volume = 1;
        }
    });
}

// ========== 照片画廊点击放大 ==========
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="close-image-modal">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .image-modal {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 3000;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .image-modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            .image-modal-content img {
                max-width: 100%;
                max-height: 90vh;
                border-radius: 10px;
            }
            .close-image-modal {
                position: absolute;
                top: -40px;
                right: 0;
                font-size: 2rem;
                color: white;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        modal.querySelector('.close-image-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    });
});

// ========== 特质标签动画 ==========
const traitTags = document.querySelectorAll('.trait-tag');
traitTags.forEach((tag, index) => {
    setTimeout(() => {
        tag.style.animation = 'fadeIn 0.5s ease forwards';
    }, index * 100);
});

console.log('🎂 生日快乐网站加载完成！');
console.log('💡 提示：记得替换素材路径哦~');
