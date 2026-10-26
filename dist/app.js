'use strict';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const infoDialog = $('#info-dialog');
const videoDialog = $('#video-dialog');
const charactersReady = fetch('assets/characters.json').then(response => {
  if (!response.ok) throw new Error('Không tải được dữ liệu nhân vật.');
  return response.json();
});

function openInfo(html) {
  $('#dialog-content').innerHTML = html;
  infoDialog.showModal();
}
function closeVideo() { $('#video-container').replaceChildren(); }
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { if (dialog === videoDialog) closeVideo(); });
});
$$('[data-pending]').forEach(button => button.addEventListener('click', () => {
  openInfo(`<span class="pending-emblem" aria-hidden="true">⚓</span><span class="eyebrow">${button.dataset.pending.toLocaleUpperCase('vi')}</span><h2>ĐANG CẬP NHẬT</h2><p>Thông tin sẽ được cập nhật sau. Thuyền trưởng hãy theo dõi Fanpage hoặc tham gia nhóm Zalo để nhận thông báo mới nhất từ Mũ Rơm Online.</p><a class="dialog-action" href="https://zalo.me/g/k8vgyeaxoqnq5viq6c0b" target="_blank" rel="noopener noreferrer">Tham gia nhóm Zalo ↗</a>`);
}));
$$('[data-video]').forEach(button => button.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.src = 'https://www.youtube-nocookie.com/embed/Rq_TszukLhk?autoplay=1&rel=0';
  frame.title = 'Video giới thiệu Mũ Rơm Online';
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  $('#video-container').replaceChildren(frame);
  videoDialog.showModal();
}));
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  $('#main-nav').classList.toggle('open', open);
  menu.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
});
$$('#main-nav a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Mở menu');
  $('#main-nav').classList.remove('open');
}));

