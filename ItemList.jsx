import { useState } from 'react';
import FormField from './FormField';

const ItemList = ({ items, onChange }) => {
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    onChange([...items, { id: newId, description: '', quantity: 1, price: 0 }]);
  };
  
  const updateItem = (id, field, value) => {
    onChange(
      items.map(item => 
        item.id === id 
          ? { ...item, [field]: field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value }
          : item
      )
    );
  };
  
  const removeItem = (id) => {
    if (items.length > 1) {
      onChange(items.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Invoice Items</h3>
      </div>
      
      {items.map((item) => (
        <div key={item.id} className="mb-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Item #{items.indexOf(item) + 1}</h4>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-800"
              disabled={items.length === 1}
            >
              {items.length > 1 ? 'Remove' : ''}
            </button>
          </div>
          
          <FormField
            label="Description"
            type="text"
            value={item.description}
            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
            placeholder="Item description"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Quantity"
              type="number"
              min="1"
              step="1"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
            />
            <FormField
              label="Price ($)"
              type="number"
              min="0"
              step="0.01"
              value={item.price}
              onChange={(e) => updateItem(item.id, 'price', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end mt-2">
            <p className="font-medium">
              Amount: ${(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
      
      <div className="mt-4">
        <button
          type="button"
          onClick={addItem}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded border border-blue-200"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
};

export default ItemList;