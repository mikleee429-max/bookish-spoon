// Main Application - fixed event handling and safer DOM access
class FuzzyEngine {
  constructor() {
    this.storage = new StorageManager();
    this.currentPage = 'profile';
    this.currentGame = null;
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

    const saveBtn = document.getElementById('save-profile-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveProfile());

    const changeAvatar = document.getElementById('change-avatar-btn');
    if (changeAvatar) changeAvatar.addEventListener('click', () => this.showAvatarSelector());

    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.setTheme(e.currentTarget.dataset.theme));
    });

    const sound = document.getElementById('sound-toggle');
    if (sound) sound.addEventListener('change', (e) => { this.storage.updateSettings({ sound: e.target.checked }); });

    document.querySelectorAll('.pvp-game-btn, .game-tile').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectPVPGame(e.currentTarget.dataset.game, e.currentTarget));
    });

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectDifficulty(e.currentTarget.dataset.difficulty, e.currentTarget));
    });

    const createRoomBtn = document.getElementById('create-room');
    if (createRoomBtn) createRoomBtn.addEventListener('click', () => this.createTournament());

    const joinBtn = document.getElementById('join-room');
    if (joinBtn) joinBtn.addEventListener('click', () => this.joinTournament());

    document.querySelectorAll('.shop-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchShopTab(e.currentTarget.dataset.tab));
    });
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

  selectPVPGame(game, node) {
    if (!game) return;
    document.querySelectorAll('.game-tile').forEach(t => t.classList.remove('active'));
    if (node) node.classList.add('active');
    this.showNotification(`Выбрана игра: ${game}`);
  }

  selectDifficulty(difficulty, node) {
    if (!difficulty) return;
    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
    if (node) node.classList.add('active');
  }

  createTournament() { this.showNotification('Комната создана (демо)'); }
  joinTournament() { this.showNotification('Вход в комнату (демо)'); }
  switchShopTab(tab) { /* demo */ }

  showModal(){}
  closeModal(){}

  showNotification(message){
    console.log('NOTIFY:',message);
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