const articles = [
  { category: 'CẨM NANG', title: 'Chọn nhân vật: tìm phong cách chiến đấu của bạn', paragraphs: ['Mũ Rơm Online có 5 lựa chọn nhân vật: Luffy, Zoro, Sanji, Nami và Usopp. Mỗi nhân vật sở hữu bộ kỹ năng riêng, từ cận chiến đến hỗ trợ và tấn công tầm xa.', 'Luffy sử dụng những đòn đánh cao su, Zoro làm chủ Tam Kiếm Phái, Sanji chiến đấu bằng hắc cước. Nami gọi sấm sét và hỗ trợ đồng đội, còn Usopp sử dụng những loại đạn đặc biệt để tấn công từ xa.', 'Khám phá phần Nhân vật & Kỹ năng trên trang để xem từng chiêu thức trước khi chọn nhân vật.'], action: 'characters' },
  { category: 'CẬP NHẬT', title: 'Thông tin tải game và đăng ký tài khoản', paragraphs: ['Link tải game trên PC, Android và iOS cùng thông tin đăng ký tài khoản sẽ được cập nhật sau.', 'Theo dõi Fanpage Facebook và nhóm Zalo của Mũ Rơm Online để nhận thông tin mới nhất.'], action: 'community' },
  { category: 'CỘNG ĐỒNG', title: 'Tập hợp đồng đội — gia nhập băng Mũ Rơm', paragraphs: ['Một chuyến phiêu lưu luôn vui hơn khi có đồng đội. Cùng cộng đồng Mũ Rơm Online trao đổi kinh nghiệm, tìm bạn chơi và chia sẻ những khoảnh khắc trên hành trình.', 'Tham gia nhóm Zalo hoặc theo dõi Fanpage qua các liên kết chính thức trên trang.'], action: 'community' },
  { category: 'KHÁM PHÁ', title: 'Bí mật của biển cả', paragraphs: ['Những bến cảng, những hòn đảo và những kho báu đang chờ được khám phá. Chọn nhân vật của mình và bắt đầu làm quen với thế giới hải tặc.', 'Đừng quên chuẩn bị bộ kỹ năng phù hợp và tìm thêm đồng đội cho chuyến đi. Hướng dẫn hoạt động và các thông báo tiếp theo sẽ được cập nhật tại cộng đồng.'], action: 'community' },
  { category: 'KỸ NĂNG', title: '30 kỹ năng — 5 phong cách riêng biệt', paragraphs: ['Mỗi nhân vật có 6 kỹ năng, bao gồm đòn tấn công cơ bản, kỹ năng chủ động và kỹ năng bị động. Kỹ năng số 4 là nội tại, hỗ trợ sức mạnh của từng nhân vật.', 'Luffy sở hữu Gear Fourth; Zoro có Vua địa ngục; Sanji sử dụng Giáp hắc ẩn. Nami có Cơn Thịnh Nộ Của Zeus, còn Usopp có kỹ năng Điên cuồng.', 'Chọn một nhân vật, sau đó nhấn biểu tượng kỹ năng để đọc mô tả và xem hoạt ảnh. Tên và mô tả trong mục này được lấy từ dữ liệu game.'], action: 'characters' },
  { category: 'HƯỚNG DẪN', title: 'Cách sử dụng phòng xem thử kỹ năng', paragraphs: ['Chọn chân dung một thành viên băng Mũ Rơm. Thông tin, hình ảnh và bộ kỹ năng sẽ thay đổi theo nhân vật được chọn.', 'Nhấn vào một trong 6 biểu tượng để đọc mô tả và xem chiêu thức. Bạn có thể nhấn “Thi triển lại kỹ năng” để xem lại hoặc “Tư thế ban đầu” để đưa nhân vật về trạng thái nghỉ.', 'Kỹ năng bị động không có động tác thi triển riêng. Thông số năng lượng và cấp mở khóa, nếu có, được hiển thị theo cấp kỹ năng 1.'], action: 'characters' },
  { category: 'SỰ KIỆN', title: 'Lịch sự kiện sẽ được cập nhật sau', paragraphs: ['Thông tin và lịch sự kiện của Mũ Rơm Online sẽ được thông báo sau.', 'Thuyền trưởng hãy theo dõi Fanpage và nhóm Zalo để nhận thông báo khi có sự kiện mới.'], action: 'community' }
];
function openArticle(index) {
  const article = articles[index];
  if (!article) return;
  const action = article.action === 'characters' ? '<a href="#nhan-vat" class="dialog-action" id="go-characters">Khám phá nhân vật ↓</a>' : '<a class="dialog-action" href="https://zalo.me/g/k8vgyeaxoqnq5viq6c0b" target="_blank" rel="noopener noreferrer">Ghé nhóm Zalo ↗</a>';
  openInfo(`<span class="eyebrow">NHẬT KÝ ĐẠI HẢI TRÌNH · ${article.category}</span><h2>${article.title}</h2>${article.paragraphs.map(p => `<p>${p}</p>`).join('')}${action}`);
  $('#go-characters')?.addEventListener('click', () => infoDialog.close());
}
$$('[data-article]').forEach(button => button.addEventListener('click', () => openArticle(Number(button.dataset.article))));
const newsGroups = { news: [0, 1, 4, 2], guide: [5, 0, 4, 1], event: [6, 2, 1] };
function selectNews(name) {
  $$('[data-tab]').forEach(button => {
    const selected = button.dataset.tab === name;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $('#news-list').setAttribute('aria-labelledby', `tab-${name}`);
  $('#news-list').replaceChildren(...newsGroups[name].map(index => {
    const button = document.createElement('button');
    button.className = 'news-row';
    const article = articles[index];
    button.innerHTML = `<span class="news-label">${article.category}</span><strong>${article.title}</strong><span aria-hidden="true">↗</span>`;
    button.addEventListener('click', () => openArticle(index));
    return button;
  }));
}
$$('[data-tab]').forEach(button => button.addEventListener('click', () => selectNews(button.dataset.tab)));
selectNews('news');

function keyboardTabs(container, selector) {
  container.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = $$(selector, container);
    const selected = tabs.indexOf(document.activeElement);
    if (selected < 0) return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : (selected + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[index].focus();
    tabs[index].click();
  });
}
keyboardTabs($('.news-tabs'), '[role="tab"]');

// Exact exported Spine 4.1 data from the client, rendered by the matching official runtime.
class CharacterStage {
  constructor(canvas, mode) {
    this.canvas = canvas;
    this.mode = mode;
    this.cache = new Map();
    this.inflight = new Map();
    this.items = [];
    this.visible = false;
    this.lastTime = performance.now();
    this.context = new spine.ManagedWebGLRenderingContext(canvas, { alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
    this.gl = this.context.gl;
    if (!this.gl) throw new Error('WebGL unavailable');
    this.shader = spine.Shader.newTwoColoredTextured(this.context);
    this.batcher = new spine.PolygonBatcher(this.context);
    this.renderer = new spine.SkeletonRenderer(this.context);
    this.renderer.premultipliedAlpha = true;
    this.assets = new spine.AssetManager(this.context);
    this.matrix = new spine.Matrix4();
    if (mode === 'preview') {
      this.stage = canvas.parentElement.querySelector('.character-stage');
      this.layoutObserver = new ResizeObserver(() => { this.previewLayout = null; });
      this.layoutObserver.observe(canvas);
      this.layoutObserver.observe(this.stage);
    }
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    new IntersectionObserver(entries => { this.visible = entries[0].isIntersecting; }, { rootMargin: '80px' }).observe(canvas);
    this.frame = this.frame.bind(this);
    requestAnimationFrame(this.frame);
  }
  async load(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    if (this.inflight.has(id)) return this.inflight.get(id);
    const path = `assets/characters/${id}/skeleton`;
    const promise = Promise.all([
      new Promise((resolve, reject) => this.assets.loadText(path + '.json', resolve, reject)),
      new Promise((resolve, reject) => this.assets.loadTextureAtlas(path + '.atlas', resolve, reject))
    ]).then(() => {
      const loader = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(this.assets.require(path + '.atlas')));
      const data = loader.readSkeletonData(this.assets.require(path + '.json'));
      const skeleton = new spine.Skeleton(data);
      skeleton.setSkinByName('default');
      const stateData = new spine.AnimationStateData(data);
      stateData.defaultMix = .12;
      const state = new spine.AnimationState(stateData);
      state.setAnimation(0, 'idle', true);
      state.apply(skeleton);
      skeleton.updateWorldTransform();
      const offset = new spine.Vector2(), size = new spine.Vector2();
      skeleton.getBounds(offset, size, []);
      const item = { id, skeleton, state, offset, size, frameCount: 0, animationBounds: new Map() };
      item.viewBounds = { minX: offset.x, minY: offset.y, maxX: offset.x + size.x, maxY: offset.y + size.y };
      item.animationBounds.set('idle', item.viewBounds);
      this.cache.set(id, item);
      return item;
    });
    this.inflight.set(id, promise);
    return promise;
  }
  async select(id) {
    clearTimeout(this.transformTimer);
    this.playVersion = (this.playVersion || 0) + 1;
    this.requested = id;
    const item = await this.load(id);
    if (this.requested !== id) return;
    this.reset(item);
    this.base = item;
    this.items = [item];
    this.canvas.dataset.character = String(id);
    this.canvas.dataset.ready = 'true';
  }
  reset(item = this.base || this.items[0]) {
    if (!item) return;
    clearTimeout(this.transformTimer);
    this.playVersion = (this.playVersion || 0) + 1;
    if (this.mode === 'preview') this.items = [item];
    item.skeleton.setToSetupPose();
    item.state.clearTracks();
    item.state.setAnimation(0, 'idle', true);
    item.viewBounds = item.animationBounds.get('idle');
    this.canvas.dataset.animation = 'idle';
    delete this.canvas.dataset.form;
  }
  play(animation) {
    const item = this.base || this.items[0];
    if (!item) return;
    this.reset(item);
    const version = this.playVersion;
    item.skeleton.setToSetupPose();
    const actual = item.skeleton.data.findAnimation(animation) ? animation : animation === 'skill_1_1' && item.skeleton.data.findAnimation('skill_1') ? 'skill_1' : 'idle';
    item.viewBounds = this.measureAnimation(item, actual);
    item.state.clearTracks();
    item.state.setAnimation(0, actual, actual === 'idle');
    if (actual !== 'idle') item.state.addAnimation(0, 'idle', true, 0);
    this.canvas.dataset.animation = actual;
    this.canvas.dataset.skillRequested = animation;
    this.manualUntil = performance.now() + 6000;
    if (animation === 'skill_6' && (item.id === 1 || item.id === 3)) {
      // Same transformation delay used by CreateCharacterController in the client.
      const form = item.id === 1 ? '1-gear4' : '3-stealth';
      this.transformTimer = setTimeout(async () => {
        try {
          const transformed = await this.load(form);
          if (this.playVersion !== version || this.requested !== item.id) return;
          transformed.skeleton.setToSetupPose();
          transformed.state.clearTracks();
          transformed.state.setAnimation(0, 'idle', true);
          this.items = [transformed];
          this.canvas.dataset.form = form;
        } catch (error) { console.warn('Transformation unavailable:', error); }
      }, item.id === 1 ? 1900 : 1200);
    }
  }
  measureAnimation(item, name) {
    if (item.animationBounds.has(name)) return item.animationBounds.get(name);
    const animation = item.skeleton.data.findAnimation(name);
    const probe = new spine.Skeleton(item.skeleton.data);
    probe.setSkinByName('default');
    const state = new spine.AnimationState(new spine.AnimationStateData(probe.data));
    state.setAnimation(0, name, false);
    const offset = new spine.Vector2(), size = new spine.Vector2();
    const bounds = { ...item.animationBounds.get('idle') };
    // Frame the complete move, including its longest punch, jump and attached effects.
    // Sample once per clip, cache the result, and keep the camera steady throughout.
    const steps = Math.max(1, Math.ceil(animation.duration * 60));
    for (let frame = 0; frame <= steps; frame++) {
      if (frame) state.update(animation.duration / steps);
      state.apply(probe);
      probe.updateWorldTransform();
      probe.getBounds(offset, size, []);
      if (![offset.x, offset.y, size.x, size.y].every(Number.isFinite)) continue;
      bounds.minX = Math.min(bounds.minX, offset.x);
      bounds.minY = Math.min(bounds.minY, offset.y);
      bounds.maxX = Math.max(bounds.maxX, offset.x + size.x);
      bounds.maxY = Math.max(bounds.maxY, offset.y + size.y);
    }
    const result = Number.isFinite(bounds.minX) ? bounds : item.animationBounds.get('idle');
    item.animationBounds.set(name, result);
    return result;
  }
  getPreviewLayout() {
    if (this.previewLayout) return this.previewLayout;
    const stage = this.stage.getBoundingClientRect();
    const canvas = this.canvas.getBoundingClientRect();
    const style = getComputedStyle(this.stage);
    const top = parseFloat(style.getPropertyValue('--preview-top'));
    const height = parseFloat(style.getPropertyValue('--preview-height'));
    const anchor = parseFloat(style.getPropertyValue('--preview-anchor')) / 100;
    this.previewLayout = {
      x: stage.left - canvas.left + stage.width * anchor,
      floor: canvas.height - (stage.top - canvas.top + top + height * .975),
      height: height * .88
    };
    return this.previewLayout;
  }
  frame(now) {
    requestAnimationFrame(this.frame);
    const delta = Math.min((now - this.lastTime) / 1000, .05);
    this.lastTime = now;
    if (!this.visible || document.hidden || !this.items.length) return;
    const canvas = this.canvas, gl = this.gl;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    const pixelRatio = Math.min(devicePixelRatio || 1, 1.7);
    if (canvas.width !== Math.round(width * pixelRatio) || canvas.height !== Math.round(height * pixelRatio)) {
      canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    this.matrix.ortho2d(0, 0, width, height);
    this.shader.bind();
    this.shader.setUniformi(spine.Shader.SAMPLER, 0);
    this.shader.setUniform4x4f(spine.Shader.MVP_MATRIX, this.matrix.values);
    this.batcher.begin(this.shader);
    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];
      const hero = this.mode === 'hero';
      if (!hero && item.state.getCurrent(0)?.animation.name === 'idle') {
        item.viewBounds = item.animationBounds.get('idle');
      }
      const narrowHero = hero && width < 700;
      const layout = hero ? null : this.getPreviewLayout();
      const targetHeight = hero ? height * (index === 1 ? .94 : narrowHero ? .69 : .83) : layout.height;
      const bounds = item.viewBounds;
      const padding = 24;
      const scale = Math.min(targetHeight / Math.max(1, item.size.y),
        hero ? Infinity : (width - padding * 2) / Math.max(1, bounds.maxX - bounds.minX),
        hero ? Infinity : (height - padding * 2) / Math.max(1, bounds.maxY - bounds.minY));
      item.skeleton.scaleX = scale; item.skeleton.scaleY = scale;
      const x = hero ? width * (narrowHero ? [ .33, .5, .72 ] : [ .27, .5, .74 ])[index] : layout.x;
      const desiredX = x - (item.offset.x + item.size.x * .5) * scale;
      const desiredY = (hero ? height * (index === 1 ? .015 : .03) : layout.floor) - item.offset.y * scale;
      item.skeleton.x = hero ? desiredX : Math.max(padding - bounds.minX * scale, Math.min(width - padding - bounds.maxX * scale, desiredX));
      item.skeleton.y = hero ? desiredY : Math.max(padding - bounds.minY * scale, Math.min(height - padding - bounds.maxY * scale, desiredY));
      const animate = !this.reduced || now < (this.manualUntil || 0);
      if (animate || item.frameCount === 0) item.state.update(animate ? delta : 0);
      item.state.apply(item.skeleton);
      item.skeleton.updateWorldTransform();
      if (!hero) {
        // Also contain blended transition frames between a skill and idle.
        const poseOffset = new spine.Vector2(), poseSize = new spine.Vector2();
        item.skeleton.getBounds(poseOffset, poseSize, []);
        const correction = Math.min(1, (width - padding * 2) / Math.max(1, poseSize.x), (height - padding * 2) / Math.max(1, poseSize.y));
        if (correction < 1) {
          item.skeleton.scaleX *= correction;
          item.skeleton.scaleY *= correction;
          item.skeleton.updateWorldTransform();
          item.skeleton.getBounds(poseOffset, poseSize, []);
        }
        const moveX = Math.max(padding, Math.min(width - padding - poseSize.x, poseOffset.x)) - poseOffset.x;
        const moveY = Math.max(padding, Math.min(height - padding - poseSize.y, poseOffset.y)) - poseOffset.y;
        if (moveX || moveY) {
          item.skeleton.x += moveX;
          item.skeleton.y += moveY;
          item.skeleton.updateWorldTransform();
        }
      }
      this.renderer.draw(this.batcher, item.skeleton);
      item.frameCount++;
    }
    this.batcher.end(); this.shader.unbind();
    canvas.dataset.rendered = 'true';
  }
}

let previewStage;
let selectedCharacter;
let selectedSkill;
let selectionVersion = 0;
const fullNames = ['MONKEY D. LUFFY', 'RORONOA ZORO', 'VINSMOKE SANJI', 'NAMI', 'USOPP'];
function showSkill(skill, play = true) {
  selectedSkill = skill;
  $$('.skill-button').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.skill) === skill.id)));
  const passive = skill.id === 4;
  $('#skill-type').textContent = passive ? 'NỘI TẠI · BỊ ĐỘNG' : skill.id === 1 ? 'ĐÒN ĐÁNH CƠ BẢN' : skill.id === 6 ? 'TUYỆT KỸ' : 'KỸ NĂNG CHỦ ĐỘNG';
  $('#skill-position').textContent = `0${skill.id} / 06`;
  $('#skill-name').textContent = skill.name;
  $('#skill-description').textContent = skill.description;
  const meta = [];
  if (Number.isFinite(skill.level)) meta.push(`<span>Cấp mở khóa <b>${skill.level}</b></span>`);
  if (!passive && Number.isFinite(skill.mana)) meta.push(`<span>Năng lượng <b>${skill.mana} MP</b></span>`);
  if (passive) meta.push('<span>Tự động hỗ trợ nhân vật · Không có động tác thi triển</span>');
  $('#skill-meta').innerHTML = meta.join('');
  $('#replay-skill').disabled = passive || !previewStage || $('#character-canvas').dataset.ready !== 'true';
  if (play) previewStage?.play(skill.animation);
}
async function chooseCharacter(character, first = false) {
  selectedCharacter = character;
  const version = ++selectionVersion;
  $$('.character-tab').forEach(button => {
    const active = Number(button.dataset.character) === character.id;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  $('#character-panel').setAttribute('aria-labelledby', `character-tab-${character.id}`);
  $('#character-number').textContent = `CREW MEMBER / 0${character.id}`;
  $('#character-name').textContent = character.name.toUpperCase();
  $('#character-role').textContent = character.role;
  $('#character-description').textContent = character.description;
  $('#stage-name').textContent = fullNames[character.id - 1];
  $('#character-canvas').setAttribute('aria-label', `Hoạt ảnh nhân vật ${character.name}`);
  $('#character-canvas').dataset.ready = 'false';
  $('#skill-buttons').replaceChildren(...character.skills.map(skill => {
    const button = document.createElement('button');
    button.className = 'skill-button';
    button.dataset.skill = String(skill.id);
    button.setAttribute('aria-label', `Kỹ năng ${skill.id}: ${skill.name}${skill.id === 4 ? ' (Bị động)' : ''}`);
    button.setAttribute('aria-pressed', 'false');
    button.title = skill.name;
    button.innerHTML = `<img src="assets/skill-${character.id}-${skill.id}.png" alt="">${skill.id === 4 ? '<span class="passive-dot" aria-hidden="true"></span>' : ''}`;
    button.addEventListener('click', () => showSkill(skill));
    return button;
  }));
  showSkill(character.skills[first ? 0 : 1], false);
  if (previewStage) {
    try {
      await previewStage.select(character.id);
      if (version !== selectionVersion) return;
      $('#replay-skill').disabled = selectedSkill.id === 4;
      $('.preview-unavailable').hidden = true;
    } catch (error) {
      console.error('Character preview:', error);
      if (version !== selectionVersion) return;
      $('.preview-unavailable').hidden = false;
    }
  }
}
$('#replay-skill').addEventListener('click', () => { if (selectedSkill) previewStage?.play(selectedSkill.animation); });
$('#reset-preview').addEventListener('click', () => previewStage?.reset());

async function initCharacters() {
  const characters = await charactersReady;
  $('#character-tabs').replaceChildren(...characters.map(character => {
    const button = document.createElement('button');
    button.className = 'character-tab';
    button.id = `character-tab-${character.id}`;
    button.dataset.character = String(character.id);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', 'character-panel');
    button.setAttribute('aria-selected', 'false');
    button.innerHTML = `<span class="portrait-frame"><img src="assets/portrait-${character.id}.png" alt="" loading="lazy"></span><span>${character.name.toUpperCase()}</span>`;
    button.addEventListener('click', () => chooseCharacter(character));
    return button;
  }));
  keyboardTabs($('#character-tabs'), '[role="tab"]');
  try {
    previewStage = new CharacterStage($('#character-canvas'), 'preview');
  } catch (error) {
    console.warn('WebGL preview unavailable:', error);
    $('.preview-unavailable').hidden = false;
    $('#reset-preview').disabled = true;
  }
  await chooseCharacter(characters[0], true);
  try {
    const heroStage = new CharacterStage($('#hero-canvas'), 'hero');
    const heroes = await Promise.all([2, 1, 3].map(id => heroStage.load(id)));
    heroStage.items = heroes;
    $('#hero-canvas').dataset.ready = 'true';
    $('.hero-loading').hidden = true;
  } catch (error) {
    console.warn('Hero preview unavailable:', error);
    $('.hero-loading').textContent = 'LUFFY · ZORO · SANJI';
  }
}
initCharacters().catch(error => {
  console.error(error);
  $('#character-description').textContent = 'Chưa tải được dữ liệu nhân vật. Vui lòng tải lại trang.';
  $('.hero-loading').textContent = 'Chưa tải được hình ảnh. Vui lòng tải lại trang.';
});

const navObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    $$('#main-nav a[href^="#"]').forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id));
  }
}, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
['trang-chu', 'tin-tuc', 'nhan-vat'].forEach(id => navObserver.observe(document.getElementById(id)));
