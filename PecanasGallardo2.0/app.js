document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var WHATSAPP_NUMBER = '51973330141';
  var WHATSAPP_BASE   = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=';
  var currentCategory = null;
  var originalOrder = [];
  var categoriesMap  = {};
  var allCategories  = [];
  var cart = [];
  var searchDebounceTimer = null;

  // ============================
  // DOM HELPERS
  // ============================
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // ============================
  // ELEMENTS
  // ============================
  var sidebar        = $('#sidebar');
  var sidebarToggle  = $('#sidebarToggle');
  var sidebarOverlay = $('#sidebarOverlay');
  var sidebarNav     = $('.sidebar-nav');
  var viewWelcome    = $('#viewWelcome');
  var viewCategory   = $('#viewCategory');
  var productsGrid   = $('#productsGrid');
  var categoryTitle  = $('#categoryTitle');
  var breadcrumbCat  = $('#breadcrumbCategory');
  var resultCount    = $('#resultCount');
  var sortSelect     = $('#sortSelect');
  var btnBack        = $('#btnBack');
  var breadcrumbHome = $('#breadcrumbHome');
  var logoLink       = $('#logoLink');
  var cartLink       = $('#cartLink');
  var cartCountEl    = $('#cartCount');
  var cartModal      = $('#cartModal');
  var cartModalBody  = $('#cartModalBody');
  var cartModalFooter= $('#cartModalFooter');
  var cartModalClose = $('#cartModalClose');
  var cartSubtotalEl = $('#cartSubtotal');
  var cartTotalEl    = $('#cartTotal');
  var btnCheckout    = $('#btnCheckoutWhatsApp');
  var authBtn        = $('#authBtn');
  var authModal      = $('#authModal');
  var authModalClose = $('#authModalClose');
  var userBadge      = $('#userBadge');
  var userDisplayName= $('#userDisplayName');
  var btnLogout      = $('#btnLogout');
  var loginForm      = $('#loginForm');
  var registerForm   = $('#registerForm');
  var authMessage    = $('#authMessage');
  var searchInput    = $('.top-bar-search input');

  // ============================
  // SIDEBAR TOGGLE (mobile)
  // ============================
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // ============================
  // BUILD SIDEBAR FROM DB
  // ============================
  function buildSidebar(categories) {
    $$('.sidebar-link:not([data-category="welcome"])', sidebarNav).forEach(function (el) {
      el.remove();
    });

    categories.forEach(function (cat) {
      var a = document.createElement('a');
      a.href = '#';
      a.className = 'sidebar-link';
      a.dataset.category = cat.slug;
      a.innerHTML = '<i class="' + cat.icon + '"></i> ' + cat.name;
      sidebarNav.appendChild(a);

      a.addEventListener('click', function (e) {
        e.preventDefault();
        showCategory(cat.slug);
      });
    });
  }

  // ============================
  // SHOW WELCOME VIEW
  // ============================
  function showWelcome() {
    currentCategory = null;
    viewWelcome.style.display = '';
    viewCategory.style.display = 'none';
    $$('.sidebar-link').forEach(function (l) { l.classList.remove('active'); });
    var welcomeLink = $('[data-category="welcome"]');
    if (welcomeLink) welcomeLink.classList.add('active');
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================
  // SHOW CATEGORY VIEW (async)
  // ============================
  function showCategory(slug) {
    var catInfo = categoriesMap[slug];
    var title = catInfo ? catInfo.name : slug;

    currentCategory = slug;
    viewWelcome.style.display = 'none';
    viewCategory.style.display = '';
    categoryTitle.textContent = title;
    breadcrumbCat.textContent = title;

    $$('.sidebar-link').forEach(function (l) { l.classList.remove('active'); });
    var activeLink = $('[data-category="' + slug + '"]');
    if (activeLink) activeLink.classList.add('active');

    productsGrid.innerHTML = '<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Cargando productos...</div>';

    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    DB.getProductsByCategory(slug).then(function (items) {
      renderProducts(items);
    });
  }

  // ============================
  // RENDER PRODUCT CARDS
  // ============================
  function renderProducts(items) {
    productsGrid.innerHTML = '';
    originalOrder = [];

    if (!items || items.length === 0) {
      productsGrid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-box-open"></i><p>No se encontraron productos en esta categoria.</p></div>';
      updateResultCount(0);
      return;
    }

    items.forEach(function (item) {
      var variants = Object.keys(item.prices);
      var defaultV = item.defaultVariant || variants[0] || '';
      var minPrice = Math.min.apply(null, variants.map(function (v) { return item.prices[v]; }));
      var maxPrice = Math.max.apply(null, variants.map(function (v) { return item.prices[v]; }));

      var card = document.createElement('article');
      card.className = 'product-card';
      card.dataset.priceMin = minPrice;
      card.dataset.name = item.name;

      var specsHTML = item.specs.map(function (s) {
        return s[1]
          ? '<li><strong>' + escHTML(s[0]) + ':</strong> ' + escHTML(s[1]) + '</li>'
          : '<li>' + escHTML(s[0]) + '</li>';
      }).join('');

      var optionsHTML = variants.map(function (v) {
        var sel = v === defaultV ? ' selected' : '';
        return '<option value="' + v + '"' + sel + '>' + v + ' - S/ ' + item.prices[v].toFixed(2) + '</option>';
      }).join('');

      card.innerHTML =
        '<div class="product-image">' +
          '<img src="' + escAttr(item.img) + '" alt="' + escAttr(item.name) + '">' +
          '<span class="badge-origin">Origen: ' + escHTML(item.origin) + '</span>' +
        '</div>' +
        '<div class="product-info">' +
          '<h3 class="product-name">' + escHTML(item.name) + '</h3>' +
          '<p class="product-price" data-prices=\'' + escAttr(JSON.stringify(item.prices)) + '\'>' +
            'S/ ' + item.prices[defaultV].toFixed(2) +
            ' <span class="unit">/unidad</span>' +
          '</p>' +
          '<ul class="product-specs">' + specsHTML + '</ul>' +
          '<div class="variant-select">' +
            '<label>Presentacion:</label>' +
            '<select class="variant-selector">' + optionsHTML + '</select>' +
          '</div>' +
          '<div class="product-actions">' +
            '<button class="btn-add-cart" data-name="' + escAttr(item.name) + '" data-variant="' + escAttr(defaultV) + '" data-img="' + escAttr(item.img) + '">' +
              '<i class="fa-solid fa-cart-plus"></i> Anadir al carrito' +
            '</button>' +
            '<button class="btn-whatsapp" data-name="' + escAttr(item.name) + '">' +
              '<i class="fa-brands fa-whatsapp"></i> Consultar' +
            '</button>' +
          '</div>' +
        '</div>';

      productsGrid.appendChild(card);
      originalOrder.push(card);
    });

    updateResultCount(items.length);
    bindCardEvents();
  }

  // ============================
  // HTML ESCAPE HELPERS
  // ============================
  function escHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  function escAttr(str) {
    return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ============================
  // BIND EVENTS ON CARDS
  // ============================
  function bindCardEvents() {

    // Variant selector -> price update
    $$('.variant-selector', productsGrid).forEach(function (sel) {
      sel.addEventListener('change', function () {
        var card = sel.closest('.product-card');
        if (!card) return;
        var priceEl = $('.product-price', card);
        if (!priceEl) return;

        var prices;
        try { prices = JSON.parse(priceEl.dataset.prices); } catch (e) { return; }

        var variant = sel.value;
        var price = prices[variant];
        if (price !== undefined) {
          priceEl.textContent = 'S/ ' + price.toFixed(2) + ' /unidad';
          priceEl.style.color = '#D97706';
          setTimeout(function () { priceEl.style.color = ''; }, 600);
        }

        var btn = $('.btn-add-cart', card);
        if (btn) btn.dataset.variant = variant;
      });
    });

    // Add to cart
    $$('.btn-add-cart', productsGrid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name    = btn.dataset.name || 'producto';
        var variant = btn.dataset.variant || '';
        var img     = btn.dataset.img || '';
        var card    = btn.closest('.product-card');
        var price   = 0;
        if (card) {
          var priceEl = $('.product-price', card);
          if (priceEl) {
            var prices;
            try { prices = JSON.parse(priceEl.dataset.prices); } catch (e) { }
            if (prices && prices[variant] !== undefined) {
              price = prices[variant];
            }
          }
        }

        addToCart({ name: name, variant: variant, price: price, img: img, quantity: 1 });

        var origHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Anadido!';
        btn.style.background = '#1a4d2e';
        btn.disabled = true;

        showToast(name + ' (' + variant + ') - S/ ' + price.toFixed(2) + ' anadido al carrito');

        setTimeout(function () {
          btn.innerHTML = origHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 1500);
      });
    });

    // WhatsApp per product
    $$('.btn-whatsapp', productsGrid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card   = btn.closest('.product-card');
        var name   = btn.dataset.name || 'producto';
        var select = card ? $('.variant-selector', card) : null;
        var variant = select ? select.value : '';
        var priceText = '';
        if (card) {
          var p = $('.product-price', card);
          if (p) priceText = p.textContent.trim();
        }
        openWhatsApp(
          'Hola, buenas tardes. Me pueden dar informacion sobre ' +
          name + (variant ? ' en presentacion de ' + variant : '') +
          (priceText ? '. Precio: ' + priceText : '') +
          '. Gracias!'
        );
      });
    });
  }

  // ============================
  // TOAST
  // ============================
  function showToast(message) {
    var existing = $('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<i class="fa-solid fa-check-circle"></i> ' + message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () { toast.classList.add('show'); });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 2500);
  }

  // ============================
  // WHATSAPP HELPER
  // ============================
  function openWhatsApp(message) {
    window.open(WHATSAPP_BASE + encodeURIComponent(message), '_blank');
  }

  // ============================
  // RESULT COUNT
  // ============================
  function updateResultCount(total) {
    if (total === undefined) {
      total = $$('.product-card', productsGrid).length;
    }
    if (resultCount) {
      resultCount.textContent = 'Mostrando 1\u2013' + total + ' de ' + total + ' resultados';
    }
  }

  // ============================
  // SORT
  // ============================
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var cards = $$('.product-card', productsGrid);
      var value = sortSelect.value;

      if (value === 'default') {
        originalOrder.forEach(function (c) { productsGrid.appendChild(c); });
      } else {
        cards.sort(function (a, b) {
          var aV, bV;
          if (value === 'name-asc') {
            aV = (a.dataset.name || '').toLowerCase();
            bV = (b.dataset.name || '').toLowerCase();
            return aV < bV ? -1 : aV > bV ? 1 : 0;
          }
          aV = parseFloat(a.dataset.priceMin) || 0;
          bV = parseFloat(b.dataset.priceMin) || 0;
          return value === 'price-asc' ? aV - bV : bV - aV;
        });
        cards.forEach(function (c) { productsGrid.appendChild(c); });
      }
    });
  }

  // ============================
  // SEARCH (real-time + submit)
  // ============================
  function performSearch(query) {
    if (!query) {
      if (currentCategory) {
        showCategory(currentCategory);
      } else {
        showWelcome();
      }
      return;
    }

    viewWelcome.style.display = 'none';
    viewCategory.style.display = '';
    categoryTitle.textContent = 'Resultados de busqueda';
    breadcrumbCat.textContent = 'Busqueda: "' + query + '"';
    $$('.sidebar-link').forEach(function (l) { l.classList.remove('active'); });

    productsGrid.innerHTML = '<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Buscando...</div>';
    closeSidebar();

    DB.searchProducts(query).then(function (results) {
      renderProducts(results);
    });
  }

  // Real-time search on input
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.toLowerCase().trim();
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(function () {
        performSearch(query);
      }, 300);
    });
  }

  // Submit fallback
  var searchForm = $('.top-bar-search');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', searchForm);
      var query = (input ? input.value : '').toLowerCase().trim();
      clearTimeout(searchDebounceTimer);
      performSearch(query);
    });
  }

  // ============================
  // CART LOGIC
  // ============================
  function addToCart(item) {
    var existing = -1;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === item.name && cart[i].variant === item.variant) {
        existing = i;
        break;
      }
    }
    if (existing >= 0) {
      cart[existing].quantity += 1;
    } else {
      cart.push({
        name:     item.name,
        variant:  item.variant,
        price:    item.price,
        img:      item.img,
        quantity: 1
      });
    }
    saveCart();
    updateCartBadge();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCartModal();
  }

  function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      removeFromCart(index);
      return;
    }
    saveCart();
    updateCartBadge();
    renderCartModal();
  }

  function getCartSubtotal() {
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].quantity;
    }
    return total;
  }

  function updateCartBadge() {
    var totalItems = 0;
    for (var i = 0; i < cart.length; i++) {
      totalItems += cart[i].quantity;
    }
    if (cartCountEl) {
      cartCountEl.textContent = totalItems;
      cartCountEl.classList.remove('bounce');
      void cartCountEl.offsetWidth;
      cartCountEl.classList.add('bounce');
    }
  }

  function renderCartModal() {
    if (!cartModalBody) return;

    if (cart.length === 0) {
      cartModalBody.innerHTML =
        '<div class="cart-empty">' +
          '<i class="fa-solid fa-cart-shopping"></i>' +
          '<p>Tu carrito esta vacio</p>' +
        '</div>';
      if (cartModalFooter) cartModalFooter.style.display = 'none';
      return;
    }

    var html = '';
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var itemTotal = (item.price * item.quantity).toFixed(2);
      html +=
        '<div class="cart-item">' +
          '<img class="cart-item-img" src="' + escAttr(item.img) + '" alt="' + escAttr(item.name) + '">' +
          '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + escHTML(item.name) + '</div>' +
            '<div class="cart-item-variant">' + escHTML(item.variant) + '</div>' +
            '<div class="cart-item-price">S/ ' + item.price.toFixed(2) + ' /unidad</div>' +
            '<div class="cart-item-controls">' +
              '<button class="cart-qty-btn" data-idx="' + i + '" data-delta="-1">-</button>' +
              '<span class="cart-qty-num">' + item.quantity + '</span>' +
              '<button class="cart-qty-btn" data-idx="' + i + '" data-delta="1">+</button>' +
            '</div>' +
            '<div class="cart-item-subtotal">Subtotal: S/ ' + itemTotal + '</div>' +
          '</div>' +
          '<button class="cart-item-remove" data-idx="' + i + '" title="Eliminar"><i class="fa-solid fa-trash"></i></button>' +
        '</div>';
    }

    cartModalBody.innerHTML = html;

    // Bind qty buttons
    $$('.cart-qty-btn', cartModalBody).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx   = parseInt(btn.dataset.idx, 10);
        var delta = parseInt(btn.dataset.delta, 10);
        changeQty(idx, delta);
      });
    });

    // Bind remove buttons
    $$('.cart-item-remove', cartModalBody).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.idx, 10);
        removeFromCart(idx);
      });
    });

    // Update summary
    var subtotal = getCartSubtotal();
    if (cartSubtotalEl) cartSubtotalEl.textContent = 'S/ ' + subtotal.toFixed(2);
    if (cartTotalEl)    cartTotalEl.textContent    = 'S/ ' + subtotal.toFixed(2);
    if (cartModalFooter) cartModalFooter.style.display = '';
  }

  function saveCart() {
    try {
      localStorage.setItem('pecanas_cart', JSON.stringify(cart));
    } catch (e) { }
  }

  function loadCart() {
    try {
      var stored = localStorage.getItem('pecanas_cart');
      if (stored) {
        cart = JSON.parse(stored);
        if (!Array.isArray(cart)) cart = [];
      }
    } catch (e) {
      cart = [];
    }
    updateCartBadge();
  }

  function checkoutWhatsApp() {
    if (cart.length === 0) return;

    var lines = ['*Pedido - Pecanas Gallardo*', ''];
    var subtotal = getCartSubtotal();

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var lineTotal = (item.price * item.quantity).toFixed(2);
      lines.push(
        '- ' + item.name + ' (' + item.variant + ')' +
        ' x' + item.quantity +
        ' = S/ ' + lineTotal
      );
    }

    lines.push('');
    lines.push('Subtotal: S/ ' + subtotal.toFixed(2));
    lines.push('Envio: Gratis');
    lines.push('*Total: S/ ' + subtotal.toFixed(2) + '*');
    lines.push('');
    lines.push('Quisiera confirmar mi pedido. Gracias!');

    openWhatsApp(lines.join('\n'));

    // Clear cart after sending
    cart = [];
    saveCart();
    updateCartBadge();
    renderCartModal();
    closeModal(cartModal);
    showToast('Pedido enviado por WhatsApp!');
  }

  // Cart modal open/close
  if (cartLink) {
    cartLink.addEventListener('click', function (e) {
      e.preventDefault();
      renderCartModal();
      openModal(cartModal);
    });
  }
  if (cartModalClose) {
    cartModalClose.addEventListener('click', function () { closeModal(cartModal); });
  }
  if (cartModal) {
    cartModal.addEventListener('click', function (e) {
      if (e.target === cartModal) closeModal(cartModal);
    });
  }
  if (btnCheckout) {
    btnCheckout.addEventListener('click', checkoutWhatsApp);
  }

  // ============================
  // AUTH LOGIC (localStorage)
  // ============================
  function getUsers() {
    try {
      var stored = localStorage.getItem('pecanas_users');
      return stored ? JSON.parse(stored) : [];
    } catch (e) { return []; }
  }

  function saveUsers(users) {
    try {
      localStorage.setItem('pecanas_users', JSON.stringify(users));
    } catch (e) { }
  }

  function getSession() {
    try {
      var stored = localStorage.getItem('pecanas_session');
      return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
  }

  function saveSession(user) {
    try {
      localStorage.setItem('pecanas_session', JSON.stringify(user));
    } catch (e) { }
  }

  function clearSession() {
    try {
      localStorage.removeItem('pecanas_session');
    } catch (e) { }
  }

  function registerUser(name, email, password, phone) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === email.toLowerCase()) {
        return { ok: false, error: 'Ya existe una cuenta con este correo.' };
      }
    }
    var user = {
      id: 'user_' + Date.now(),
      name: name,
      email: email,
      password: password,
      phone: phone || ''
    };
    users.push(user);
    saveUsers(users);
    var sessionUser = { id: user.id, name: user.name, email: user.email, phone: user.phone };
    saveSession(sessionUser);
    return { ok: true, user: sessionUser };
  }

  function loginUser(email, password) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === email.toLowerCase() && users[i].password === password) {
        var sessionUser = { id: users[i].id, name: users[i].name, email: users[i].email, phone: users[i].phone };
        saveSession(sessionUser);
        return { ok: true, user: sessionUser };
      }
    }
    return { ok: false, error: 'Correo o contrasena incorrectos.' };
  }

  function logoutUser() {
    clearSession();
    updateAuthUI(null);
    showToast('Sesion cerrada');
  }

  function updateAuthUI(user) {
    if (user) {
      if (authBtn) authBtn.style.display = 'none';
      if (userBadge) {
        userBadge.style.display = '';
        if (userDisplayName) userDisplayName.textContent = user.name;
      }
    } else {
      if (authBtn) authBtn.style.display = '';
      if (userBadge) userBadge.style.display = 'none';
    }
  }

  function showAuthMessage(msg, type) {
    if (!authMessage) return;
    authMessage.textContent = msg;
    authMessage.className = 'auth-message ' + type;
    authMessage.style.display = '';
  }

  function hideAuthMessage() {
    if (authMessage) authMessage.style.display = 'none';
  }

  // Auth tab switching
  $$('.auth-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.auth-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      hideAuthMessage();
      if (tab.dataset.tab === 'login') {
        loginForm.style.display = '';
        registerForm.style.display = 'none';
      } else {
        loginForm.style.display = 'none';
        registerForm.style.display = '';
      }
    });
  });

  // Login submit
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      hideAuthMessage();
      var email    = $('#loginEmail').value.trim();
      var password = $('#loginPassword').value;
      if (!email || !password) {
        showAuthMessage('Completa todos los campos.', 'error');
        return;
      }
      var result = loginUser(email, password);
      if (result.ok) {
        showAuthMessage('Bienvenido, ' + result.user.name + '!', 'success');
        updateAuthUI(result.user);
        setTimeout(function () { closeModal(authModal); }, 800);
      } else {
        showAuthMessage(result.error, 'error');
      }
    });
  }

  // Register submit
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      hideAuthMessage();
      var name     = $('#regName').value.trim();
      var email    = $('#regEmail').value.trim();
      var phone    = $('#regPhone').value.trim();
      var password = $('#regPassword').value;
      if (!name || !email || !password) {
        showAuthMessage('Completa nombre, correo y contrasena.', 'error');
        return;
      }
      if (password.length < 6) {
        showAuthMessage('La contrasena debe tener minimo 6 caracteres.', 'error');
        return;
      }
      var result = registerUser(name, email, password, phone);
      if (result.ok) {
        showAuthMessage('Cuenta creada! Bienvenido, ' + result.user.name, 'success');
        updateAuthUI(result.user);
        setTimeout(function () { closeModal(authModal); }, 800);
      } else {
        showAuthMessage(result.error, 'error');
      }
    });
  }

  // Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', logoutUser);
  }

  // Auth modal open/close
  if (authBtn) {
    authBtn.addEventListener('click', function () {
      hideAuthMessage();
      loginForm.reset();
      registerForm.reset();
      openModal(authModal);
    });
  }
  if (authModalClose) {
    authModalClose.addEventListener('click', function () { closeModal(authModal); });
  }
  if (authModal) {
    authModal.addEventListener('click', function (e) {
      if (e.target === authModal) closeModal(authModal);
    });
  }

  // ============================
  // MODAL HELPERS
  // ============================
  function openModal(el) {
    if (!el) return;
    el.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeModal(el) {
    if (!el) return;
    el.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ESC key closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal(cartModal);
      closeModal(authModal);
    }
  });

  // ============================
  // BACK BUTTON
  // ============================
  if (btnBack) {
    btnBack.addEventListener('click', function (e) {
      e.preventDefault();
      showWelcome();
    });
  }

  // ============================
  // BREADCRUMB HOME
  // ============================
  if (breadcrumbHome) {
    breadcrumbHome.addEventListener('click', function (e) {
      e.preventDefault();
      showWelcome();
    });
  }

  // ============================
  // LOGO -> WELCOME
  // ============================
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      e.preventDefault();
      showWelcome();
    });
  }

  // ============================
  // INIT
  // ============================
  loadCart();

  // Check existing session
  var existingSession = getSession();
  if (existingSession) {
    updateAuthUI(existingSession);
  }

  DB.getCategories().then(function (categories) {
    allCategories = categories;
    categoriesMap = {};
    categories.forEach(function (c) { categoriesMap[c.slug] = c; });
    buildSidebar(categories);
    showWelcome();

    if (DB.isUsingRemote()) {
      console.log('[Pecanas Gallardo] Conectado a Supabase - ' + categories.length + ' categorias cargadas');
    } else {
      console.log('[Pecanas Gallardo] Modo offline - ' + categories.length + ' categorias locales');
    }
  });

});
