import { useEffect, useRef, useState } from 'react';

const MOBILE_BREAKPOINT = 768; // px — adjust to match your own breakpoint

export default function MatrixBackground() {
    const canvasRef = useRef(null);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
    );

    // Track viewport width so switching from mobile <-> desktop (e.g. rotating
    // a tablet, or resizing a browser window) toggles the effect live.
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const handleChange = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        // On mobile we don't render the canvas at all (see return below), so
        // there's nothing to animate — skip setting up the whole effect.
        if (isMobile) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let isLightModeCached = document.body.classList.contains('light-mode');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            isLightModeCached = document.body.classList.contains('light-mode');
        }
        resizeCanvas();

        const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1023456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%+-*/=<>!";
        const charArray = chars.split('');
        const fontSize = 16;
        let columns = Math.floor(canvas.width / fontSize);
        let rainDrops = [];
        let columnSpeeds = [];

        let bubbles = [];
        const maxAmbientBubbles = 45;

        // Ambient particle field (passive, non-reactive) — sits underneath the rain/bubbles
        let particles = [];
        const particleCount = 90;
        const particleColor = '#3fff6b';

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 1 + Math.random() * 1.5,
                speed: 0.1 + Math.random() * 0.3,
                opacity: 0.15 + Math.random() * 0.35,
                drift: (Math.random() - 0.5) * 0.15,
            };
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(createParticle());
            }
        }

        function drawParticles() {
            for (let p of particles) {
                p.y -= p.speed;
                p.x += p.drift;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;

                if (p.y < -10) {
                    p.y = canvas.height + 10;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
            }
        }

        function initStreamsAndBubbles() {
            columns = Math.floor(canvas.width / fontSize);
            rainDrops = [];
            columnSpeeds = [];
            for (let x = 0; x < columns; x++) {
                rainDrops[x] = Math.random() * -100;
                columnSpeeds[x] = 1 + Math.random() * 1.5;
            }
            bubbles = [];
            for (let i = 0; i < maxAmbientBubbles; i++) {
                bubbles.push(createNewBubble(Math.random() * canvas.width, canvas.height + Math.random() * 200, false));
            }
            initParticles();
        }
        initStreamsAndBubbles();

        // --- Fix for mobile flash + resize glitches ---
        // Mobile browsers fire 'resize' constantly as the address bar shows/hides
        // while scrolling. Resizing a canvas always clears it, so without guarding
        // this caused a visible flash on every scroll tick. We now:
        //   1. Use a single merged handler (was two separate ones before).
        //   2. Debounce it so rapid-fire mobile resize events collapse into one.
        //   3. Ignore events where only the height changed (address bar toggling)
        //      and only react to real width changes.
        let lastWidth = window.innerWidth;
        let resizeTimeout;

        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newWidth = window.innerWidth;
                if (newWidth === lastWidth) return; // height-only change, ignore
                lastWidth = newWidth;
                resizeCanvas();
                initStreamsAndBubbles();
            }, 150);
        }
        window.addEventListener('resize', handleResize);

        // --- Fix for minimize/tab-switch flash ---
        // requestAnimationFrame pauses while the tab is hidden. Resuming it without
        // guarding causes a jarring flash (stale fade overlay + frame jump). We
        // explicitly cancel the loop on hide and cleanly restart it on show.
        function handleVisibilityChange() {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(drawMatrix);
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);

        function createNewBubble(x, y, isTrail = false) {
            return {
                x, y,
                radius: isTrail ? 2 + Math.random() * 7 : 4 + Math.random() * 12,
                speedY: isTrail ? 0.8 + Math.random() * 1.5 : 0.4 + Math.random() * 1.0,
                wobbleSpeed: 0.01 + Math.random() * 0.03,
                wobbleRange: 0.4 + Math.random() * 1.2,
                angle: Math.random() * Math.PI * 2,
                opacity: isTrail ? 0.75 : 0.2 + Math.random() * 0.35,
                isMouseTrail: isTrail
            };
        }

        let mouse = { x: -1000, y: -1000, lastX: 0, lastY: 0 };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            let dx = mouse.x - mouse.lastX;
            let dy = mouse.y - mouse.lastY;

            if (!isLightModeCached) {
                let targetedColumn = Math.floor(mouse.x / fontSize);
                if (targetedColumn >= 0 && targetedColumn < columns) {
                    if (Math.random() < 0.4) {
                        rainDrops[targetedColumn] = mouse.y / fontSize - Math.random() * 3;
                    }
                }
            } else {
                let distanceMoved = Math.hypot(dx, dy);
                if (distanceMoved > 6 && bubbles.length < maxAmbientBubbles + 60) {
                    let scatterX = mouse.x + (Math.random() * 16 - 8);
                    bubbles.push(createNewBubble(scatterX, mouse.y, true));
                }
            }
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
        };

        const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        function drawMatrix() {
            isLightModeCached = document.body.classList.contains('light-mode');

            if (!isLightModeCached) {
                // fade previous frame instead of clearing, so particles + rain both trail
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // ambient particles drawn first, underneath the rain
                drawParticles();

                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < rainDrops.length; i++) {
                    let currentX = i * fontSize;
                    let currentY = rainDrops[i] * fontSize;

                    if (currentY < 0 && Math.random() < 0.98) {
                        rainDrops[i] += columnSpeeds[i];
                        continue;
                    }

                    let diffX = currentX - mouse.x;
                    let diffY = currentY - mouse.y;
                    let distance = Math.sqrt(diffX * diffX + diffY * diffY);
                    let proximityRadius = 110;

                    let drawText = charArray[Math.floor(Math.random() * charArray.length)];
                    let finalX = Math.floor(currentX);
                    let finalY = Math.floor(currentY);

                    if (distance < proximityRadius) {
                        drawText = Math.random() > 0.5 ? "1" : "0";
                        let force = (proximityRadius - distance) / proximityRadius;
                        finalX = Math.floor(currentX + (diffX / distance) * force * 12);
                        finalY = Math.floor(currentY + (diffY / distance) * force * 12);

                        ctx.fillStyle = '#00ff00'; // Or change to #e50914 for a red cursor glow!
                        ctx.fillText(drawText, finalX, finalY);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(drawText, finalX + 1, finalY + 1);
                    }
                    // Only draws characters when the mouse is near — no standard falling rain otherwise.

                    rainDrops[i] += columnSpeeds[i];

                    if (currentY > canvas.height && Math.random() > 0.975) {
                        rainDrops[i] = 0;
                        columnSpeeds[i] = 1 + Math.random() * 1.5;
                    }
                }
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // ambient particles in light mode too, drawn before bubbles
                drawParticles();

                for (let i = bubbles.length - 1; i >= 0; i--) {
                    let b = bubbles[i];
                    b.y -= b.speedY;
                    b.angle += b.wobbleSpeed;

                    let currentDrawX = Math.floor(b.x + Math.sin(b.angle) * b.wobbleRange);
                    let currentDrawY = Math.floor(b.y);

                    let bdx = currentDrawX - mouse.x;
                    let bdy = currentDrawY - mouse.y;
                    let bubbleDist = Math.hypot(bdx, bdy);
                    if (bubbleDist < 130) {
                        let push = (130 - bubbleDist) / 130;
                        currentDrawX += (bdx / bubbleDist) * push * 22;
                        b.y += (bdy / bubbleDist) * push * 8;
                        currentDrawY = Math.floor(b.y);
                    }

                    if (b.isMouseTrail) {
                        b.opacity -= 0.007;
                        if (b.opacity <= 0) { bubbles.splice(i, 1); continue; }
                    }

                    ctx.beginPath();
                    ctx.arc(currentDrawX, currentDrawY, b.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 150, 110, ${b.opacity * 0.04})`;
                    ctx.strokeStyle = `rgba(0, 120, 95, ${b.opacity * 0.65})`;
                    ctx.lineWidth = 1.2;
                    ctx.fill(); ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(Math.floor(currentDrawX - b.radius * 0.3), Math.floor(currentDrawY - b.radius * 0.3), b.radius * 0.14, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.75})`;
                    ctx.fill();

                    if (!b.isMouseTrail && b.y < -30) {
                        b.y = canvas.height + 30;
                        b.x = Math.random() * canvas.width;
                    }
                }
            }
            animationFrameId = requestAnimationFrame(drawMatrix);
        }
        drawMatrix();

        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isMobile]);

    // On mobile, skip the canvas entirely — a plain CSS dot-grid (see
    // index.css) is used instead. Nothing to animate, nothing to render here.
    if (isMobile) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100vw', height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                mixBlendMode: 'screen'
            }}
        />
    );
}