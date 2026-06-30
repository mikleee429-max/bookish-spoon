// Main Application - fixed event handling and safer DOM access
class FuzzyEngine {
  constructor() {
    this.storage = new StorageManager();
    this.currentPage = 'profile';
    this.currentGame = null;
    this.currentGameInstance = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSettings();
    this.simulateLoading();
    this.loadProfile();
  }

  setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.navigateTo(e.currentTarget.dataset.page));
    });

    // Play vs robot buttons inside game pages
    document.addEventListener('click', (e) => {
      const btn = e.target.closest && e.target.closest('.play-vs-robot');
      if (btn) {
        const game = btn.dataset.game;
        this.startVsRobot(game);
      }
    });

    document.querySelectorAll('.game-tile').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const game = e.currentTarget.dataset.game;
        this.navigateTo(game);
        // open game page and load instance when tile clicked
        this.loadGame(game);
      });
    });

    const createRoomBtn = document.getElementById('create-room');
    if (createRoomBtn) createRoomBtn.addEventListener('click', () => this.createTournament());

    const joinBtn = document.getElementById('join-room');
    if (joinBtn) joinBtn.addEventListener('click', () => this.joinTournament());

    // theme select
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));
  }

  navigateTo(page) {
    if (!page) return;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const pageElement = document.getElementById(page);
    if (pageElement) pageElement.classList.add('active');
    const navBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
    if (navBtn) navBtn.classList.add('active');
    this.currentPage = page;
  }

  loadProfile() {
    const profile = this.storage.getProfile();
    const usernameEl = document.getElementById('profile-username');
    if (usernameEl) usernameEl.value = profile.username || '';
    const ageEl = document.getElementById('profile-age');
    if (ageEl) ageEl.value = profile.age || '';
    const idEl = document.getElementById('profile-id');
    if (idEl) idEl.textContent = profile.id || '';
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) avatarEl.textContent = profile.avatar || '👤';
    this.updateStats();
  }

  updateStats() {
    const stats = this.storage.getStats();
    const wins = document.getElementById('stat-wins'); if (wins) wins.textContent = stats.wins || 0;
    const draws = document.getElementById('stat-draws'); if (draws) draws.textContent = stats.draws || 0;
    const losses = document.getElementById('stat-losses'); if (losses) losses.textContent = stats.losses || 0;
  }

  saveProfile() {
    const username = document.getElementById('profile-username')?.value;
    const age = document.getElementById('profile-age')?.value;
    if (!username || username.length < 2) { alert('Введите имя (минимум 2 символа)'); return; }
    this.storage.updateProfile({ username, age: parseInt(age) });
    this.showNotification('Профиль сохранён');
  }

  showAvatarSelector() {
    const avatars = ['👤','😊','🤖','🎮','👾'];
    const avatar = avatars[Math.floor(Math.random()*avatars.length)];
    this.storage.updateProfile({ avatar });
    document.getElementById('profile-avatar') && (document.getElementById('profile-avatar').textContent = avatar);
    this.showNotification('Аватар изменён');
  }

  setTheme(theme) { document.body.className = `theme-${theme}`; this.storage.updateSettings({ theme }); }

  startVsRobot(gameName) {
    // load game instance into its container and pass vs: 'robot' option if supported
    this.navigateTo(gameName);
    this.loadGame(gameName, { vs: 'robot' });
    this.showNotification(`Запуск ${gameName} против робота`);
  }

  loadGame(gameName, options = {}) {
    if (!gameName) return;
    const section = document.getElementById(gameName);
    if (!section) return;
    const container = section.querySelector('.game-instance') || section;
    // clear previous instance
    container.innerHTML = '';
    // Map game name to class
    const map = {
      sudoku: 'Sudoku',
      tictactoe: 'TicTacToe',
      minesweeper: 'Minesweeper',
      chess: 'Chess',
      checkers: 'Checkers',
      battleship: 'Battleship'
    };
    const className = map[gameName];
    if (!className || typeof window[className] !== 'function') {
      // no implementation available
      container.innerHTML = '<div class="card"><p>Игра пока не реализована. Скоро обновление.</p></div>';
      return;
    }

    try {
      // instantiate game if constructor supports container and options
      const GameClass = window[className];
      // Some game constructors expect (container, options)
      const instance = new GameClass(container, options);
      this.currentGameInstance = instance;
    } catch (e) {
      console.error('Ошибка при загрузке игры', e);
      container.innerHTML = '<div class="card"><p>Ошибка при запуске игры.</p></div>';
    }
  }

  createTournament() { this.showNotification('Комната создана (демо)'); }
  joinTournament() { this.showNotification('Вход в комнату (демо)'); }
  switchShopTab(tab) { /* demo */ }

  showModal(){}
  closeModal(){}

  showNotification(message){
    // lightweight notification: console + brief floating message
    console.log('NOTIFY:',message);
    const n = document.createElement('div'); n.textContent = message; n.style.position='fixed'; n.style.right='16px'; n.style.top='16px'; n.style.background='linear-gradient(90deg,#7b5cff,#ff5b9d)'; n.style.color='#fff'; n.style.padding='8px 12px'; n.style.borderRadius='8px'; n.style.zIndex=9999; document.body.appendChild(n);
    setTimeout(()=>n.remove(),2000);
  }

  loadSettings(){ const settings = this.storage.getSettings(); document.body.className = `theme-${settings.theme || 'dark'}` }

  simulateLoading(){
    const prog = document.getElementById('loading-progress');
    const txt = document.getElementById('loading-text');
    let val=0; const interval=setInterval(()=>{ val+=Math.random()*30; if(val>100)val=100; if(prog)prog.style.width=val+'%'; if(txt)txt.textContent='Загрузка: '+Math.floor(val)+'%'; if(val>=100){ clearInterval(interval); setTimeout(()=>{ document.getElementById('loading-screen')?.classList.add('hidden'); document.getElementById('main-app')?.classList.remove('hidden'); },400); } },400);
  }
}

// Storage Manager (keeps simple API)
class StorageManager{
  constructor(){ this.prefix='fuzzy_'; this.initStorage(); }
  initStorage(){ if(!this.get('profile')){ this.set('profile',{ id:Math.random().toString(36).slice(2,9), username:'Игрок', age:18, avatar:'👤' }); } if(!this.get('stats')) this.set('stats',{ wins:0, draws:0, losses:0 }); }
  get(k){ try{ const v=localStorage.getItem(this.prefix+k); return v?JSON.parse(v):null }catch(e){return null} }
  set(k,v){ try{ localStorage.setItem(this.prefix+k,JSON.stringify(v)); }catch(e){} }
  getProfile(){ return this.get('profile')||{} }
  updateProfile(d){ const p={...this.getProfile(),...d}; this.set('profile',p); }
  getStats(){ return this.get('stats')||{wins:0,draws:0,losses:0} }
  getSettings(){ return this.get('settings')||{theme:'dark'} }
  updateSettings(s){ const cur=this.getSettings(); this.set('settings',{...cur,...s}); }
}

let app;
window.addEventListener('DOMContentLoaded',()=>{ app=new FuzzyEngine(); });
