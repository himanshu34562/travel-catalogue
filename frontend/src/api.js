const BASE_URL = '/api/destinations';

export async function fetchDestinations(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      params.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch destinations');
  return data;
}

export async function addDestination(destination) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(destination),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to add destination');
    err.details = data.details;
    throw err;
  }
  return data;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload image');
  return data.url;
}

export async function deleteDestination(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete destination');
  return data;
}
