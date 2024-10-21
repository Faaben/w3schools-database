import React, { useEffect, useState } from 'react';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [editableCustomerId, setEditableCustomerId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});

  useEffect(() => {
    fetch(`${api}/customers`)
      .then(response => response.json())
      .then(data => setCustomers(data));
  }, []);

  const handleInputChange = (customerId, field, value) => {
    setEditedCustomer(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: value,
      },
    }));
  };

  const handleSave = (customerId) => {
    const updatedCustomer = editedCustomer[customerId];
    fetch(`${api}/customers/${customerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCustomer),
    })
      .then(response => {
        if (response.ok) {
          setCustomers(customers.map(customer =>
            customer.CustomerID === customerId ? { ...customer, ...updatedCustomer } : customer
          ));
          setEditableCustomerId(null);
        } else {
          alert('Failed to update customer');
        }
      });
  };

  const handleDelete = (customerId) => {
    fetch(`${api}/customers/${customerId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setCustomers(customers.filter(customer => customer.CustomerID !== customerId));
        } else {
          alert('Failed to delete customer');
        }
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kunden</h1>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditableCustomerId('new')}
      >
        Add New Customer
      </button>
      {editableCustomerId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Customer Name"
            value={editedCustomer['new']?.CustomerName || ''}
            onChange={(e) => handleInputChange('new', 'CustomerName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Email"
            value={editedCustomer['new']?.Email || ''}
            onChange={(e) => handleInputChange('new', 'Email', e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                const newCustomer = editedCustomer['new'];
                fetch(`${api}/customers`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newCustomer),
                })
                  .then(response => response.json())
                  .then(data => {
                    setCustomers([...customers, data]);
                    setEditableCustomerId(null);
                    setEditedCustomer(prev => {
                      const { new: _, ...rest } = prev;
                      return rest;
                    });
                  });
              }}
            >
              Save
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setEditableCustomerId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Customer Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.CustomerID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCustomer[customer.CustomerID]?.CustomerName || customer.CustomerName}
                    onChange={(e) =>
                      handleInputChange(customer.CustomerID, 'CustomerName', e.target.value)
                    }
                  />
                ) : (
                  customer.CustomerName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCustomer[customer.CustomerID]?.Email || customer.Email}
                    onChange={(e) =>
                      handleInputChange(customer.CustomerID, 'Email', e.target.value)
                    }
                  />
                ) : (
                  customer.Email
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCustomerId === customer.CustomerID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(customer.CustomerID)}
                    >
                      Save
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableCustomerId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-blue-500 text-black px-4 py-2 rounded"
                      onClick={() => setEditableCustomerId(customer.CustomerID)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-yellow-500 text-black px-4 py-2 rounded"
                      onClick={() => handleDelete(customer.CustomerID)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;