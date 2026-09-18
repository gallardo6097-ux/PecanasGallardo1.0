// =============================================
// PECANAS GALLARDO - Database Abstraction Layer
// =============================================
// Intenta conectar a Supabase. Si no está
// configurado o falla, usa los datos locales.
//
// API pública (todo retorna Promises):
//   DB.getCategories()            -> [{ slug, name, icon }]
//   DB.getProductsByCategory(slug) -> [{ name, origin, img, prices, ... }]
//   DB.searchProducts(query)       -> [{ name, origin, img, ... }]
//   DB.isUsingRemote()             -> boolean
// =============================================

var DB = (function () {
  'use strict';

  var supabase = null;
  var useRemote = false;
  var categoriesCache = null;

  // ========================
  // INIT
  // ========================
  function init() {
    if (typeof SUPABASE_CONFIG !== 'undefined' &&
        SUPABASE_CONFIG.url &&
        SUPABASE_CONFIG.url.indexOf('TU-PROYECTO') === -1 &&
        typeof window.supabase !== 'undefined' &&
        window.supabase.createClient) {

      supabase = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anon
      );
      useRemote = true;
      console.log('[DB] Conectado a Supabase');
    } else {
      useRemote = false;
      console.log('[DB] Modo offline – usando datos locales');
    }
  }

  // ========================
  // GET CATEGORIES
  // ========================
  function getCategories() {
    if (categoriesCache) {
      return Promise.resolve(categoriesCache);
    }

    if (useRemote) {
      return supabase
        .from('categories')
        .select('slug, name, icon, display_order')
        .eq('active', true)
        .order('display_order', { ascending: true })
        .then(function (res) {
          if (res.error) throw res.error;
          categoriesCache = res.data;
          return res.data;
        })
        .catch(function (err) {
          console.warn('[DB] Error fetching categories, usando locales:', err.message);
          categoriesCache = LOCAL_CATEGORIES;
          return LOCAL_CATEGORIES;
        });
    }

    categoriesCache = LOCAL_CATEGORIES;
    return Promise.resolve(LOCAL_CATEGORIES);
  }

  // ========================
  // GET PRODUCTS BY CATEGORY
  // ========================
  function getProductsByCategory(slug) {
    if (useRemote) {
      return getCategories().then(function (cats) {
        var cat = cats.find(function (c) { return c.slug === slug; });
        if (!cat) return [];

        return supabase
          .from('products')
          .select('name, origin, image_url, prices, default_variant, specs, display_order')
          .eq('category_id', cat.id || cat.slug)
          .eq('active', true)
          .order('display_order', { ascending: true })
          .then(function (res) {
            if (res.error) throw res.error;
            return res.data.map(normalizeProduct);
          });
      }).catch(function (err) {
        console.warn('[DB] Error fetching products, usando locales:', err.message);
        return Promise.resolve(LOCAL_PRODUCTS[slug] || []);
      });
    }

    return Promise.resolve(LOCAL_PRODUCTS[slug] || []);
  }

  // ========================
  // SEARCH PRODUCTS
  // ========================
  function searchProducts(query) {
    if (!query) return Promise.resolve([]);

    var q = query.toLowerCase();

    if (useRemote) {
      return getCategories().then(function (cats) {
        var promises = cats.map(function (cat) {
          return supabase
            .from('products')
            .select('name, origin, image_url, prices, default_variant, specs, display_order')
            .eq('active', true)
            .or('name.ilike.%' + query + '%,origin.ilike.%' + query + '%')
            .then(function (res) {
              if (res.error) throw res.error;
              return res.data.map(normalizeProduct);
            });
        });

        return Promise.all(promises).then(function (results) {
          var all = [];
          results.forEach(function (r) { all = all.concat(r); });
          return all;
        });
      }).catch(function (err) {
        console.warn('[DB] Error en búsqueda, usando locales:', err.message);
        return searchLocal(q);
      });
    }

    return Promise.resolve(searchLocal(q));
  }

  function searchLocal(query) {
    var results = [];
    Object.keys(LOCAL_PRODUCTS).forEach(function (slug) {
      LOCAL_PRODUCTS[slug].forEach(function (item) {
        var variantKeys = Object.keys(item.prices).join(' ');
        var variantLabels = Object.keys(item.prices).map(function (v) {
          return v.replace(/[0-9]/g, '').trim();
        }).join(' ');
        var text = (item.name + ' ' + item.origin + ' ' + variantKeys + ' ' + variantLabels + ' ' +
          item.specs.map(function (s) { return s.join(' '); }).join(' ')).toLowerCase();
        if (text.indexOf(query) !== -1) results.push(item);
      });
    });
    return results;
  }

  // ========================
  // NORMALIZE PRODUCT
  // ========================
  // Convierte el formato de Supabase al formato
  // que espera la UI (igual al de local-data.js)
  // ========================
  function normalizeProduct(row) {
    var prices = row.prices;
    if (typeof prices === 'string') {
      try { prices = JSON.parse(prices); } catch (e) { prices = {}; }
    }

    var specs = row.specs;
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs); } catch (e) { specs = []; }
    }

    var variants = Object.keys(prices);
    var defaultVariant = row.default_variant || variants[0] || '';

    return {
      name:           row.name,
      origin:         row.origin,
      img:            row.image_url,
      prices:         prices,
      defaultVariant: defaultVariant,
      specs:          specs
    };
  }

  // ========================
  // PUBLIC API
  // ========================
  init();

  return {
    getCategories:         getCategories,
    getProductsByCategory: getProductsByCategory,
    searchProducts:        searchProducts,
    isUsingRemote:         function () { return useRemote; }
  };

})();
