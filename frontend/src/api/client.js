const API_BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errMessage = 'Ошибка при выполнении запроса';
    try {
      const data = await res.json();
      errMessage = data.message || errMessage;
    } catch {
      errMessage = res.statusText || errMessage;
    }
    const error = new Error(errMessage);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export const api = {
  // Manufacturers (Brands)
  getManufacturers: (search) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/manufacturers${query}`);
  },
  getManufacturer: (id) => request(`/manufacturers/${id}`),
  createManufacturer: (data) =>
    request('/manufacturers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateManufacturer: (id, data) =>
    request(`/manufacturers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteManufacturer: (id) =>
    request(`/manufacturers/${id}`, {
      method: 'DELETE',
    }),

  // Vehicle Models
  getModels: (manufacturerId) => {
    const query = manufacturerId ? `?manufacturerId=${manufacturerId}` : '';
    return request(`/models${query}`);
  },
  getModel: (id) => request(`/models/${id}`),
  createModel: (data) =>
    request('/models', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateModel: (id, data) =>
    request(`/models/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteModel: (id) =>
    request(`/models/${id}`, {
      method: 'DELETE',
    }),

  // Cars
  getCars: (manufacturerId) => {
    const query = manufacturerId ? `?manufacturerId=${manufacturerId}` : '';
    return request(`/cars${query}`);
  },
  getCar: (id) => request(`/cars/${id}`),
  createCar: (data) =>
    request('/cars', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCar: (id, data) =>
    request(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCar: (id) =>
    request(`/cars/${id}`, {
      method: 'DELETE',
    }),

  // File Upload
  uploadFile: async (file, type = 'logos') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      let errMessage = 'Не удалось загрузить файл';
      try {
        const data = await res.json();
        errMessage = data.message || errMessage;
      } catch {
        errMessage = res.statusText || errMessage;
      }
      throw new Error(errMessage);
    }

    const json = await res.json();
    return json.url;
  },
};
