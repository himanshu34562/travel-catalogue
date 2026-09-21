export default function DestinationList({ destinations, onDelete }) {
  if (destinations.length === 0) {
    return (
      <p className="empty">
        No destinations here yet. Add the first one above, or clear your filters if you were expecting to see something.
      </p>
    );
  }

  return (
    <div className="grid">
      {destinations.map((d) => (
        <div className="postcard" key={d._id}>
          <div className="photo-wrap">
            {d.imageUrl && (
              <img
                src={d.imageUrl}
                alt={d.name}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span className="stamp">{d.category}</span>
          </div>
          <div className="body">
            <h3>{d.name}</h3>
            <p className="place">{d.country}</p>
            <p className="price">₹{d.price.toLocaleString('en-IN')}</p>
            {d.description && <p className="desc">{d.description}</p>}
            <button className="delete" onClick={() => onDelete(d._id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
