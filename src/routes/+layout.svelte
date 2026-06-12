
<script>
  let { children } = $props();
  import { slide, fly, fade } from 'svelte/transition';

  let isOpen = $state(false);
  let isNotificationsOpen = $state(false);
  let isAllActivityOpen = $state(false);
  let hasUnread = $state(true);

  const menuItems = [
    { label: 'About', href: '#about' },
    { label: 'Epoch', href: '#epoch' },
    { label: 'Events', href: '#events' },
    { label: 'Alumni', href: '#alumni' },
    { label: 'Contact', href: '#contact' }
  ];

  function toggleMenu() {
    isOpen = !isOpen;
    if (isNotificationsOpen) isNotificationsOpen = false;

    if (typeof window !== 'undefined') {
      document.body.style.overflow = isOpen || isAllActivityOpen ? 'hidden' : 'auto';
    }
  }

  function toggleNotifications() {
    isNotificationsOpen = !isNotificationsOpen;
    if (isOpen) toggleMenu(); 
  }

  function markAllAsRead() {
    hasUnread = false;
  }

  function openAllActivity(e) {
    if (e) e.preventDefault();
    isNotificationsOpen = false;
    isAllActivityOpen = true;
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAllActivity() {
    isAllActivityOpen = false;
    if (typeof window !== 'undefined') {
      // Check if mobile menu is still open before allowing body scroll again
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }
  }

  function handleResize() {
    if (typeof window !== 'undefined' && window.innerWidth >= 768 && isOpen) {
      isOpen = false;
      if (!isAllActivityOpen) {
        document.body.style.overflow = 'auto';
      }
    }
  }
</script>

<svelte:window onresize={handleResize} />

<nav class="navbar" class:bg-solid={isOpen || isAllActivityOpen}>
  <div class="nav-container">
    <a
      href="/"
      class="logo"
      onclick={() => {
        isOpen = false;
        isNotificationsOpen = false;
        isAllActivityOpen = false;
        if (typeof window !== 'undefined') document.body.style.overflow = 'auto';
      }}
    >
      <span class="logo-text">[LOGO]</span>
    </a>

    <ul class="desktop-menu">
      {#each menuItems as item (item.label)}
        <li>
          <a href={item.href} class="desktop-link" onclick={() => isAllActivityOpen = false}>
            {item.label}
          </a>
        </li>
      {/each}
    </ul>

    <div class="nav-actions">
      <button class="icon-btn" class:active={isNotificationsOpen} aria-label="Toggle notifications" onclick={toggleNotifications}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {#if hasUnread}
          <span class="notification-badge" transition:fade={{ duration: 200 }}></span>
        {/if}
      </button>

      <button class="menu-toggle" aria-label="Toggle menu" onclick={toggleMenu}>
        {#if !isOpen}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        {/if}
      </button>
    </div>
  </div>
</nav>

{#if isNotificationsOpen}
  <div class="notif-backdrop" onclick={() => isNotificationsOpen = false} transition:fade={{ duration: 200 }}></div>
  
  <div class="notifications-panel" transition:fly={{ y: -10, duration: 250 }}>
    <div class="notifications-header">
      <h4>Notifications</h4>
      {#if hasUnread}
        <button class="mark-read-btn" onclick={markAllAsRead}>Mark as read</button>
      {/if}
    </div>
    
    <ul class="notifications-list">
      <li class="notification-item" class:unread={hasUnread}>
        <div class="notif-icon info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div class="notif-content">
          <p>Registration for Epoch 2026 is officially open!</p>
          <span class="time">Just now</span>
        </div>
      </li>
      
      <li class="notification-item" class:unread={hasUnread}>
        <div class="notif-icon update">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
        </div>
        <div class="notif-content">
          <p>New workshop schedules have been updated.</p>
          <span class="time">2 hours ago</span>
        </div>
      </li>
      
      <li class="notification-item">
        <div class="notif-icon success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="notif-content">
          <p>Welcome to the College of Engineering, Trivandrum portal.</p>
          <span class="time">1 day ago</span>
        </div>
      </li>
    </ul>

    <div class="notifications-footer">
      <a href="#all-activity" onclick={openAllActivity}>View all activity</a>
    </div>
  </div>
{/if}

{#if isAllActivityOpen}
  <div class="modal-backdrop" onclick={closeAllActivity} transition:fade={{ duration: 200 }}></div>
  <div class="activity-modal-wrapper" transition:fly={{ y: 20, duration: 300 }}>
    <div class="activity-modal">
      <div class="activity-modal-header">
        <h2>All Activity</h2>
        <button class="close-btn" aria-label="Close modal" onclick={closeAllActivity}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="activity-modal-content">
        <div class="activity-timeline">
          
          <div class="timeline-group">
            <h5 class="timeline-date">Today</h5>
            
            <div class="notification-item">
              <div class="notif-icon info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div class="notif-content">
                <p>Registration for Epoch 2026 is officially open!</p>
                <span class="time">Just now</span>
              </div>
            </div>

            <div class="notification-item">
              <div class="notif-icon update">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
              </div>
              <div class="notif-content">
                <p>New workshop schedules have been updated. Check the events section.</p>
                <span class="time">2 hours ago</span>
              </div>
            </div>
          </div>

          <div class="timeline-group">
            <h5 class="timeline-date">Yesterday</h5>
            
            <div class="notification-item">
              <div class="notif-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div class="notif-content">
                <p>Welcome to the College of Engineering, Trivandrum portal.</p>
                <span class="time">1 day ago</span>
              </div>
            </div>
          </div>

          <div class="timeline-group">
            <h5 class="timeline-date">Earlier this month</h5>
            
            <div class="notification-item">
              <div class="notif-icon info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              </div>
              <div class="notif-content">
                <p>The Epoch 2025 wrap-up video is now live on our gallery page!</p>
                <span class="time">May 12</span>
              </div>
            </div>

            <div class="notification-item">
              <div class="notif-icon success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div class="notif-content">
                <p>Alumni networking session concluded successfully with over 200 participants.</p>
                <span class="time">May 05</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
{/if}

{#if isOpen}
  <div class="mobile-menu" transition:slide={{ duration: 200 }}>
    <ul class="menu-list">
      {#each menuItems as item, i (item.label)}
        <li in:fly={{ y: 20, duration: 400, delay: 100 + i * 50 }}>
          <a href={item.href} class="menu-link" onclick={toggleMenu}>
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}

{@render children()}

<style>
  /* Global / Base */
  :global(body) {
    margin: 0;
    background-color: #0c0c10;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; width: 100%; height: 70px;
    background-color: rgba(12, 12, 16, 0.8);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    z-index: 50;
    border-bottom: 1px solid rgba(187, 154, 247, 0.5);
    box-shadow: 0 4px 20px rgba(187, 154, 247, 0.4), 0 0 10px rgba(187, 154, 247, 0.3);
    transition: background-color 0.3s ease;
  }
  .navbar.bg-solid { background-color: #0c0c10; backdrop-filter: none; border-bottom-color: transparent; box-shadow: none; }
  .nav-container { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; height: 100%; }

  /* Logo */
  .logo { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: #ffffff; }
  .logo-text { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.02em; }

  /* Desktop Menu */
  .desktop-menu { display: none; list-style: none; padding: 0; margin: 0; align-items: center; gap: 2rem; }
  .desktop-link { text-decoration: none; color: #8f93a2; font-size: 1rem; font-weight: 500; transition: color 0.2s ease; }
  .desktop-link:hover { color: #ffffff; }

  /* Nav Actions */
  .nav-actions { display: flex; align-items: center; gap: 1rem; }
  .icon-btn, .menu-toggle {
    background: transparent; border: none; color: #e2e8f0; cursor: pointer; padding: 0.5rem;
    display: flex; align-items: center; justify-content: center; position: relative; z-index: 60; border-radius: 8px; transition: background-color 0.2s ease;
  }
  .icon-btn svg, .menu-toggle svg { width: 24px; height: 24px; transition: transform 0.2s ease, color 0.2s ease; }
  .icon-btn:hover, .icon-btn.active { background-color: rgba(187, 154, 247, 0.1); color: #bb9af7; }
  .notification-badge { position: absolute; top: 4px; right: 6px; width: 8px; height: 8px; background-color: #f7768e; border-radius: 50%; box-shadow: 0 0 8px rgba(247, 118, 142, 0.8); }

  /* Utilities */
  .modal-backdrop, .notif-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 44; }
  .modal-backdrop { background-color: rgba(12, 12, 16, 0.75); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 70; }

  /* Mini Notifications Panel */
  .notifications-panel {
    position: fixed; top: 80px; right: 1.5rem; width: calc(100% - 3rem); max-width: 380px;
    background-color: rgba(26, 27, 38, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(187, 154, 247, 0.2); border-radius: 12px; z-index: 45;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(187, 154, 247, 0.1); overflow: hidden;
  }
  .notifications-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); background-color: rgba(0, 0, 0, 0.2); }
  .notifications-header h4 { margin: 0; color: #c0caf5; font-size: 1.05rem; font-weight: 600; }
  .mark-read-btn { background: transparent; border: none; color: #7aa2f7; font-size: 0.8rem; cursor: pointer; padding: 0; transition: color 0.2s ease; }
  .mark-read-btn:hover { color: #bb9af7; text-decoration: underline; }
  
  .notifications-list { list-style: none; padding: 0; margin: 0; max-height: 380px; overflow-y: auto; }
  .notifications-list::-webkit-scrollbar, .activity-modal-content::-webkit-scrollbar { width: 6px; }
  .notifications-list::-webkit-scrollbar-track, .activity-modal-content::-webkit-scrollbar-track { background: transparent; }
  .notifications-list::-webkit-scrollbar-thumb, .activity-modal-content::-webkit-scrollbar-thumb { background: rgba(187, 154, 247, 0.3); border-radius: 4px; }
  .notifications-list::-webkit-scrollbar-thumb:hover, .activity-modal-content::-webkit-scrollbar-thumb:hover { background: rgba(187, 154, 247, 0.5); }
  
  .notification-item { display: flex; gap: 1rem; padding: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.03); transition: background-color 0.2s ease; cursor: default; }
  .notifications-list .notification-item:hover { background-color: rgba(255, 255, 255, 0.03); cursor: pointer; }
  .notification-item.unread { background-color: rgba(187, 154, 247, 0.05); }
  .notifications-list .notification-item.unread:hover { background-color: rgba(187, 154, 247, 0.08); }
  
  .notif-icon { flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .notif-icon svg { width: 18px; height: 18px; }
  .notif-icon.info { background-color: rgba(122, 162, 247, 0.15); color: #7aa2f7; }
  .notif-icon.update { background-color: rgba(187, 154, 247, 0.15); color: #bb9af7; }
  .notif-icon.success { background-color: rgba(158, 206, 106, 0.15); color: #9ece6a; }
  
  .notif-content { flex-grow: 1; }
  .notif-content p { margin: 0 0 0.4rem 0; color: #c0caf5; font-size: 0.9rem; line-height: 1.4; }
  .notif-content .time { display: block; font-size: 0.75rem; color: #565f89; }
  
  .notifications-footer { padding: 0.75rem; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); background-color: rgba(0, 0, 0, 0.2); }
  .notifications-footer a { color: #7aa2f7; text-decoration: none; font-size: 0.85rem; font-weight: 500; transition: color 0.2s ease; display: inline-block; padding: 0.25rem 0.5rem; }
  .notifications-footer a:hover { color: #bb9af7; }

  /* All Activity Modal */
  .activity-modal-wrapper {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 75; padding: 1.5rem; pointer-events: none;
  }
  .activity-modal {
    width: 100%; max-width: 600px; max-height: 85vh;
    background-color: rgba(26, 27, 38, 0.98); border: 1px solid rgba(187, 154, 247, 0.3); border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(187, 154, 247, 0.15);
    display: flex; flex-direction: column; pointer-events: auto; overflow: hidden;
  }
  .activity-modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  }
  .activity-modal-header h2 { margin: 0; color: #c0caf5; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.02em; }
  .close-btn {
    background: rgba(255, 255, 255, 0.05); border: none; color: #a9b1d6;
    width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s ease;
  }
  .close-btn:hover { background: rgba(247, 118, 142, 0.15); color: #f7768e; transform: rotate(90deg); }
  .close-btn svg { width: 20px; height: 20px; }

  .activity-modal-content {
    flex-grow: 1; overflow-y: auto; padding: 0;
  }
  .activity-timeline { padding: 1.5rem 2rem 2rem 2rem; }
  .timeline-group { margin-bottom: 2rem; }
  .timeline-group:last-child { margin-bottom: 0; }
  .timeline-date {
    margin: 0 0 1rem 0; color: #7aa2f7; font-size: 0.85rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  /* Modal Notification Override */
  .activity-modal .notification-item { padding: 1rem 0; border-bottom: none; }
  .activity-modal .notif-content p { font-size: 1rem; }

  /* Mobile Menu */
  .mobile-menu { position: fixed; top: 70px; left: 0; width: 100%; height: calc(100vh - 70px); background-color: #0c0c10; z-index: 40; padding: 2rem 1.5rem; box-sizing: border-box; overflow-y: auto; }
  .menu-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.75rem; }
  .menu-link { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #8f93a2; font-size: 1.125rem; font-weight: 500; transition: color 0.2s ease; }
  .menu-link:hover, .menu-link:active { color: #ffffff; }

  @media (min-width: 768px) {
    .desktop-menu { display: flex; }
    .menu-toggle { display: none; }
    .mobile-menu { display: none !important; }
    .notifications-panel { right: calc((100vw - 1200px) / 2 + 1.5rem); }
    @media (max-width: 1248px) { .notifications-panel { right: 1.5rem; } }
  }
  @media (max-width: 480px) {
    .activity-modal-wrapper { padding: 1rem; }
    .activity-modal-header, .activity-timeline { padding: 1rem 1.25rem; }
  }
</style>
