import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../layout/LayoutWrapper';
import { api } from '../services/api';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import './LandingPage.css';

export const LandingPage = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalItems: 0, totalUsers: 0, claimedCount: 0, successRate: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.getItems().then(fetchedItems => {
      setItems(fetchedItems.slice(0, 6));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/search?category=${category}`);
  };

  return (
    <LayoutWrapper>
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-text-content">
            <h1 className="hero-title">
              Find What You <span className="text-lost font-gradient">Lost</span>. <br />
              Return What You <span className="text-found font-gradient">Found</span>.
            </h1>
            <p className="hero-subtitle">
              LostFound is the community database for reporting, finding, and returning misplaced belongings. Safe, simple, and trusted.
            </p>
          </div>

          <form className="hero-search-box glass-card" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="form-input search-input"
                placeholder="What did you lose? (e.g. keys, phone, cat)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary search-btn">Search Database</button>
          </form>

          <div className="category-pills">
            {['All', 'Electronics', 'Documents', 'Clothing', 'Other'].map((cat) => (
              <button
                key={cat}
                className={`category-pill btn ${selectedCategory === cat ? 'active' : 'btn-outline'}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="recent-items-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag">Latest Updates</span>
              <h2 className="section-title">Recently Reported Items</h2>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/search')}>
              Browse All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-cols-3">
            {loading ? (
              <div className="text-center py-12" style={{gridColumn: '1 / -1'}}>
                <div className="spinner" />
                <p className="mt-2 text-muted">Loading recent items...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12" style={{gridColumn: '1 / -1'}}>
                <p className="text-muted">No items reported yet. Be the first!</p>
              </div>
            ) : items.map((item) => (
              <div
                key={item.id}
                className="item-card glass-card glass-card-hover"
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <div className="item-card-image-wrapper">
                  <img src={item.image} alt={item.title} className="item-card-image" />
                  <span className={`badge item-card-badge ${item.status === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="item-card-body">
                  <span className="item-card-category">{item.category}</span>
                  <h3 className="item-card-title">{item.title}</h3>
                  <div className="item-card-meta">
                    <div className="meta-row">
                      <MapPin size={14} className="meta-icon" />
                      <span>{item.location}</span>
                    </div>
                    <div className="meta-row">
                      <Calendar size={14} className="meta-icon" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title text-center mb-12">How LostFound Works</h2>
          <div className="steps-grid">
            <div className="step-card glass-card text-center">
              <div className="step-number font-gradient">1</div>
              <h3>Report an Item</h3>
              <p>Post details of your lost belonging or an item you found on the street, including location and pictures.</p>
            </div>
            <div className="step-card glass-card text-center">
              <div className="step-number font-gradient">2</div>
              <h3>Search & Matching</h3>
              <p>Our algorithms match reported lost and found items. Browse the search feed by category, location, and date.</p>
            </div>
            <div className="step-card glass-card text-center">
              <div className="step-number font-gradient">3</div>
              <h3>Verify & Return</h3>
              <p>Communicate securely with the finder/owner to coordinate a safe hand-off and recover the item.</p>
            </div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
};
export default LandingPage;
