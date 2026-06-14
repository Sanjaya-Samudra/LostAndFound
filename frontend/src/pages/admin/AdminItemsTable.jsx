import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../services/mockApi';
import LayoutWrapper from '../../layout/LayoutWrapper';
import { Search, Eye, CheckCircle, Trash2 } from 'lucide-react';

export const AdminItemsTable = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchItems = () => {
    const data = mockApi.getItems({ search: searchQuery });
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [searchQuery]);

  const handleStatusChange = (id, status) => {
    mockApi.updateItemStatus(id, status);
    fetchItems();
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      mockApi.deleteItem(id);
      fetchItems();
    }
  };

  return (
    <LayoutWrapper type="admin">
      <div className="admin-root animate-fade-in">
        {/* Title */}
        <div className="admin-title-row">
          <div>
            <h2>Manage Reported Items</h2>
            <p>Monitor reported lost and found belongings, approve claims, and moderate descriptions.</p>
          </div>
        </div>

        {/* Search header */}
        <div className="search-header-form glass-card mb-6">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search items by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="glass-card table-container">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p>No reported items matched your query.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Posted By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-muted mt-1">{item.location}</div>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <span className={`status-badge-inline ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.postedBy}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button 
                          className="btn btn-outline btn-sm btn-icon"
                          onClick={() => navigate(`/items/${item.id}`)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {item.status !== 'claimed' && (
                          <button 
                            className="btn btn-outline btn-sm success-action btn-icon"
                            onClick={() => handleStatusChange(item.id, 'claimed')}
                            title="Mark as Claimed"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button 
                          className="btn btn-outline btn-sm danger-action btn-icon"
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};
export default AdminItemsTable;
