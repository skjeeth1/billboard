<script>
  // ==========================================
  // 1. COMPONENT PROPS
  // ==========================================
  let {
    // --- DESKTOP CONFIGURATION ---
    icWidthDesktop = 700,
    icHeightDesktop = 500,
    enableGlowDesktop = false,
    textOffsetXDesktop = 60,
    fontSizeDesktop = 64,
    lineSpacingDesktop = 68,
    tracesXDesktop = 8,
    tracesYDesktop = 10,

    // --- MOBILE CONFIGURATION ---
    icWidthMobile = 280,
    icHeightMobile = 360,
    enableGlowMobile = false,
    textOffsetXMobile = 25,
    fontSizeMobile = 32,    
    lineSpacingMobile = 40,
    tracesXMobile = 10,
    tracesYMobile = 12,

    // --- DISCRETE COMPONENTS (RESISTORS / CAPACITORS) ---
    resistorsDesktop = 0,
    resistorsMobile = 1,
    capacitorsDesktop = 0,
    capacitorsMobile = 1,

    // --- GLOBAL SETTINGS ---
    textLabelDesktop = "ELECTRONICS\nAND\nCOMMUNICATION\nDEPARTMENT", 
    textLabelMobile = "ELECTRONICS\nAND\nCOMMUN-\nICATION\nDEPARTMENT",
    showGrid = false,
    viaSpawnChance = 0.2,
    activeStreaksLimit = 15,

    // --- POWER SWITCH ---
    defaultPowerOn = true
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

  let safeIcW = $derived(isMobile ? icWidthMobile : icWidthDesktop);
  let safeIcH = $derived(isMobile ? icHeightMobile : icHeightDesktop);
  
  let isGlowEnabled = $derived(isMobile ? enableGlowMobile : enableGlowDesktop);
  
  let textOffsetX = $derived(isMobile ? textOffsetXMobile : textOffsetXDesktop);
  let fontSize = $derived(isMobile ? fontSizeMobile : fontSizeDesktop);
  let lineSpacing = $derived(isMobile ? lineSpacingMobile : lineSpacingDesktop);

  let tracesX = $derived(isMobile ? tracesXMobile : tracesXDesktop);
  let tracesY = $derived(isMobile ? tracesYMobile : tracesYDesktop);

  let resistorCount = $derived(isMobile ? resistorsMobile : resistorsDesktop);
  let capacitorCount = $derived(isMobile ? capacitorsMobile : capacitorsDesktop);

  // Scaled up footprints
  let resistorBodyLen = $derived(isMobile ? 24 : 32);
  let resistorBodyW = $derived(isMobile ? 12 : 16);
  let resistorPadLen = $derived(isMobile ? 6 : 8);

  let capBaseSize = $derived(isMobile ? 22 : 28);
  // Radius > capBaseSize / 2 so the circle overlaps the square base
  let capRadius = $derived(isMobile ? 13 : 16); 
  let capPadLen = $derived(isMobile ? 6 : 8);
  let capPadW = $derived(isMobile ? 8 : 10);

  let icX = $derived((boardW - safeIcW) / 2);
  let icY = $derived((boardH - safeIcH) / 2);
  
  let pin1Cx = $derived(icX + 30);
  let pin1Cy = $derived(icY + 30);
  
  let textX = $derived(icX + textOffsetX); 
  let textCenterY = $derived(icY + safeIcH / 2); 
  
  let currentTextLabel = $derived(isMobile ? textLabelMobile : textLabelDesktop);
  let textLines = $derived(currentTextLabel.split('\\n').flatMap(line => line.split('\n')));

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

  let powerOn = $state(defaultPowerOn);
  let isBooting = $state(false);

  let railConnections = $derived(routedConnections.filter(c => c.isRail));

  let switchScale = $derived(isMobile ? 0.8 : 1.5); 
  let switchBodyW = $derived(32 * switchScale);
  let switchBodyH = $derived(84 * switchScale); 
  let switchLeadLen = $derived(16 * switchScale);
  let switchViaGap = $derived(16 * switchScale);
  let switchViaR = $derived(6 * switchScale);
  let switchKnobSize = $derived(44 * switchScale); 
  let switchMargin = $derived(isMobile ? 22 : 38);
  
  let switchClearanceX = $derived(isMobile? 10 : 120); 
  let switchClearanceY = $derived(isMobile? 120: 30); 
  
  let switchX = $derived(switchMargin + switchClearanceX);
  let switchY = $derived(boardH - switchBodyH - switchMargin - switchClearanceY);

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

  function getPointAndAngleOnPath(points, distance) {
    let currentDist = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const segLen = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      if (segLen > 0 && currentDist + segLen >= distance) {
        const t = (distance - currentDist) / segLen;
        const x = p1[0] + (p2[0] - p1[0]) * t;
        const y = p1[1] + (p2[1] - p1[1]) * t;
        const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        return { x, y, angle };
      }
      currentDist += segLen;
    }
    const last = points[points.length - 1];
    const prev = points[points.length - 2] ?? last;
    return { x: last[0], y: last[1], angle: Math.atan2(last[1] - prev[1], last[0] - prev[0]) };
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
    
    const mapped = raw.map((conn, index) => {
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

      let isOutward = index % 2 === 1;

      return {
        id: idOffset++,
        physicalPoints,
        animPoints,
        isOutward,
        edge: conn.edge,
        side: conn.side,
        via: viaData,
        isRail: false,
        componentType: null,
        componentLabel: null
      };
    });

    const topConns = mapped.filter(c => c.side === 'top');
    const bottomConns = mapped.filter(c => c.side === 'bottom');
    if (topConns.length) {
      let tl = topConns.reduce((a, b) => (a.edge[0] <= b.edge[0] ? a : b));
      tl.isRail = true;
      tl.isOutward = false; 
    }
    if (bottomConns.length) {
      let br = bottomConns.reduce((a, b) => (a.edge[0] >= b.edge[0] ? a : b));
      br.isRail = true;
      br.isOutward = true; 
    }

    // Filter valid component candidates based on platform space
    const componentCandidates = mapped.filter(c => {
      if (c.via || c.isRail) return false;
      if (isMobile && (c.side === 'left' || c.side === 'right')) return false;
      return true;
    });

    const shuffledCandidates = [...componentCandidates];
    for (let i = shuffledCandidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCandidates[i], shuffledCandidates[j]] = [shuffledCandidates[j], shuffledCandidates[i]];
    }

    const wantedResistors = Math.max(0, Math.floor(resistorCount));
    const wantedCapacitors = Math.max(0, Math.floor(capacitorCount));

    shuffledCandidates.slice(0, wantedResistors).forEach((c, i) => {
      c.componentType = 'resistor';
      c.componentLabel = `R${i + 1}`;
    });
    shuffledCandidates.slice(wantedResistors, wantedResistors + wantedCapacitors).forEach((c, i) => {
      c.componentType = 'capacitor';
      c.componentLabel = `C${i + 1}`;
    });

    return mapped.map(conn => {
      let finalAnimPoints = conn.isOutward ? [...conn.animPoints].reverse() : conn.animPoints;
      
      const length = pathLength(finalAnimPoints);
      const dash = Math.min(ROUTING.streakLength, length / 4);
      const gap = length + dash;

      let component = null;
      if (conn.componentType) {
        const fullLen = pathLength(conn.physicalPoints);
        const minD = fullLen * 0.3;
        const maxD = fullLen * 0.7;
        const targetDist = minD + Math.random() * (maxD - minD);
        const { x, y, angle } = getPointAndAngleOnPath(conn.physicalPoints, targetDist);

        let angleDeg = angle * (180 / Math.PI);
        angleDeg = ((angleDeg + 180) % 360 + 360) % 360 - 180;
        if (angleDeg > 90) angleDeg -= 180;
        else if (angleDeg <= -90) angleDeg += 180;

        component = {
          type: conn.componentType,
          label: conn.componentLabel,
          x, y,
          angle: angleDeg
        };
      }

      return {
        id: conn.id,
        physicalPathData: pointsToPath(conn.physicalPoints),
        animPathData: pointsToPath(finalAnimPoints), 
        dash, gap,
        offsetStart: 1.5 * dash,
        offsetEnd: -(length + 0.5 * dash),
        duration: Math.min(4, Math.max(1.4, length / 90)),
        edge: conn.edge,
        side: conn.side,
        via: conn.via,
        isRail: conn.isRail,
        component
      };
    });
  }

  // ==========================================
  // 4. STREAK POOL MANAGER
  // ==========================================

  function addRandomStreak() {
    if (!powerOn || activeStreaksLimit === -1) return; 
    
    let activeConnIds = new Set(activeStreaks.map(s => s.conn.id));
    let available = routedConnections.filter(c => !activeConnIds.has(c.id) && !c.isRail);
    
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
            const nonRailTotal = routedConnections.filter(c => !c.isRail).length;
            if (powerOn && activeStreaksLimit !== -1 && activeStreaks.length < Math.min(activeStreaksLimit, nonRailTotal)) {
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
    let total = routedConnections.filter(c => !c.isRail).length;

    if (!powerOn) {
        activeStreaks = [];
        return;
    }

    if (limit === -1) {
        activeStreaks = [];
        prevLimit = -1;
        return;
    }

    if (limit !== prevLimit || total !== prevTotal || activeStreaks.length === 0) {
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
  // 5. POWER SWITCH LOGIC
  // ==========================================

  function toggleSwitch() {
    powerOn = !powerOn;
  }

  function handleSwitchKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSwitch();
    }
  }

  $effect(() => {
    if (powerOn) {
      isBooting = true;
    }
  });

  function handleTextAnimEnd() {
    isBooting = false;
  }

  // ==========================================
  // 6. BROWSER EVENT EFFECTS
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
    class:paused={!isVisible || !powerOn}
    class:powered={powerOn}
    class:all-active-mode={Number(activeStreaksLimit) === -1 && powerOn}
  >

    <defs>
      <filter id="glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter id="glow-light" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="chip-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="20" stdDeviation="15" flood-color="#000000" flood-opacity="0.8" />
      </filter>

      {#if showGrid}
        <pattern id="pcb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2" fill="rgba(168, 130, 255, 0.15)" />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2"/>
        </pattern>
      {/if}
    </defs>

    {#if showGrid}
      <rect width="100%" height="100%" fill="url(#pcb-grid)" />
    {/if}

    {#each routedConnections as conn (conn.id)}
      <path 
        class="physical-trace" 
        class:rail={conn.isRail}
        d={conn.physicalPathData} 
        filter={isGlowEnabled && Number(activeStreaksLimit) === -1 && powerOn ? 'url(#glow-light)' : null}
      />

      {#if conn.via}
        <circle 
          class="via-ring" 
          class:rail={conn.isRail}
          cx={conn.via.x} 
          cy={conn.via.y} 
          r={conn.via.r} 
          filter={isGlowEnabled && Number(activeStreaksLimit) === -1 && powerOn ? 'url(#glow-light)' : null}
        />
        <circle class="via-hole" cx={conn.via.x} cy={conn.via.y} r={conn.via.r * 0.45} />
      {/if}

      {@const pad = getPadRect(conn.edge, conn.side)}
      <rect 
        class="ic-pad" 
        class:rail={conn.isRail}
        x={pad.x} 
        y={pad.y} 
        width={pad.w} 
        height={pad.h} 
        rx="2" 
        filter={isGlowEnabled && powerOn ? 'url(#glow-light)' : null}
      />
    {/each}

    {#if powerOn && isVisible}
      {#each railConnections as rconn (rconn.id)}
        <path
          class="rail-streak"
          d={rconn.animPathData}
          filter="url(#glow-heavy)"
          style="--dash-len:{rconn.dash}; --gap-len:{rconn.gap}; --offset-start:{rconn.offsetStart}; --offset-end:{rconn.offsetEnd}; --duration:{rconn.duration}s;"
        />
      {/each}

      {#each activeStreaks as streak (streak.uid)}
        <path
          class="trace"
          d={streak.conn.animPathData}
          filter={isGlowEnabled ? 'url(#glow-heavy)' : null}
          style="--dash-len:{streak.conn.dash}; --gap-len:{streak.conn.gap}; --offset-start:{streak.conn.offsetStart}; --offset-end:{streak.conn.offsetEnd}; --duration:{streak.conn.duration}s; animation-delay:{streak.delay}s"
          onanimationend={() => handleStreakEnd(streak.uid)}
        />
      {/each}
    {/if}

    {#each routedConnections as conn (conn.id)}
      {#if conn.component}
        <g
          class="component-group"
          transform={`translate(${conn.component.x}, ${conn.component.y}) rotate(${conn.component.angle})`}
          filter={isGlowEnabled && powerOn ? 'url(#glow-light)' : null}
        >
          {#if conn.component.type === 'resistor'}
            <rect class="resistor-body" x={-resistorBodyLen / 2} y={-resistorBodyW / 2} width={resistorBodyLen} height={resistorBodyW} rx="1" />
            <rect class="smd-pad" x={-resistorBodyLen / 2} y={-resistorBodyW / 2} width={resistorPadLen} height={resistorBodyW} rx="1" />
            <rect class="smd-pad" x={resistorBodyLen / 2 - resistorPadLen} y={-resistorBodyW / 2} width={resistorPadLen} height={resistorBodyW} rx="1" />
            <text class="component-label" x="0" y={-resistorBodyW / 2 - 6} text-anchor="middle">{conn.component.label}</text>
          {:else}
            <rect class="smd-pad" x={-capBaseSize / 2 - capPadLen} y={-capPadW / 2} width={capPadLen} height={capPadW} rx="1" />
            <rect class="smd-pad" x={capBaseSize / 2} y={-capPadW / 2} width={capPadLen} height={capPadW} rx="1" />
            <rect class="cap-base" x={-capBaseSize / 2} y={-capBaseSize / 2} width={capBaseSize} height={capBaseSize} rx="2" />
            <circle class="cap-circle" cx="0" cy="0" r={capRadius} />
            <path class="cap-purple-half" d={`M 0 ${-capRadius} A ${capRadius} ${capRadius} 0 0 1 0 ${capRadius} Z`} />
            <text class="component-label" x="0" y={-capRadius - 6} text-anchor="middle">{conn.component.label}</text>
          {/if}
        </g>
      {/if}
    {/each}

    <g
      class="switch-group"
      transform={`translate(${switchX}, ${switchY})`}
      role="switch"
      aria-checked={powerOn}
      aria-label="Power switch"
      tabindex="0"
      onclick={toggleSwitch}
      onkeydown={handleSwitchKey}
    >
      <line
        class="switch-trace" class:on={powerOn}
        x1={switchBodyW / 2} y1={-switchLeadLen} x2={switchBodyW / 2} y2="0"
      />
      <circle
        class="via-ring switch-via-ring" class:on={powerOn}
        cx={switchBodyW / 2} cy={-switchLeadLen - switchViaGap} r={switchViaR}
      />
      <circle
        class="via-hole"
        cx={switchBodyW / 2} cy={-switchLeadLen - switchViaGap} r={switchViaR * 0.45}
      />

      <line
        class="switch-trace" class:on={powerOn}
        x1={switchBodyW / 2} y1={switchBodyH} x2={switchBodyW / 2} y2={switchBodyH + switchLeadLen}
      />
      <circle
        class="via-ring switch-via-ring" class:on={powerOn}
        cx={switchBodyW / 2} cy={switchBodyH + switchLeadLen + switchViaGap} r={switchViaR}
      />
      <circle
        class="via-hole"
        cx={switchBodyW / 2} cy={switchBodyH + switchLeadLen + switchViaGap} r={switchViaR * 0.45}
      />

      <rect class="switch-plate" x="-4" y="-4" width={switchBodyW + 8} height={switchBodyH + 8} rx="7" />
      <rect class="switch-housing" x="0" y="0" width={switchBodyW} height={switchBodyH} rx="12" />
      <rect class="switch-track" x={(switchBodyW - 8) / 2} y="6" width="8" height={switchBodyH - 12} rx="4" />

      <text class="switch-mark" x="-14" y="16" text-anchor="end" dominant-baseline="middle">|</text>
      <text class="switch-mark" x="-14" y={switchBodyH - 16} text-anchor="end" dominant-baseline="middle">○</text>

      <rect
        class="switch-knob" class:on={powerOn}
        x={(switchBodyW - switchKnobSize) / 2}
        y={powerOn ? 4 : switchBodyH - switchKnobSize - 4}
        width={switchKnobSize} height={switchKnobSize}
        rx="6"
      />
      
      <text class="silk-label" x={switchBodyW / 2} y={switchBodyH + switchLeadLen + switchViaGap + 20} text-anchor="middle">SW1</text>
    </g>

    <text class="silk-label" x={icX} y={icY - 10} text-anchor="start">IC1</text>

    <rect 
      x={icX} 
      y={icY} 
      width={safeIcW} 
      height={safeIcH} 
      rx="16" 
      class="ic-chip" 
      filter="url(#chip-shadow)"
    />
    <circle 
      class="ic-pin1" 
      class:on={powerOn}
      cx={pin1Cx} 
      cy={pin1Cy} 
      r={7} 
      filter={powerOn && isGlowEnabled ? 'url(#glow-light)' : null}
    />
    
    <text 
      text-anchor="start" 
      dominant-baseline="middle"
      class="ic-text"
      class:active={powerOn && !isBooting}
      class:booting={isBooting}
      font-size="{fontSize}px"
      onanimationend={handleTextAnimEnd}
    >
      {#each textLines as line, i}
        <tspan 
          x={textX} 
          y={textCenterY + (i - (textLines.length - 1) / 2) * lineSpacing}
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
    background: #0d0e13;
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
    fill: #0d0e13;
  }

  .ic-pad {
    fill: #cdb8f5;
    stroke: #6b4fb3;
    stroke-width: 1; 
    pointer-events: none;
  }

  .ic-pin1 {
    fill: #3a3d4d;
    transition: fill 0.3s ease;
  }
  .ic-pin1.on {
    fill: #a882ff;
  }

  .ic-chip {
    fill: #1a1b26;
    stroke-width: 4; 
  }

  .ic-text {
    fill: #383a48;
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    font-weight: 400;
    letter-spacing: 4px; 
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
    transition: fill 0.4s ease;
  }

  .ic-text.active {
    fill: #a882ff;
    text-shadow: 0 0 15px #a882ff, 0 0 30px #a882ff;
    animation: textFlicker 2.6s ease-in-out infinite;
  }

  .ic-text.booting {
    fill: #a882ff;
    text-shadow: 0 0 15px #a882ff, 0 0 30px #a882ff;
    animation: textBootFlicker 1.6s steps(1, end) 1 both;
  }

  .pcb-board.paused .ic-text.active,
  .pcb-board.paused .ic-text.booting {
    animation-play-state: paused;
  }

  @keyframes textFlicker {
    0%, 100% { opacity: 1; text-shadow: 0 0 15px #a882ff, 0 0 30px #a882ff; }
    45%      { opacity: 0.86; text-shadow: 0 0 10px #a882ff, 0 0 22px #a882ff; }
    55%      { opacity: 0.92; text-shadow: 0 0 12px #a882ff, 0 0 26px #a882ff; }
    75%      { opacity: 0.88; text-shadow: 0 0 10px #a882ff, 0 0 22px #a882ff; }
  }

  @keyframes textBootFlicker {
    0%   { opacity: 0; }
    3%   { opacity: 1; }
    6%   { opacity: 0; }
    9%   { opacity: 1; }
    11%  { opacity: 0.1; }
    14%  { opacity: 1; }
    17%  { opacity: 0; }
    21%  { opacity: 1; }
    24%  { opacity: 0.15; }
    28%  { opacity: 1; }
    35%  { opacity: 0.4; }
    40%  { opacity: 1; }
    47%  { opacity: 0.05; }
    52%  { opacity: 1; }
    62%  { opacity: 0.5; }
    68%  { opacity: 1; }
    80%  { opacity: 0.7; }
    88%  { opacity: 1; }
    100% { opacity: 1; }
  }

  .physical-trace {
    fill: none;
    stroke: #1a1b26;
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

  .physical-trace.rail {
    stroke: #a882ff;
    stroke-opacity: 0.85;
  }
  .ic-pad.rail {
    fill: #cdb8f5;
    stroke: #a882ff;
  }
  .via-ring.rail {
    stroke: #a882ff;
  }

  .rail-streak {
    fill: none;
    stroke: #dcc9ff;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
    will-change: stroke-dashoffset;
    stroke-dasharray: var(--dash-len) var(--gap-len);
    animation: signalFlow var(--duration) linear infinite;
  }

  .trace {
    fill: none;
    stroke: #a882ff;
    stroke-width: 4; 
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
    
    will-change: stroke-dashoffset;
    transform: translate3d(0, 0, 0);

    stroke-dasharray: var(--dash-len) var(--gap-len);
    stroke-dashoffset: var(--offset-start);
    animation: signalFlow var(--duration) linear forwards;
  }

  .pcb-board.paused .trace {
    animation-play-state: paused;
  }

  @keyframes signalFlow {
    0% { stroke-dashoffset: var(--offset-start); }
    100% { stroke-dashoffset: var(--offset-end); }
  }

  .silk-label {
    fill: rgba(255, 255, 255, 0.7);
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    font-size: 14px;
    letter-spacing: 1.5px;
    pointer-events: none;
  }

  .component-group {
    pointer-events: none;
  }

  .resistor-body {
    fill: #1a1b26;
    stroke: #2a2c38;
    stroke-width: 1;
  }

  .smd-pad {
    fill: #cdb8f5;
    stroke: #6b4fb3;
    stroke-width: 1;
  }

  .cap-base {
    fill: #23242e;
    stroke: #3a3c4a;
    stroke-width: 1;
  }

  .cap-circle {
    fill: #1a1b26;
    stroke: #3a3d4d;
    stroke-width: 1;
  }

  .cap-purple-half {
    fill: #a882ff;
  }

  .component-label {
    fill: rgba(255, 255, 255, 0.55);
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    font-size: 10px;
    letter-spacing: 1px;
  }

  .switch-group {
    cursor: pointer;
  }
  .switch-group:focus-visible {
    outline: none;
  }
  .switch-group:focus-visible .switch-housing {
    stroke: #a882ff;
    stroke-width: 2;
  }

  .switch-plate {
    fill: #15161c;
    stroke: #2a2c38;
    stroke-width: 1;
  }

  .switch-housing {
    fill: #23242e;
    stroke: #3a3c4a;
    stroke-width: 1.5;
    transition: stroke 0.2s ease;
  }
  .switch-group:hover .switch-housing {
    stroke: #54566a;
  }

  .switch-track {
    fill: #0a0b10;
  }

  .switch-mark {
    fill: rgba(255, 255, 255, 0.7);
    font-size: 15px;
    font-family: 'Share Tech Mono', monospace;
    pointer-events: none;
  }

  .switch-knob {
    fill: #5a5d70;
    stroke: #7c7f94;
    stroke-width: 1;
    transition: y 0.25s cubic-bezier(0.4, 0, 0.2, 1), fill 0.3s ease, stroke 0.3s ease;
  }
  .switch-knob.on {
    fill: #a882ff;
    stroke: #d3bbff;
  }

  .switch-trace {
    stroke: #1a1b26;
    stroke-width: 4;
    stroke-linecap: round;
    transition: stroke 0.3s ease;
  }
  .switch-trace.on {
    stroke: #a882ff;
  }

  .switch-via-ring.on {
    stroke: #a882ff;
  }

  @media (prefers-reduced-motion: reduce) {
    .trace { animation: none; opacity: 0; }
    .rail-streak { animation: none; opacity: 0; }
    .ic-text.active, .ic-text.booting { animation: none !important; }
    .switch-knob { transition: none; }
  }
</style>