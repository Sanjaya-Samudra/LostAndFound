import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Search, MapPin, Calendar, Grid, List, Tag, Eye } from 'lucide-react';
import './SearchPage.css';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [locationQuery, setLocationQuery] = useState('');
  
  // View mode state (grid vs list)
  const [viewMode, setViewMode] = useState('grid');
  
  // Items array
  const [items, setItems] = useState([]);

  const categories = ['All', 'Electronics', 'Pets', 'Wallets', 'Keys', 'Documents', 'Clothing', 'Other'];

  const performFilter = () => {
    let results = mockApi.getItems({
      search: searchQuery,
      category: selectedCategory,
      status: selectedStatus
    });

    if (locationQuery) {
      const locLower = locationQuery.toLowerCase();
      results = results.filter(item => item.location.toLowerCase().includes(locLower));
    }

    setItems(results);
  };

  useEffect(() => {
    performFilter();
  }, [searchParams, locationQuery, selectedStatus, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery) params.query = searchQuery;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedStatus !== 'All') params.status = selectedStatus;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setLocationQuery('');
    setSearchParams({});
  };

  return (
    <LayoutWrapper>
      <div className="container py-8 search-root">
        {/* Search header bar */}
        <form className="search-header-form glass-card" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search by keywords (e.g. key, phone, coat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary search-action-btn">Apply Search</button>
        </form>

        <div className="search-layout">
          {/* Left Column - Filter Sidebar */}
          <aside className="search-sidebar glass-card">
            <div className="sidebar-section-header">
              <h3>Filters</h3>
              <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                Reset All
              </button>
            </div>

            {/* Status filters */}
            <div className="filter-group">
              <label className="form-label">Item Status</label>
              <div className="radio-group">
                {['All', 'lost', 'found', 'claimed'].map(status => (
                  <label key={status} className="radio-label">
                    <input 
                      type="radio" 
                      name="status" 
                      value={status}
                      checked={selectedStatus === status}
                      onChange={() => setSelectedStatus(status)}
                    />
                    <span className="radio-text">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category select */}
            <div className="filter-group">
              <label className="form-label">Category</label>
              <select 
                className="form-input form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location filter */}
            <div className="filter-group">
              <label className="form-label">Filter Location</label>
              <div className="search-input-wrapper">
                <MapPin className="search-icon" size={14} />
                <input 
                  type="text" 
                  className="form-input search-input" 
                  placeholder="e.g. Park, Subway, Street"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
            </div>
          </aside>

          {/* Right Column - Results Pane */}
          <section className="search-results-pane">
            <div className="results-header">
              <p className="results-count">Showing <strong>{items.length}</strong> items</p>
              
              {/* View Toggle */}
              <div className="view-toggle-buttons">
                <button 
                  className={`btn btn-outline btn-icon ${viewMode === 'grid' ? 'active-toggle' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button 
                  className={`btn btn-outline btn-icon ${viewMode === 'list' ? 'active-toggle' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Results Grid/List */}
            {items.length === 0 ? (
              <div className="glass-card empty-results text-center py-16">
                <Search size={48} className="empty-search-icon" />
                <h3>No Items Found</h3>
                <p>Try clearing some filters or widening your keyword search.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid-cols-3">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className="item-card glass-card glass-card-hover"
                    onClick={() => navigate(`/items/${item.id}`)}
                  >
                    <div className="item-card-image-wrapper">
                      <img src={item.image} alt={item.title} className="item-card-image" />
                      <span className={`badge item-card-badge ${item.status === 'lost' ? 'badge-lost' : item.status === 'found' ? 'badge-found' : 'badge-claimed'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="item-card-body">
                      <span className="item-card-category">{item.category}</span>
                      <h3 className="item-card-title">{item.title}</h3>
                      <div className="item-card-meta">
                        <div className="meta-row">
                          <MapPin size={12} className="meta-icon" />
                          <span>{item.location}</span>
                        </div>
                        <div className="meta-row">
                          <Calendar size={12} className="meta-icon" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View Mode
              <div className="list-view-container">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className="list-item-row glass-card glass-card-hover"
                    onClick={() => navigate(`/items/${item.id}`)}
                  >
                    <img src={item.image} alt={item.title} className="list-item-image" />
                    
                    <div className="list-item-body">
                      <div className="list-item-title-row">
                        <h4>{item.title}</h4>
                        <span className={`badge ${item.status === 'lost' ? 'badge-lost' : item.status === 'found' ? 'badge-found' : 'badge-claimed'}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <p className="list-item-desc">{item.description}</p>
                      
                      <div className="list-item-meta">
                        <span className="badge badge-category"><Tag size={10} /> {item.category}</span>
                        <span><MapPin size={12} /> {item.location}</span>
                        <span><Calendar size={12} /> {item.date}</span>
                      </div>
                    </div>

                    <button className="btn btn-outline btn-icon list-view-action" title="View Details">
                      <Eye size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default SearchPage;
