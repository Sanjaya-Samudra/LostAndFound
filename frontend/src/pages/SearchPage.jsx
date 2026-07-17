import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Select } from '../components/Select';
import LayoutWrapper from '../layout/LayoutWrapper';
import { Search, MapPin, Calendar, Grid, List, Tag, Eye, ArrowUpDown, CalendarRange } from 'lucide-react';
import './SearchPage.css';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [locationQuery, setLocationQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Electronics', 'Documents', 'Clothing', 'Other'];

  const performFilter = async () => {
    setLoading(true);
    try {
      const result = await api.getItems({
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        location: locationQuery,
        sort: sortBy,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setItems(result.items);
      setTotal(result.total);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performFilter();
  }, [searchParams, locationQuery, selectedStatus, selectedCategory, sortBy, dateFrom, dateTo]);

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
    setSortBy('newest');
    setDateFrom('');
    setDateTo('');
    setSearchParams({});
  };

  return (
    <LayoutWrapper>
      <div className="container py-8 search-root">
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
          <aside className="search-sidebar glass-card">
            <div className="sidebar-section-header">
              <h3>Filters</h3>
              <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                Reset All
              </button>
            </div>

            <div className="filter-group">
              <Select
                label="Item Status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: 'All', label: 'All Items' },
                  { value: 'lost', label: 'Lost Items', icon: '🔴' },
                  { value: 'found', label: 'Found Items', icon: '🟢' },
                ]}
                placeholder="Filter by status"
              />
            </div>

            <div className="filter-group">
              <Select
                label="Category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories.map(c => ({ value: c, label: c }))}
                placeholder="Select category"
              />
            </div>

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

            <div className="filter-group">
              <label className="form-label">Sort By</label>
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'title', label: 'Alphabetical' },
                ]}
                placeholder="Sort order"
              />
            </div>

            <div className="filter-group">
              <label className="form-label"><CalendarRange size={14} /> Date Range</label>
              <div className="filter-date-column">
                <div className="filter-date-field">
                  <span className="filter-date-label">From</span>
                  <input type="date" className="filter-date-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div className="filter-date-field">
                  <span className="filter-date-label">To</span>
                  <input type="date" className="filter-date-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
              </div>
            </div>
          </aside>

          <section className="search-results-pane">
            <div className="results-header">
              <p className="results-count">Showing <strong>{items.length}</strong> of {total} items</p>
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

            {loading ? (
              <div className="text-center py-16">
                <div className="spinner" />
                <p className="mt-4 text-muted">Searching items...</p>
              </div>
            ) : items.length === 0 ? (
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
