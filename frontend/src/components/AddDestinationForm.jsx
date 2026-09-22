import { useState } from 'react';
import { addDestination, uploadImage } from '../api';

const CATEGORIES = ['Beach', 'Mountain', 'City', 'Heritage', 'Wildlife', 'Other'];

const EMPTY_FORM = {
  name: '',
  country: '',
  category: 'Beach',
  price: '',
  description: '',
};

export default function AddDestinationForm({ onAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    setImageFile(e.target.files[0] || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.country.trim()) {
      setError('Name and country are required.');
      return;
    }
    if (form.price === '' || Number(form.price) < 0 || Number.isNaN(Number(form.price))) {
      setError('Price must be a valid non-negative number.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      const saved = await addDestination({ ...form, price: Number(form.price), imageUrl });
      onAdded(saved);
      setForm(EMPTY_FORM);
      setImageFile(null);
    } catch (err) {
      setError(err.details ? err.details.join(', ') : err.message);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ticket">
      <h2>Add a destination</h2>
      {error && <p className="error">{error}</p>}

      <div className="ticket-fields">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="Goa" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input id="country" name="country" placeholder="India" value={form.country} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price">Price (₹)</label>
          <input id="price" name="price" type="number" min="0" placeholder="15000" value={form.price} onChange={handleChange} />
        </div>
        <div className="field-full">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" placeholder="What makes this place worth the trip" value={form.description} onChange={handleChange} />
        </div>
        <div className="field-full">
          <label htmlFor="image">Photo (optional)</label>
          <input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {uploading ? 'Uploading photo…' : submitting ? 'Adding…' : 'Add destination'}
      </button>
    </form>
  );
}
