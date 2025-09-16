// SelectContributors.js
import React, { useState, useEffect } from 'react';
import './App.css'; // reuse existing styles
import { FaSearch } from 'react-icons/fa';

export default function SelectContributors() {
  const [contributors, setContributors] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [checkedIds, setCheckedIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('contributions');
    setContributors(saved ? JSON.parse(saved) : []);
  }, []);

  // Filter contributors by name and date
  const filtered = contributors.filter(c => {
    const matchName = c.name.toLowerCase().includes(searchName.toLowerCase());
    const matchDate = searchDate ? new Date(c.date).toISOString().startsWith(searchDate) : true;
    return matchName && matchDate;
  });

  // Toggle single checkbox
  const toggleCheck = id => {
    setCheckedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle select all filtered
  const toggleSelectAll = () => {
    const filteredIds = filtered.map(c => c.id);
    const allSelected = filteredIds.every(id => checkedIds.includes(id));
    if (allSelected) {
      // Uncheck all filtered
      setCheckedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Check all filtered (add filtered ids to checkedIds)
      setCheckedIds(prev => [...new Set([...prev, ...filteredIds])]);
    }
  };

  // Check if all filtered are selected
  const allFilteredSelected = filtered.length > 0 && filtered.every(c => checkedIds.includes(c.id));

  return (
    <div>
      <h2>Select Contributors</h2>

      {/* Search bars row with better spacing and alignment */}
      <div className="search-row" style={{ flexWrap: 'wrap', gap: '20px' }}>
        <div className="search-group" style={{ flex: '1 1 300px' }}>
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
          <button className="icon-btn" onClick={() => {}}><FaSearch /></button>
        </div>
        <div className="search-group" style={{ flex: '1 1 200px' }}>
          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
          />
          <button className="icon-btn" onClick={() => {}}><FaSearch /></button>
        </div>
      </div>

      {/* Select All checkbox */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ userSelect: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={allFilteredSelected}
            onChange={toggleSelectAll}
            style={{ marginRight: '8px' }}
          />
          Select All
        </label>
      </div>

      {/* Contributors cards */}
      <div className="cards-container-horizontal">
        {filtered.length === 0 && <p>No contributors match.</p>}
        {filtered.map(c => (
          <div key={c.id} className="card-horizontal" style={{ justifyContent: 'space-between' }}>
            <input
              type="checkbox"
              checked={checkedIds.includes(c.id)}
              onChange={() => toggleCheck(c.id)}
              style={{ marginRight: '12px' }}
            />
            <div className="contrib-info" style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ fontWeight: '600', color: '#2d3748' }}>{c.name}</div>
              <div style={{ color: '#4a5568' }}>{new Date(c.date).toLocaleDateString()}</div>
              <div style={{ color: '#4a5568' }}>{c.phone || '-'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
