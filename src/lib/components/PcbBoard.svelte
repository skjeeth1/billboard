<script>
  // ==========================================
  // 1. COMPONENT PROPS
  // ==========================================
  let {
    // --- DESKTOP CONFIGURATION ---
    icWidthDesktop = 800,
    icHeightDesktop = 500,
    enableGlowDesktop = true,
    textOffsetXDesktop = 24,
    textOffsetYDesktop = 124,

    // --- MOBILE CONFIGURATION ---
    icWidthMobile = 280,
    icHeightMobile = 360,
    enableGlowMobile = true,
    textOffsetXMobile = 24,
    textOffsetYMobile = 70, // Slightly higher up for mobile

    // --- GLOBAL SETTINGS ---
    textLabel = "ELECTRONICS\nAND\nCOMMUN-\n ICATION\nDEPARTMENT", 
    showGrid = false,
    viaSpawnChance = 0.2,
    tracesX = 20,
    tracesY = 16,
    activeStreaksLimit = 15
  } = $props();

  const ROUTING = { 
    occlusionDepth: 40, maxDesktop: 60, maxMobile: 24,
    streakLength: 100, staggerSpacing: 16
  };
  const PAD = { stick: 16, overlap: 4, thickness: 6 };

  // ==========================================
  // 2. REACTIVE SYSTEM STATE & LAYOUT
  // ==========================================
  
  let boardW = $state(1000); 
  let boardH = $state(600);
  let isMobile = $state(false);

  // Grouped Dynamic Resolution (Mobile vs Desktop)
  let safeIcW = $derived(isMobile ? icWidthMobile : icWidthDesktop);
  let safeIcH = $derived(isMobile ? icHeightMobile : icHeightDesktop);
  let isGlowEnabled = $derived(isMobile ? enableGlowMobile : enableGlowDesktop);
  let textOffsetX = $derived(isMobile ? textOffsetXMobile : textOffsetXDesktop);
  let textOffsetY = $derived(isMobile ? textOffsetYMobile : textOffsetYDesktop);

  // Core Geometry Anchor Points
  let icX = $derived((boardW - safeIcW) / 2);
  let icY = $derived((boardH - safeIcH) / 2);
  
  let pin1Cx = $derived(icX + 30);
  let pin1Cy = $derived(icY + 30);
  
  // Text Anchor Points (Driven by the Offsets)
  let textX = $derived(icX + textOffsetX); 
  let textY = $derived(icY + textOffsetY); 
  let textLines = $derived(textLabel.split('\\n').flatMap(line => line.split('\n')));

  let isVisible = $state(true);
  
  let totalTraces = $derived(tracesX + tracesY);
  let maxTraces = $derived(isMobile ? ROUTING.maxMobile : ROUTING.maxDesktop);
  
  let routedConnections = $state([]);
  let connectionIdCounter = 0;
  
  let activeStreaks = $state([]);
  let streakIdCounter = 0;
  let prevLimit = -2; 
  let prevTotal = -1;

  let cardEl; 

  // ==========================================
  // 3. PURE UTILITY FUNCTIONS
  // ==========================================
  
  function getRoutePoints(startX, startY, edgeX, edgeY, side, index = 0, total = 1) {
    const dx = edgeX - startX;
    const dy = edgeY - startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const dirX = Math.sign(dx);
    const dirY = Math.sign(dy);

    const stagger = (index - (total - 1) / 2) * ROUTING.staggerSpacing;
    const points = [[startX, startY]];

    if (side === 'top' || side === 'bottom') {
      if (absDx <= absDy) {
        const straightY = (absDy - absDx) / 2;
        const y1 = startY + straightY * dirY;
        const y2 = y1 + absDx * dirY;
        points.push([startX, y1], [edgeX, y2], [edgeX, edgeY]);
      } else {
        const half = absDy / 2;
        const straightX = absDx - half;
        const x1 = startX + straightX * dirX;
        const y1 = edgeY - half * dirY;
        points.push([x1, startY], [edgeX, y1], [edgeX, edgeY]);
      }
    } else {
      if (absDy <= absDx) {
        const straightX = (absDx - absDy) / 2;
        const x1 = startX + straightX * dirX;
        const x2 = x1 + absDy * dirX;
        points.push([x1, startY], [x2, edgeY], [edgeX, edgeY]);
      } else {
        const midX = startX + dx / 2 + stagger;
        points.push([midX, startY], [midX, edgeY], [edgeX, edgeY]);
      }
    }
    return points;
  }

  function getPointOnRoute(points, distance) {
    let currentDist = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      const segLen = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      if (currentDist + segLen >= distance) {
        const t = (distance - currentDist) / segLen;
        const vx = p1[0] + (p2[0] - p1[0]) * t;
        const vy = p1[1] + (p2[1] - p1[1]) * t;
        return { via: [vx, vy], newRoute: [[vx, vy], ...points.slice(i + 1)] };
      }
      currentDist += segLen;
    }
    return { via: points[0], newRoute: points };
  }

  function getCirclePoints(cx, cy, r, startAngle = 0, numPoints = 16) {
    const pts = [];
    for (let i = 0; i <= numPoints; i++) {
      const angle = startAngle + (i / numPoints) * Math.PI * 2;
      pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
    }
    return pts;
  }

  function pointsToPath(points) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  }

  function pathLength(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    }
    return total;
  }

  function getEvenlySpaced(count, min, max) {
    if (count === 0) return [];
    const step = (max - min) / (count + 1);
    return Array.from({ length: count }, (_, i) => min + step * (i + 1));
  }

  function distributeEvenly(total, numBuckets) {
    const base = Math.floor(total / numBuckets);
    const remainder = total % numBuckets;
    const counts = new Array(numBuckets).fill(base);
    const order = Array.from({ length: numBuckets }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (let i = 0; i < remainder; i++) counts[order[i]]++;
    return counts;
  }

  function getPadRect(edge, side) {
    const { stick, overlap, thickness } = PAD;
    switch (side) {
      case 'left':   return { x: edge[0] - stick + overlap, y: edge[1] - thickness / 2, w: stick, h: thickness };
      case 'right':  return { x: edge[0] - overlap,         y: edge[1] - thickness / 2, w: stick, h: thickness };
      case 'top':    return { x: edge[0] - thickness / 2,   y: edge[1] - stick + overlap, w: thickness, h: stick };
      case 'bottom': 
      default:       return { x: edge[0] - thickness / 2,   y: edge[1] - overlap,         w: thickness, h: stick };
    }
  }

  function generateConnections(countX, countY, connectionIdStart) {
    if (boardW <= 0 || boardH <= 0) return [];

    const xCounts = distributeEvenly(countX, 2);
    const yCounts = distributeEvenly(countY, 2);
    
    const buckets = {
      left: xCounts[0], right: xCounts[1],
      top: yCounts[0], bottom: yCounts[1]
    };
    
    let raw = [];

    if (buckets.left > 0) {
      const innerYs = getEvenlySpaced(buckets.left, icY + 10, icY + safeIcH - 10);
      const outerYs = isMobile ? innerYs : getEvenlySpaced(buckets.left, 20, boardH - 20);
      for (let i = 0; i < buckets.left; i++) {
        raw.push({ start: [0, outerYs[i]], edge: [icX, innerYs[i]], occluded: [icX + ROUTING.occlusionDepth, innerYs[i]], side: 'left', index: i, total: buckets.left });
      }
    }

    if (buckets.right > 0) {
      const innerYs = getEvenlySpaced(buckets.right, icY + 10, icY + safeIcH - 10);
      const outerYs = isMobile ? innerYs : getEvenlySpaced(buckets.right, 20, boardH - 20);
      for (let i = 0; i < buckets.right; i++) {
        raw.push({ start: [boardW, outerYs[i]], edge: [icX + safeIcW, innerYs[i]], occluded: [icX + safeIcW - ROUTING.occlusionDepth, innerYs[i]], side: 'right', index: i, total: buckets.right });
      }
    }

    if (buckets.top > 0) {
      const outerXs = getEvenlySpaced(buckets.top, 20, boardW - 20);
      const innerXs = getEvenlySpaced(buckets.top, icX + 10, icX + safeIcW - 10);
      for (let i = 0; i < buckets.top; i++) {
        raw.push({ start: [outerXs[i], 0], edge: [innerXs[i], icY], occluded: [innerXs[i], icY + ROUTING.occlusionDepth], side: 'top', index: i, total: buckets.top });
      }
    }

    if (buckets.bottom > 0) {
      const outerXs = getEvenlySpaced(buckets.bottom, 20, boardW - 20);
      const innerXs = getEvenlySpaced(buckets.bottom, icX + 10, icX + safeIcW - 10);
      for (let i = 0; i < buckets.bottom; i++) {
        raw.push({ start: [outerXs[i], boardH], edge: [innerXs[i], icY + safeIcH], occluded: [innerXs[i], icY + safeIcH - ROUTING.occlusionDepth], side: 'bottom', index: i, total: buckets.bottom });
      }
    }

    let idOffset = connectionIdStart;
    return raw.map((conn) => {
      const routePoints = getRoutePoints(conn.start[0], conn.start[1], conn.edge[0], conn.edge[1], conn.side, conn.index, conn.total);
      const fullLength = pathLength(routePoints);
      
      let finalRoute = routePoints;
      let viaData = null;

      if (Math.random() < viaSpawnChance) {
        const targetDist = fullLength * (0.3 + Math.random() * 0.4);
        const split = getPointOnRoute(routePoints, targetDist);
        finalRoute = split.newRoute;
        viaData = { x: split.via[0], y: split.via[1], r: 7 }; 
      }

      const physicalPoints = [...finalRoute, conn.occluded];
      let animPoints = physicalPoints;

      if (viaData) {
        const nextPoint = finalRoute[1] ?? conn.occluded;
        const exitAngle = Math.atan2(nextPoint[1] - viaData.y, nextPoint[0] - viaData.x);
        const viaPts = getCirclePoints(viaData.x, viaData.y, viaData.r, exitAngle);
        animPoints = [...viaPts, ...finalRoute.slice(1), conn.occluded];
      }

      const length = pathLength(animPoints);
      const dash = Math.min(ROUTING.streakLength, length / 4);
      const gap = length + dash;

      return {
        id: idOffset++,
        physicalPathData: pointsToPath(physicalPoints),
        animPathData: pointsToPath(animPoints), 
        dash, gap,
        offsetStart: 1.5 * dash,
        offsetEnd: -(length + 0.5 * dash),
        duration: Math.min(4, Math.max(1.4, length / 90)),
        edge: conn.edge,
        side: conn.side,
        via: viaData
      };
    });
  }

  // ==========================================
  // 4. STREAK POOL MANAGER
  // ==========================================

  function addRandomStreak() {
    if (activeStreaksLimit === -1) return; 
    
    let activeConnIds = new Set(activeStreaks.map(s => s.conn.id));
    let available = routedConnections.filter(c => !activeConnIds.has(c.id));
    
    if (available.length === 0) return;
    
    let randomConn = available[Math.floor(Math.random() * available.length)];
    
    activeStreaks = [...activeStreaks, {
        uid: streakIdCounter++,
        conn: randomConn,
        delay: Math.random() * 1.5 
    }];
  }

  function handleStreakEnd(uid) {
    let idx = activeStreaks.findIndex(s => s.uid === uid);
    if (idx !== -1) {
        let newStreaks = [...activeStreaks];
        newStreaks.splice(idx, 1);
        activeStreaks = newStreaks;

        setTimeout(() => {
            if (activeStreaksLimit !== -1 && activeStreaks.length < Math.min(activeStreaksLimit, routedConnections.length)) {
                addRandomStreak();
            }
        }, 50);
    }
  }

  let activeTracesX = $derived(Math.min(tracesX, maxTraces));
  let activeTracesY = $derived(Math.min(tracesY, maxTraces));

  $effect(() => {
    routedConnections = generateConnections(activeTracesX, activeTracesY, connectionIdCounter);
    connectionIdCounter += totalTraces; 
    
    activeStreaks = [];
    prevTotal = -1; 
  });

  $effect(() => {
    let limit = Number(activeStreaksLimit);
    let total = routedConnections.length;

    if (limit === -1) {
        activeStreaks = [];
        prevLimit = -1;
        return;
    }

    if (limit !== prevLimit || total !== prevTotal) {
        prevLimit = limit;
        prevTotal = total;
        
        let targetCount = Math.min(limit, total);
        
        if (activeStreaks.length < targetCount) {
            let diff = targetCount - activeStreaks.length;
            for(let i = 0; i < diff; i++) addRandomStreak();
        } else if (activeStreaks.length > targetCount) {
            activeStreaks = activeStreaks.slice(0, targetCount);
        }
    }
  });

  // ==========================================
  // 5. BROWSER EVENT EFFECTS
  // ==========================================

  $effect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 480px)');
    isMobile = mq.matches;
    const handleChange = (e) => { isMobile = e.matches; };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  });

  $effect(() => {
    if (typeof window === 'undefined' || !cardEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(cardEl);
    return () => observer.disconnect();
  });

</script>

<div class="ece-card-wrapper" bind:this={cardEl} bind:clientWidth={boardW} bind:clientHeight={boardH}>
  
  <svg
    viewBox={`0 0 ${boardW} ${boardH}`}
    xmlns="http://www.w3.org/2000/svg"
    class="pcb-board"
    class:mobile={isMobile}
    class:paused={!isVisible}
    class:no-glow={!isGlowEnabled}
    class:all-active-mode={Number(activeStreaksLimit) === -1}
  >

    {#if showGrid}
      <defs>
        <pattern id="pcb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2" fill="rgba(168, 130, 255, 0.15)" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pcb-grid)" />
    {/if}

    {#each routedConnections as conn (conn.id)}
      <path class="physical-trace" d={conn.physicalPathData} />

      {#if conn.via}
        <circle class="via-ring" cx={conn.via.x} cy={conn.via.y} r={conn.via.r} />
        <circle class="via-hole" cx={conn.via.x} cy={conn.via.y} r={conn.via.r * 0.45} />
      {/if}

      {@const pad = getPadRect(conn.edge, conn.side)}
      <rect class="ic-pad" x={pad.x} y={pad.y} width={pad.w} height={pad.h} rx="2" />
    {/each}

    {#each activeStreaks as streak (streak.uid)}
      <path
        class="trace"
        d={streak.conn.animPathData}
        style="--dash-len:{streak.conn.dash}; --gap-len:{streak.conn.gap}; --offset-start:{streak.conn.offsetStart}; --offset-end:{streak.conn.offsetEnd}; --duration:{streak.conn.duration}s; animation-delay:{streak.delay}s"
        onanimationend={() => handleStreakEnd(streak.uid)}
      />
    {/each}

    <rect 
      x={icX} 
      y={icY} 
      width={safeIcW} 
      height={safeIcH} 
      rx="16" 
      class="ic-chip" 
    />
    <circle 
      class="ic-pin1" 
      cx={pin1Cx} 
      cy={pin1Cy} 
      r={7} 
    />
    
    <text 
      x={textX} 
      y={textY} 
      text-anchor="start" 
      dominant-baseline="hanging"
      class="ic-text"
      font-size="{Math.max(20, safeIcW * (isMobile ? 0.12 : 0.08))}px"
    >
      {#each textLines as line, i}
        <tspan 
          x={textX} 
          dy={i === 0 ? '0' : '1.2em'}
        >
          {line}
        </tspan>
      {/each}
    </text>

  </svg>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .ece-card-wrapper {
    width: 100vw;
    height: 100vh;
    background: #0d0914;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pcb-board {
    width: 100%;
    height: 100%;
    display: block;
  }

  .via-ring {
    fill: none;
    stroke: rgba(168, 130, 255, 0.18);
    stroke-width: 2.5; 
    transition: stroke 0.4s ease;
  }

  .via-hole {
    fill: #0d0914;
  }

  .ic-pad {
    fill: #cdb8f5;
    stroke: #6b4fb3;
    stroke-width: 1; 
    /* iOS WebKit Fixes for Drop Shadows */
    -webkit-filter: drop-shadow(0 0 4px rgba(168, 130, 255, 0.6));
    filter: drop-shadow(0 0 4px rgba(168, 130, 255, 0.6)); 
    transform: translate3d(0, 0, 0); 
    pointer-events: none;
  }

  .ic-pin1 {
    fill: #a882ff;
    -webkit-filter: drop-shadow(0 0 6px #a882ff);
    filter: drop-shadow(0 0 6px #a882ff); 
    transform: translate3d(0, 0, 0);
  }

  .ic-chip {
    fill: #151515;
    stroke-width: 4; 
    -webkit-filter: drop-shadow(0px 20px 30px rgba(0,0,0,0.8));
    filter: drop-shadow(0px 20px 30px rgba(0,0,0,0.8)); 
    transform: translate3d(0, 0, 0);
  }

  .ic-text {
    fill: rgba(255, 255, 255, 0.1);
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    font-weight: 400;
    letter-spacing: 4px; 
    text-shadow: -2px -2px 2px #000, 2px 2px 2px rgba(255,255,255,0.2);
    transition: fill 0.3s ease, text-shadow 0.3s ease;
  }

  .ece-card-wrapper:hover .pcb-board:not(.no-glow) .ic-text {
    fill: #a882ff;
    text-shadow: 0 0 15px #a882ff, 0 0 30px #a882ff;
  }

  .pcb-board.mobile .ic-text {
    fill: #a882ff;
    text-shadow: 0 0 15px #a882ff, 0 0 30px #a882ff;
    animation: textFlicker 2.6s ease-in-out infinite;
  }

  .pcb-board.mobile.paused .ic-text {
    animation-play-state: paused;
  }

  @keyframes textFlicker {
    0%, 100% { opacity: 1; text-shadow: 0 0 15px #a882ff, 0 0 30px #a882ff; }
    45%      { opacity: 0.86; text-shadow: 0 0 10px #a882ff, 0 0 22px #a882ff; }
    55%      { opacity: 0.92; text-shadow: 0 0 12px #a882ff, 0 0 26px #a882ff; }
    75%      { opacity: 0.88; text-shadow: 0 0 10px #a882ff, 0 0 22px #a882ff; }
  }

  .physical-trace {
    fill: none;
    stroke: rgba(255, 255, 255, 0.08);
    stroke-width: 4; 
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
    transition: stroke 0.4s ease, stroke-opacity 0.4s ease;
  }

  .pcb-board.all-active-mode .physical-trace {
    stroke: #a882ff;
    stroke-opacity: 0.9;
  }
  
  .pcb-board.all-active-mode .via-ring {
    stroke: #a882ff;
  }

  .pcb-board.all-active-mode:not(.no-glow) .physical-trace,
  .pcb-board.all-active-mode:not(.no-glow) .via-ring {
    -webkit-filter: drop-shadow(0 0 6px rgba(168, 130, 255, 0.8));
    filter: drop-shadow(0 0 6px rgba(168, 130, 255, 0.8));
    transform: translate3d(0, 0, 0);
  }

  .trace {
    fill: none;
    stroke: #a882ff;
    stroke-width: 4; 
    stroke-linecap: round;
    stroke-linejoin: round;
    /* iOS WebKit Fix */
    -webkit-filter: drop-shadow(0 0 6px #a882ff);
    filter: drop-shadow(0 0 6px #a882ff); 
    pointer-events: none;
    
    /* Hardware Accel is critical here to prevent filter loss on animate */
    will-change: stroke-dashoffset;
    transform: translate3d(0, 0, 0);

    stroke-dasharray: var(--dash-len) var(--gap-len);
    stroke-dashoffset: var(--offset-start);
    animation: signalFlow var(--duration) linear forwards;
  }

  .pcb-board.no-glow .trace,
  .pcb-board.no-glow .ic-pad,
  .pcb-board.no-glow .ic-pin1,
  .pcb-board.no-glow.all-active-mode .physical-trace,
  .pcb-board.no-glow.all-active-mode .via-ring {
    -webkit-filter: none !important;
    filter: none !important;
  }

  .pcb-board.paused .trace {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    .trace { animation: none; opacity: 0; }
    .ic-text { animation: none !important; }
  }

  @keyframes signalFlow {
    0% { stroke-dashoffset: var(--offset-start); }
    100% { stroke-dashoffset: var(--offset-end); }
  }
</style>