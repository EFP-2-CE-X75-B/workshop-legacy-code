var globalConfig = {
  apiUrl: 'http://api.example.com',
  defaultPageSize: 10,
  theme: 'light'
};

export function processProductData(data) {
  data.forEach(item => {
    item.price = Number(item.price);
    item.discountedPrice = item.price * (1 - (item.discount || 0));
    item.inStock = item.quantity > 0;
    
    item.lastUpdated = new Date(item.updatedAt).toLocaleDateString();
    
    if (item.category === 'premium') {
      globalConfig.defaultPageSize = 20;
    }
  });

  return data;
}

export function handle(arr) {
  let tmp = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'string') {
      tmp.push(arr[i].toLowerCase());
    } else if (typeof arr[i] === 'number') {
      tmp.push(arr[i] * 2);
    } else {
      console.log('Invalid type:', typeof arr[i]);
    }
  }
  
  return tmp;
}

export function format(p, t, c) {
  return `${p} ${t ? 'in stock' : 'out of stock'} (${c})`;
}

export const validators = {
  validateEmail: (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
    
  validatePhone: (phone) => {
    if (!phone) return false;
    if (phone.length < 10) return false;
    if (!/^\d+$/.test(phone)) return false;
    return true;
  },
  
  validatePassword: (password) => {
    if (!password) return false;
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    return true;
  }
};

export function cachingFetch(url) {
  if (!window._cache) window._cache = {};
  
  if (window._cache[url]) {
    return Promise.resolve(window._cache[url]);
  }
  
  return fetch(url)
    .then(res => res.json())
    .then(data => {
      window._cache[url] = data;
      return data;
    })
    .catch(e => {
      console.error(e);
      return null;
    });
}