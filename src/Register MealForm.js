import React, { useState } from 'react';
import './Register MealForm.css';

function MealForm() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    mealTime: 'morning',
    recurrenceType: 'one-time',
    customInterval: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submission = {
      ...formData,
      customInterval: formData.recurrenceType === 'custom' ? formData.customInterval : null
    };

    console.log('Submitted Meal Contribution:', submission);
    // Later: save to backend or show in list
  };

  return (
    <form className="meal-form" onSubmit={handleSubmit}>
      <label>
        Contributor Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Date:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Meal Time:
        <select name="mealTime" value={formData.mealTime} onChange={handleChange}>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
        </select>
      </label>

      <label>
        Recurrence Type:
        <select name="recurrenceType" value={formData.recurrenceType} onChange={handleChange}>
          <option value="one-time">One Time</option>
          <option value="monthly">Recurring (Same date every Month)</option>
          <option value="yearly">Recurring (Same date Every Year)</option>
          <option value="custom">Custom Recurring</option>
        </select>
      </label>

      {formData.recurrenceType === 'custom' && (
        <label>
          Repeat Every X Months:
          <input
            type="number"
            name="customInterval"
            min="1"
            max="12"
            placeholder="e.g., 3 for every 3 months"
            value={formData.customInterval}
            onChange={handleChange}
            required
          />
        </label>
      )}

      <label>
        Notes (optional): <br/>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Add Contribution</button>
    </form>
  );
}

export default MealForm;
