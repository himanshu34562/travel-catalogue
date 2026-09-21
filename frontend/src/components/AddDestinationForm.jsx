import { useState } from 'react';
import { addDestination } from '../api';

const CATEGORIES = ['Beach', 'Mountain', 'City', 'Heritage', 'Wildlife', 'Other'];

const EMPTY_FORM = {
  name: '',
  country: '',
  category: 'Beach',
  price: '',
  description: '',
  imageUrl: '',
};

export default function AddDestinationForm({ onAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      const saved = await addDestination({ ...form, price: Number(form.price) });
      onAdded(saved);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.details ? err.details.join(', ') : err.message);
    } finally {
      setSubmitting(false);
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
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input id="imageUrl" name="imageUrl" placeholder="https://…" value={form.imageUrl} onChange={handleChange} />
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add destination'}
      </button>
    </form>
  );
}
