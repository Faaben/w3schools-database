import React, { useState, useEffect } from 'react';
import './index.css';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  return (
    <div className="container mx-auto p-4">
      <CategoryList />
      <ProductList />
    </div>
  );
}

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [editableCategoryId, setEditableCategoryId] = useState(null); // Track which category is being edited
  const [editedCategory, setEditedCategory] = useState({}); // Track changes to the edited category

  useEffect(() => {
    fetch(`${api}/categories`)
      .then(response => response.json())
      .then(data => setCategories(data));
  }, []);

  // Handle input change for editing category
  const handleInputChange = (categoryId, field, value) => {
    setEditedCategory(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
  };

  // Handle patch request for category update
  const handleSave = (categoryId) => {
    const updatedCategory = editedCategory[categoryId];
    fetch(`${api}/categories/${categoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCategory),
    })
      .then(response => {
        if (response.ok) {
          setCategories(categories.map(category =>
            category.CategoryID === categoryId ? { ...category, ...updatedCategory } : category
          ));
          setEditableCategoryId(null); // Exit edit mode
        }
        else {
          alert('Failed to update category');
        }
      });
  };

  // Handle delete request
  const handleDelete = (categoryId) => {
    fetch(`${api}/categories/${categoryId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setCategories(categories.filter(category => category.CategoryID !== categoryId));
        }
        else {
          alert('Failed to delete category');
        }
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditableCategoryId('new')}
      >
        Add New Category
      </button>
      {editableCategoryId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Category Name"
            value={editedCategory['new']?.CategoryName || ''}
            onChange={(e) => handleInputChange('new', 'CategoryName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Description"
            value={editedCategory['new']?.Description || ''}
            onChange={(e) => handleInputChange('new', 'Description', e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                const newCategory = editedCategory['new'];
                fetch(`${api}/categories`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newCategory),
                })
                  .then(response => response.json())
                  .then(data => {
                    setCategories([...categories, data]);
                    setEditableCategoryId(null);
                    setEditedCategory(prev => {
                      const { new: _, ...rest } = prev;
                      return rest;
                    });
                    window.location.reload(); // Refresh the page
                  });
              }}
            >
              Save
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setEditableCategoryId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Category Name</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b w-36">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.CategoryID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableCategoryId === category.CategoryID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCategory[category.CategoryID]?.CategoryName || category.CategoryName}
                    onChange={(e) =>
                      handleInputChange(category.CategoryID, 'CategoryName', e.target.value)
                    }
                  />
                ) : (
                  category.CategoryName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCategoryId === category.CategoryID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedCategory[category.CategoryID]?.Description || category.Description}
                    onChange={(e) =>
                      handleInputChange(category.CategoryID, 'Description', e.target.value)
                    }
                  />
                ) : (
                  category.Description
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableCategoryId === category.CategoryID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(category.CategoryID)}
                    >
                      Save
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableCategoryId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-blue-500 text-black px-4 py-2 rounded"
                      onClick={() => setEditableCategoryId(category.CategoryID)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-yellow-500 text-black px-4 py-2 rounded"
                      onClick={() => handleDelete(category.CategoryID)}
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

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editableProductId, setEditableProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    fetch(`${api}/products`)
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const handleInputChange = (productId, field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSave = (productId) => {
    const updatedProduct = editedProduct[productId];
    fetch(`${api}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then(response => {
        if (response.ok) {
          setProducts(products.map(product =>
            product.ProductID === productId ? { ...product, ...updatedProduct } : product
          ));
          setEditableProductId(null);
        } else {
          alert('Failed to update product');
        }
      });
  };

  const handleDelete = (productId) => {
    fetch(`${api}/products/${productId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setProducts(products.filter(product => product.ProductID !== productId));
        } else {
          alert('Failed to delete product');
        }
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditableProductId('new')}
      >
        Add New Product
      </button>
      {editableProductId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Product Name"
            value={editedProduct['new']?.ProductName || ''}
            onChange={(e) => handleInputChange('new', 'ProductName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="number"
            placeholder="Price"
            value={editedProduct['new']?.Price || ''}
            onChange={(e) => handleInputChange('new', 'Price', parseFloat(e.target.value))}
          />
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => {
                const newProduct = editedProduct['new'];
                fetch(`${api}/products`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newProduct),
                })
                  .then(response => response.json())
                  .then(data => {
                    setProducts([...products, data]);
                    setEditableProductId(null);
                    setEditedProduct(prev => {
                      const { new: _, ...rest } = prev;
                      return rest;
                    });
                    window.location.reload();
                  });
              }}
            >
              Save
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setEditableProductId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Product Name</th>
            <th className="py-2 px-4 border-b text-left">Price</th>
            <th className="py-2 px-4 border-b w-36">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.ProductID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedProduct[product.ProductID]?.ProductName || product.ProductName}
                    onChange={(e) =>
                      handleInputChange(product.ProductID, 'ProductName', e.target.value)
                    }
                  />
                ) : (
                  product.ProductName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <input
                    className="border p-2 w-full"
                    type="number"
                    value={editedProduct[product.ProductID]?.Price || product.Price}
                    onChange={(e) =>
                      handleInputChange(product.ProductID, 'Price', parseFloat(e.target.value))
                    }
                  />
                ) : (
                  product.Price
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableProductId === product.ProductID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(product.ProductID)}
                    >
                      Save
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableProductId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-blue-500 text-black px-4 py-2 rounded"
                      onClick={() => setEditableProductId(product.ProductID)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-yellow-500 text-black px-4 py-2 rounded"
                      onClick={() => handleDelete(product.ProductID)}
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



export default App;
