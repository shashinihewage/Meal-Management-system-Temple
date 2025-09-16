// MealManagement.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './App.css';

export default function MainApp() {
  const { logout } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone1: '',
    phone2: '',
    contributionType: 'one-time',
    date: '',
    customRecurring: '',
    notes: '',
  });

  const [contributions, setContributions] = useState(() => {
    const saved = localStorage.getItem('contributions');
    return saved ? JSON.parse(saved) : [];
  });

  const [editId, setEditId] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('contributions', JSON.stringify(contributions));
  }, [contributions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'phone1' || name === 'phone2') && value.length > 10) return;
    if ((name === 'phone1' || name === 'phone2') && value && !/^[0-9]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return alert('Name is required');
    if (!formData.address.trim()) return alert('Address is required');
    // Phone numbers can be optional, but if provided, must be 10 digits
    if (formData.phone1 && formData.phone1.length !== 10) return alert('Phone 1 must be 10 digits');
    if (formData.phone2 && formData.phone2.length !== 10) return alert('Phone 2 must be 10 digits');
    if (!formData.date) return alert('Date is required');
    if (formData.contributionType === 'custom' && (!formData.customRecurring || Number(formData.customRecurring) <= 0)) {
      return alert('Enter valid custom recurring interval');
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone1: '',
      phone2: '',
      contributionType: 'one-time',
      date: '',
      customRecurring: '',
      notes: '',
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editId !== null) {
      setContributions((prev) => prev.map((c) => (c.id === editId ? { ...formData, id: editId } : c)));
    } else {
      setContributions((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const handleEdit = (id) => {
    const item = contributions.find((c) => c.id === id);
    if (item) {
      setFormData({ ...item });
      setEditId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this contribution?')) {
      setContributions((prev) => prev.filter((c) => c.id !== id));
      if (editId === id) resetForm();
    }
  };

  // Filter for search
  const filteredContributions = contributions.filter((c) => {
    const matchesName = c.name.toLowerCase().includes(searchName.toLowerCase());
    // compare only date string part YYYY-MM-DD
    const contribDate = c.date ? new Date(c.date).toISOString().slice(0, 10) : '';
    const matchesDate = searchDate ? contribDate === searchDate : true;
    return matchesName && matchesDate;
  });

  const getMonthDays = (year, month) => new Date(year, month + 1, 0).getDate();

  const getCalendarDays = (year, month) => {
    const days = [];
    const first = new Date(year, month, 1);
    const offset = first.getDay();
    const total = getMonthDays(year, month);

    for (let i = 0; i < offset; i++) days.push({ date: null });
    for (let i = 1; i <= total; i++) days.push({ date: new Date(year, month, i) });
    while (days.length % 7 !== 0) days.push({ date: null });

    return days;
  };

  const getYearlyOccurrence = (start, year) => new Date(year, new Date(start).getMonth(), new Date(start).getDate());

  const getMonthlyOccurrence = (start, year, month) => {
    const d = new Date(start);
    const day = d.getDate();
    const max = getMonthDays(year, month);
    return day <= max ? new Date(year, month, day) : null;
  };

  const getCustomOccurrences = (start, year, month, interval) => {
    const startD = new Date(start);
    const totalMonths = (year - startD.getFullYear()) * 12 + (month - startD.getMonth());
    if (totalMonths < 0 || totalMonths % interval !== 0) return [];
    const day = startD.getDate();
    const max = getMonthDays(year, month);
    return day <= max ? [new Date(year, month, day)] : [];
  };

  const getEventsForDay = (date) => {
    if (!date) return [];
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    return contributions.flatMap((c) => {
      const cd = new Date(c.date);
      if (c.contributionType === 'one-time' && cd.getFullYear() === y && cd.getMonth() === m && cd.getDate() === d) return [c.name];
      if (c.contributionType === 'recurring-monthly') {
        const occ = getMonthlyOccurrence(c.date, y, m);
        return occ && occ.getDate() === d ? [c.name] : [];
      }
      if (c.contributionType === 'recurring-yearly') {
        const occ = getYearlyOccurrence(c.date, y);
        return occ && occ.getMonth() === m && occ.getDate() === d ? [c.name] : [];
      }
      if (c.contributionType === 'custom') {
        return getCustomOccurrences(c.date, y, m, Number(c.customRecurring)).some((d2) => d2.getDate() === d) ? [c.name] : [];
      }
      return [];
    });
  };

  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();
  const calendarDays = getCalendarDays(calendarYear, calendarMonth);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1));

  return (
    <div className="app-container">
      <h1 className="title">Sri Bodhi Viharaya - Udahamulla</h1>

      <button
        style={{
          float: 'right',
          marginTop: '-50px',
          backgroundColor: '#e53e3e',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name :</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address :</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone 1 :</label>
          <input type="text" name="phone1" value={formData.phone1} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone 2 :</label>
          <input type="text" name="phone2" value={formData.phone2} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Contribution Type:</label>
          <select name="contributionType" value={formData.contributionType} onChange={handleChange}>
            <option value="one-time">One Time</option>
            <option value="recurring-monthly">Recurring (Same date every Month)</option>
            <option value="recurring-yearly">Recurring (Same date every Year)</option>
            <option value="custom">Customize (months interval)</option>
          </select>
        </div>
        {formData.contributionType === 'custom' && (
          <div className="form-group">
            <label>Interval (months):</label>
            <input type="number" name="customRecurring" value={formData.customRecurring} onChange={handleChange} min="1" />
          </div>
        )}
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
        </div>
        <button className="submit-button" type="submit">
          {editId !== null ? 'Save Changes' : 'Add Contribution'}
        </button>
      </form>

      <div className="contributions-container">
        <h2>Search Contributions</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input type="text" placeholder="Search by Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
        </div>
        <div className="cards-container">
          {filteredContributions.length === 0 && <p>No contributions found.</p>}
          {filteredContributions.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.name}</h3>
              <p><b>Address:</b> {c.address}</p>
              <p><b>Phone 1:</b> {c.phone1}</p>
              <p><b>Phone 2:</b> {c.phone2}</p>
              <p><b>Type:</b> {c.contributionType}</p>
              <p><b>Date:</b> {new Date(c.date).toLocaleDateString()}</p>
              {c.notes && <p><b>Notes:</b> {c.notes}</p>}
              <div className="buttons">
                <button className="edit" onClick={() => handleEdit(c.id)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(c.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-container">
        <h2>
          Calendar - {calendarDate.toLocaleString('default', { month: 'long' })} {calendarYear}
        </h2>

        <div className="calendar-controls">
          <button onClick={prevMonth} className="calendar-nav">‹</button>

          <select
            value={calendarMonth}
            onChange={(e) =>
              setCalendarDate(new Date(calendarYear, parseInt(e.target.value), 1))
            }
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={calendarYear}
            onChange={(e) =>
              setCalendarDate(new Date(parseInt(e.target.value), calendarMonth, 1))
            }
          >
            {Array.from({ length: 10 }).map((_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          <button onClick={nextMonth} className="calendar-nav">›</button>
        </div>

        <div className="calendar">
          {weekdays.map((wd) => (
            <div key={wd} className="calendar-header">{wd}</div>
          ))}
          {calendarDays.map(({ date }, i) => {
            const events = getEventsForDay(date);
            const isDisabled = date === null;
            return (
              <div
                key={i}
                className={`calendar-day ${isDisabled ? 'disabled' : ''}`}
              >
                {date && <div className="date-number">{date.getDate()}</div>}
                {events.map((name, idx) => (
                  <div key={idx} className="events" title={name}>
                    {name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
