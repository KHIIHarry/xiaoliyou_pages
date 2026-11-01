const shanghai = { timeZone: 'Asia/Shanghai' };
const dateFormat = new Intl.DateTimeFormat('zh-CN', { ...shanghai, dateStyle: 'full' });
const timeFormat = new Intl.DateTimeFormat('zh-CN', { ...shanghai, timeStyle: 'medium', hourCycle: 'h23' });
function tick() {
  const now = new Date();
  document.querySelector('#day').textContent = dateFormat.format(now);
  document.querySelector('#clock').textContent = timeFormat.format(now);
}
function externalURL(value) {
  try { return ['https:', 'http:'].includes(new URL(value).protocol); }
  catch { return false; }
}
function label(tag, value, className) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = value;
  return node;
}
let toastTimer;
function showToast(message) {
  const toast = document.querySelector('#toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
    toast.textContent = '';
  }, 3000);
}
function renderApps() {
  const online = navigator.onLine;
  const apps = campusApps.filter(app => app.visible !== false).sort((a,b) => a.order-b.order);
  document.querySelector('#offline').hidden = online;
  const cards = apps.map(app => {
    const live = app.enabled && externalURL(app.url);
    const card = document.createElement(live && online ? 'a' : 'article');
    card.className = 'card';
    card.dataset.color = app.color;
    card.dataset.id = app.id;
    if (live && online) {
      card.href = app.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    } else {
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      const notify = () => showToast(live
        ? '当前离线，请连接网络后再试哦～'
        : '功能暂未上线，请耐心等待哦～');
      card.addEventListener('click', notify);
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
    }
    const top = document.createElement('div');
    top.className = 'top';
    const icon = new Image();
    icon.alt = '';
    icon.src = app.icon;
    const names = document.createElement('div');
    names.className = 'names';
    names.append(label('h3', app.name, 'name'));
    if (app.englishName) {
      const english = label('span', app.englishName, 'english-name');
      english.lang = 'en';
      names.append(english);
    }
    top.append(icon, names);
    const launched = app.status === 'launched' || live;
    let state = '即将上线';
    if (app.status === 'planned') state = '规划开发中';
    if (launched) state = online ? '已经上线' : '需联网';
    const status = label('span', state, 'status');
    status.dataset.state = launched && online ? 'launched' : 'pending';
    card.append(top, label('p',app.description,'desc'), status);
    return card;
  });
  document.querySelector('#grid').replaceChildren(...cards);
}
tick();
setInterval(tick, 1000);
renderApps();
addEventListener('online', renderApps);
addEventListener('offline', renderApps);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(error => console.warn('离线缓存注册失败', error));
}
