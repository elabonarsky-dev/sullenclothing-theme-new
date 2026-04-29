/* Sullen OS 2.0 — vanilla theme JS */
(function(){
  'use strict';

  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
  const fmtMoney = cents => {
    const v = (cents/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
    return (window.Shopify && Shopify.currency) ? '$'+v : '$'+v;
  };

  /* ===== Sticky Header ===== */
  class StickyHeader extends HTMLElement{
    connectedCallback(){
      let last = window.scrollY;
      this._onScroll = () => {
        const y = window.scrollY;
        this.classList.toggle('is-scrolled', y > 4);
        this.classList.toggle('is-hidden', y > last && y > 200);
        last = y;
      };
      window.addEventListener('scroll', this._onScroll, {passive:true});
    }
    disconnectedCallback(){ window.removeEventListener('scroll', this._onScroll); }
  }
  customElements.define('sticky-header', StickyHeader);

  /* ===== Hero Slider ===== */
  class HeroSlider extends HTMLElement{
    connectedCallback(){
      this.track = $('[data-hero-track]', this);
      this.slides = $$('[data-hero-slide]', this);
      this.dots = $$('[data-hero-dot]', this);
      this.idx = 0;
      this.dots[0]?.setAttribute('aria-current','true');
      $('[data-hero-prev]', this)?.addEventListener('click', () => this.go(this.idx-1));
      $('[data-hero-next]', this)?.addEventListener('click', () => this.go(this.idx+1));
      this.dots.forEach((d,i)=>d.addEventListener('click',()=>this.go(i)));
      if(this.dataset.autoplay === 'true' && this.slides.length > 1){
        this.timer = setInterval(()=>this.go(this.idx+1), parseInt(this.dataset.interval||6)*1000);
        this.addEventListener('mouseenter',()=>clearInterval(this.timer));
      }
    }
    go(i){
      const n = this.slides.length;
      this.idx = ((i % n) + n) % n;
      this.track.style.transform = `translateX(-${this.idx*100}%)`;
      this.dots.forEach((d,k)=>d.setAttribute('aria-current', k===this.idx?'true':'false'));
    }
  }
  customElements.define('hero-slider', HeroSlider);

  /* ===== Tabbed Collections ===== */
  class TabbedCollections extends HTMLElement{
    connectedCallback(){
      const tabs = $$('[role="tab"]', this);
      const panels = $$('[role="tabpanel"]', this);
      tabs.forEach((tab,i)=>{
        tab.addEventListener('click',()=>{
          tabs.forEach(t=>t.setAttribute('aria-selected','false'));
          tab.setAttribute('aria-selected','true');
          panels.forEach((p,j)=>p.hidden = i!==j);
        });
      });
    }
  }
  customElements.define('tabbed-collections', TabbedCollections);

  /* ===== Mobile Nav ===== */
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-mobile-nav-toggle]');
    const close = e.target.closest('[data-mobile-nav-close]');
    const into = e.target.closest('[data-mobile-nav-into]');
    const back = e.target.closest('[data-mobile-nav-back]');
    const nav = $('mobile-nav');
    if(!nav) return;
    if(open){ nav.hidden = false; document.body.style.overflow='hidden'; }
    if(close){ nav.hidden = true; document.body.style.overflow=''; }
    if(into){
      $$('[data-level="0"]', nav).forEach(p=>p.hidden=true);
      const panel = $(`[data-mobile-nav-panel="${into.dataset.mobileNavInto}"]`, nav);
      if(panel) panel.hidden = false;
    }
    if(back){
      $$('[data-mobile-nav-panel]', nav).forEach(p=>p.hidden=true);
      $$('[data-level="0"]', nav).forEach(p=>p.hidden=false);
    }
  });

  /* ===== Mega Menu (hover desktop) ===== */
  $$('[data-mega-trigger]').forEach(item => {
    const handle = item.dataset.megaTrigger;
    const panel = $(`[data-mega-panel="${handle}"]`);
    if(!panel) return;
    let t;
    item.addEventListener('mouseenter',()=>{ clearTimeout(t); panel.hidden = false; });
    item.addEventListener('mouseleave',()=>{ t = setTimeout(()=>panel.hidden=true, 120); });
    panel.addEventListener('mouseenter',()=>clearTimeout(t));
    panel.addEventListener('mouseleave',()=>{ t=setTimeout(()=>panel.hidden=true,120); });
  });

  /* ===== Cart Drawer ===== */
  class CartDrawer extends HTMLElement{
    connectedCallback(){
      this.body = $('[data-cart-body]', this);
      this.subtotal = $('[data-cart-subtotal]', this);
      $$('[data-cart-close]', this).forEach(b => b.addEventListener('click',()=>this.close()));
      document.addEventListener('cart:update', e => this.refresh(e.detail));
    }
    open(){ this.hidden = false; document.body.style.overflow='hidden'; }
    close(){ this.hidden = true; document.body.style.overflow=''; }
    async refresh(){
      try {
        const [cartResp, sectionResp] = await Promise.all([
          fetch('/cart.js').then(r => r.json()),
          fetch('/?sections=cart-drawer').then(r => r.json()).catch(() => ({}))
        ]);
        $$('[data-cart-count]').forEach(el => el.textContent = cartResp.item_count);
        if (this.subtotal) this.subtotal.textContent = fmtMoney(cartResp.total_price);
        if (sectionResp['cart-drawer']) {
          const tmp = document.createElement('div');
          tmp.innerHTML = sectionResp['cart-drawer'];
          const newBody = tmp.querySelector('[data-cart-body]');
          const newSub = tmp.querySelector('[data-cart-subtotal]');
          if (newBody && this.body) this.body.innerHTML = newBody.innerHTML;
          if (newSub && this.subtotal) this.subtotal.textContent = newSub.textContent;
        }
      } catch(e) {}
    }
  }
  customElements.define('cart-drawer', CartDrawer);

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-cart-toggle]');
    if(t){ e.preventDefault(); $('cart-drawer')?.open(); }
  });

  /* ===== Cart actions (qty, remove, bundle add) ===== */
  async function cartChange(line, quantity){
    const r = await fetch('/cart/change.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({line, quantity})});
    if(r.ok){ document.dispatchEvent(new CustomEvent('cart:update')); }
  }
  async function cartAdd(items){
    const r = await fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});
    if(r.ok){
      document.dispatchEvent(new CustomEvent('cart:update'));
      $('cart-drawer')?.open();
    } else {
      const err = await r.json().catch(()=>({}));
      alert(err.description || 'Could not add to cart');
    }
    return r;
  }

  document.addEventListener('click', e => {
    const line = e.target.closest('[data-line-key]');
    if(line){
      const idx = parseInt(line.dataset.lineIndex);
      if(e.target.closest('[data-qty-up]')){
        const inp = line.querySelector('[data-qty-input]'); inp.value = parseInt(inp.value)+1; cartChange(idx, parseInt(inp.value));
      }
      if(e.target.closest('[data-qty-down]')){
        const inp = line.querySelector('[data-qty-input]'); inp.value = Math.max(0, parseInt(inp.value)-1); cartChange(idx, parseInt(inp.value));
      }
      if(e.target.closest('[data-line-remove]')){
        cartChange(idx, 0);
      }
    }
    const bAdd = e.target.closest('[data-bundle-add]');
    if(bAdd){ e.preventDefault(); cartAdd([{id: parseInt(bAdd.dataset.bundleAdd), quantity: 1}]); }
  });

  /* ===== Product Form / Variant Picker ===== */
  class ProductForm extends HTMLElement{
    connectedCallback(){
      this.form = $('[data-product-form]', this);
      this.select = $('[data-variant-select]', this);
      this.priceEl = $('[data-price]', this.closest('section'));
      this.atc = $('[data-atc]', this);
      this.atcLabel = $('[data-atc-label]', this);
      this.options = $$('[data-option-name]', this.closest('section'));

      this.options.forEach(group => {
        $$('[data-option-value]', group).forEach(btn => {
          btn.addEventListener('click', () => {
            $$('[data-option-value]', group).forEach(b => b.classList.remove('is-selected'));
            btn.classList.add('is-selected');
            const display = group.querySelector('[data-option-display]');
            if(display) display.textContent = btn.dataset.optionValue;
            this.update();
          });
        });
      });

      this.form.addEventListener('submit', async e => {
        e.preventDefault();
        const id = parseInt(this.select.value);
        const qty = parseInt(this.form.querySelector('[name="quantity"]')?.value || 1);
        this.atc.disabled = true;
        const prev = this.atcLabel.textContent;
        this.atcLabel.textContent = 'Adding…';
        await cartAdd([{id, quantity: qty}]);
        this.atc.disabled = false;
        this.atcLabel.textContent = prev;
      });
    }
    update(){
      const selected = this.options.map(g => $('.is-selected', g)?.dataset.optionValue || '');
      const target = selected.join('|');
      let matched = null;
      $$('option', this.select).forEach(opt => {
        if(opt.dataset.options === target) matched = opt;
      });
      if(matched){
        this.select.value = matched.value;
        const price = parseInt(matched.dataset.price);
        const compare = parseInt(matched.dataset.compare);
        if(this.priceEl){
          if(compare && compare > price){
            this.priceEl.innerHTML = `<span class="pdp__price-sale">${fmtMoney(price)}</span><s class="pdp__price-was">${fmtMoney(compare)}</s>`;
          } else {
            this.priceEl.innerHTML = `<span>${fmtMoney(price)}</span>`;
          }
        }
        if(matched.disabled){
          this.atc.disabled = true;
          this.atcLabel.textContent = 'Sold out';
        } else {
          this.atc.disabled = false;
          this.atcLabel.textContent = 'Add to bag';
        }
      }
    }
  }
  customElements.define('product-form', ProductForm);

  /* ===== Product Gallery ===== */
  class ProductGallery extends HTMLElement{
    connectedCallback(){
      const items = $$('[data-gallery-item]', this);
      $$('[data-gallery-thumb]', this).forEach(t => {
        t.addEventListener('click',()=>{
          const i = parseInt(t.dataset.galleryThumb);
          items.forEach((it,k)=>it.hidden = i!==k);
        });
      });
    }
  }
  customElements.define('product-gallery', ProductGallery);

  /* ===== Sticky ATC ===== */
  class StickyAtc extends HTMLElement{
    connectedCallback(){
      const buy = $('[data-sticky-atc-buy]', this);
      const mainAtc = $('[data-atc]');
      buy?.addEventListener('click',()=> mainAtc?.click());
      const mainSection = $('.pdp');
      if(!mainSection) return;
      const obs = new IntersectionObserver(entries=>{
        const e = entries[0];
        const show = !e.isIntersecting;
        this.hidden = false;
        this.toggleAttribute('data-show', show);
      }, {threshold:0});
      const target = $('[data-atc]');
      if(target) obs.observe(target);
    }
  }
  customElements.define('sticky-atc', StickyAtc);

  /* ===== Product Recommendations ===== */
  const relSection = document.querySelector('[data-recommendations-section]');
  if (relSection && relSection.dataset.productId) {
    const sectionId = relSection.dataset.recommendationsSection;
    const productId = relSection.dataset.productId;
    fetch(`/recommendations/products?section_id=${encodeURIComponent(sectionId)}&product_id=${encodeURIComponent(productId)}&limit=8`)
      .then(r => r.text())
      .then(html => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const newSection = tmp.querySelector('[data-recommendations-section]');
        if (newSection) {
          const rail = relSection.querySelector('.product-rail');
          const newRail = newSection.querySelector('.product-rail');
          if (rail && newRail) rail.innerHTML = newRail.innerHTML;
        }
      })
      .catch(() => {});
  }

  /* ===== Filters auto-submit ===== */
  $$('[data-filters] input').forEach(inp => {
    inp.addEventListener('change', () => {
      const form = inp.closest('form');
      const params = new URLSearchParams(new FormData(form));
      window.location.search = params.toString();
    });
  });

})();
