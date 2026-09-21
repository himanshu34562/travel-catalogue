import { useEffect, useState, useCallback } from 'react';
import AddDestinationForm from './components/AddDestinationForm';
import FilterBar from './components/FilterBar';
import DestinationList from './components/DestinationList';
import { fetchDestinations, deleteDestination } from './api';

const EMPTY_FILTERS = { search: '', country: '', category: '', minPrice: '', maxPrice: '' };

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDestinations(filters);
      setDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(loadDestinations, 300); // debounce while typing filters
    return () => clearTimeout(timeout);
  }, [loadDestinations]);

  async function handleDelete(id) {
    try {
      await deleteDestination(id);
      setDestinations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Wayfarer</p>
          <h1>Where to next?</h1>
          <p>Log the places worth going, tag what makes them worth it, and find them again by country, category, or budget.</p>
        </div>
      </header>

      <div className="section">
        <AddDestinationForm onAdded={(saved) => setDestinations((prev) => [saved, ...prev])} />
        <FilterBar filters={filters} setFilters={setFilters} />

        {error && <p className="error">{error}</p>}
        {loading ? (
          <p className="loading">Loading destinations…</p>
        ) : (
          <DestinationList destinations={destinations} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
