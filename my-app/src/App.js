import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  return (
    <div className="container mx-auto p-4">
      <ProductList />
      <CategoryList />
    </div>
  );
}





function ProductList() {
  const [products, setProducts] = useState([]);
  const [editableProductId, setEditableProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Aktuelle Seite für Products
  const [searchTerm, setSearchTerm] = useState(''); // Suchbegriff
  const productsPerPage = 10; // Anzahl der Zeilen pro Seite

  const resizerRef = useRef(null); // Referenz für das Resizer-Element

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

  // Filterfunktion basierend auf dem Suchbegriff
  const filteredProducts = products.filter(product =>
    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logik
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Funktionen zum Anpassen der Spaltenbreite
  const onMouseDown = (e, column) => {
    const startX = e.pageX;
    const startWidth = column.current.offsetWidth;

    const onMouseMove = (e) => {
      const newWidth = startWidth + e.pageX - startX;
      column.current.style.width = `${newWidth}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produkte</h1>
  
      {/* Flexbox für Button und Suchfeld */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Add New Product Button */}
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setEditableProductId('new')}
        >
          Neues Produkt erfassen
        </button>
  
        {/* Suchfeld neben dem Button */}
        <input
          type="text"
          className="border p-2"
          placeholder="Suchen"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '7cm' }}  // Manuelle Breitenanpassung
        />
      </div>

      {editableProductId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          {/* Product Inputs for new product */}
          {/* ... */}
        </div>
      )}

      {/* Product Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">
              Produktname
              <div
                className="resizer"
                onMouseDown={(e) => onMouseDown(e, resizerRef)}
                style={{ cursor: 'col-resize' }}
              ></div>
            </th>
            <th className="py-2 px-4 border-b text-left">
              Preis
              <div
                className="resizer"
                onMouseDown={(e) => onMouseDown(e, resizerRef)}
                style={{ cursor: 'col-resize' }}
              ></div>
            </th>
            <th className="py-2 px-4 border-b w-36">Bearbeiten</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
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

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={prevPage}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          disabled={currentPage === 1}
        >
          &larr;
        </button>
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`mx-2 px-3 py-1 rounded ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={nextPage}
          className={`px-3 py-1 rounded ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}







function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [editableCategoryId, setEditableCategoryId] = useState(null);
  const [editedCategory, setEditedCategory] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Aktuelle Seite
  const categoriesPerPage = 10; // Anzahl der Zeilen pro Seite

  useEffect(() => {
    fetch(`${api}/categories`)
      .then(response => response.json())
      .then(data => setCategories(data));
  }, []);

  const handleInputChange = (categoryId, field, value) => {
    setEditedCategory(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
  };

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
          setEditableCategoryId(null);
        } else {
          alert('Failed to update category');
        }
      });
  };

  const handleDelete = (categoryId) => {
    fetch(`${api}/categories/${categoryId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setCategories(categories.filter(category => category.CategoryID !== categoryId));
        } else {
          alert('Failed to delete category');
        }
      });
  };

  // Pagination Logik
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(categories.length / categoriesPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {/* Add New Category Button */}
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditableCategoryId('new')}
      >
        Add New Category
      </button>

      {/* Category Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Category Name</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b w-36">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map(category => (
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

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={prevPage}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          disabled={currentPage === 1}
        >
          &larr;
        </button>
        {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`mx-2 px-3 py-1 rounded ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={nextPage}
          className={`px-3 py-1 rounded ${currentPage === Math.ceil(categories.length / categoriesPerPage) ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          disabled={currentPage === Math.ceil(categories.length / categoriesPerPage)}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}

















export default App;
