import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  return (
    <div className="container mx-auto p-4">
      <ProductList />
      <SupplierList />
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

  const productRef = useRef();
  const priceRef = useRef();

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
    // Erstelle das updatedProduct mit konvertiertem Preis
    const updatedProduct = {
      ...editedProduct[productId],
      Price: parseFloat(editedProduct[productId]?.Price) || 0 // Standardwert 0, falls das Feld leer ist
    };
    // Setze die Methode und URL basierend auf productId (neu oder bestehend)
    const method = productId === 'new' ? 'POST' : 'PATCH';
    const url = productId === 'new' ? `${api}/products` : `${api}/products/${productId}`;

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then(response => response.json())
      .then(data => {
        // Füge das neue Produkt hinzu oder aktualisiere das bestehende
        if (productId === 'new') {
          setProducts([...products, data]);
        } else {
          setProducts(products.map(product =>
            product.ProductID === productId ? { ...product, ...updatedProduct } : product
          ));
        }
        // Setze editierbaren Zustand zurück und leere das Formular        
        setEditableProductId(null);
        setEditedProduct({});
        window.location.reload(); // Seite neu laden, um die Änderungen anzuzeigen
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
    product.ProductName && product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const onMouseDown = (e, columnRef) => {
    const startX = e.pageX;
    const startWidth = columnRef.current.offsetWidth;

    const onMouseMove = (e) => {
      const newWidth = startWidth + e.pageX - startX;
      columnRef.current.style.width = `${newWidth}px`;
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
          style={{ width: '7cm' }}
        />
      </div>

      {editableProductId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Produktname"
            value={editedProduct['new']?.ProductName || ''}
            onChange={(e) => handleInputChange('new', 'ProductName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="number"
            placeholder="Preis"
            value={editedProduct['new']?.Price || ''}
            onChange={(e) => handleInputChange('new', 'Price', parseFloat(e.target.value))}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="number"
            placeholder="Lieferant ID (SupplierID)"
            value={editedProduct['new']?.SupplierID || ''}
            onChange={(e) => handleInputChange('new', 'SupplierID', parseInt(e.target.value))}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="number"
            placeholder="Kategorie ID (CategoryID)"
            value={editedProduct['new']?.CategoryID || ''}
            onChange={(e) => handleInputChange('new', 'CategoryID', parseInt(e.target.value))}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Einheit (Stück, Liter...)"
            value={editedProduct['new']?.Unit || ''}
            onChange={(e) => handleInputChange('new', 'Unit', e.target.value)}
          />
          <div className="flex space-x-2">
          <button
  className="bg-green-500 text-white px-4 py-2 rounded"
  onClick={() => {
    const newProduct = {
      ProductName: editedProduct['new']?.ProductName || '',
      Price: editedProduct['new']?.Price || 0,
      SupplierID: editedProduct['new']?.SupplierID || null,
      CategoryID: editedProduct['new']?.CategoryID || null,
      Unit: editedProduct['new']?.Unit || ''
    };

    // Überprüfen, ob das Produkt mindestens einen Namen hat
    if (!newProduct.ProductName) {
      alert("Bitte geben Sie einen Produktnamen ein.");
      return;
    }

    fetch(`${api}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Fehler beim Speichern des Produkts");
        }
        return response.json();
      })
      .then(data => {
        // Füge das neu erstellte Produkt zur lokalen Liste hinzu
        setProducts([...products, data]);
        setEditableProductId(null);
        setEditedProduct({});
        window.location.reload(); // Seite neu laden
      })
      .catch(error => {
        alert(error.message);
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
            <th className="py-2 px-4 border-b text-left resizable-th" ref={productRef}>
              Produktname
              <div
                className="resizer-line"
                onMouseDown={(e) => onMouseDown(e, productRef)}
              ></div>
            </th>
            <th className="py-2 px-4 border-b text-left resizable-th" ref={priceRef}>
              Preis
              <div
                className="resizer-line"
              ></div>
            </th>
            <th className="py-2 px-4 border-b w-36">Bearbeiten</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.ProductID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b resizable-td" ref={productRef}>
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
                <div
                   className="resizer-line"
                   onMouseDown={(e) => onMouseDown(e, productRef)}
                ></div>
              </td>
              <td className="py-2 px-4 border-b resizable-td" ref={priceRef}>
                {editableProductId === product.ProductID ? (
                  <input
                    className="border p-2 w-full"
                    type="text" // Verwende "text" statt "number" für flexibles Editieren
                    placeholder="Preis"
                    value={editedProduct[product.ProductID]?.Price || ''}
                    onChange={(e) => handleInputChange(product.ProductID, 'Price', e.target.value)
                    }
                  />
                ) : (
                  product.Price
                )}
                <div
                   className="resizer-line"
                ></div>
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





function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [editableSupplierId, setEditableSupplierId] = useState(null);
  const [editedSupplier, setEditedSupplier] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const suppliersPerPage = 10;

  const supplierNameRef = useRef();
  const contactNameRef = useRef();

  useEffect(() => {
    fetch(`${api}/suppliers`)
      .then(response => response.json())
      .then(data => setSuppliers(data));
  }, []);

  const handleInputChange = (supplierId, field, value) => {
    setEditedSupplier(prev => ({
      ...prev,
      [supplierId]: {
        ...prev[supplierId],
        [field]: value,
      },
    }));
  };

  const handleSave = (supplierId) => {
    const updatedSupplier = editedSupplier[supplierId];
    const method = supplierId === 'new' ? 'POST' : 'PATCH';
    const url = supplierId === 'new' ? `${api}/suppliers` : `${api}/suppliers/${supplierId}`;

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSupplier),
    })
      .then(response => response.json())
      .then(data => {
        if (supplierId === 'new') {
          setSuppliers([...suppliers, data]);
        } else {
          setSuppliers(suppliers.map(supplier =>
            supplier.SupplierID === supplierId ? { ...supplier, ...updatedSupplier } : supplier
          ));
        }
        setEditableSupplierId(null);
        setEditedSupplier({});
        window.location.reload();
      });
  };

  const handleDelete = (supplierId) => {
    fetch(`${api}/suppliers/${supplierId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setSuppliers(suppliers.filter(supplier => supplier.SupplierID !== supplierId));
        } else {
          alert('Failed to delete supplier');
        }
      });
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.SupplierName && supplier.SupplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredSuppliers.length / suppliersPerPage)) {
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
      <h1 className="text-2xl font-bold mb-4">Lieferanten</h1>

      <div className="flex items-center space-x-4 mb-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setEditableSupplierId('new')}
        >
          Neuen Lieferanten hinzufügen
        </button>

        <input
          type="text"
          className="border p-2"
          placeholder="Suchen"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '7cm' }}
        />
      </div>

      {editableSupplierId === 'new' && (
        <div className="mb-4 p-4 border rounded">
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Lieferantenname"
            value={editedSupplier['new']?.SupplierName || ''}
            onChange={(e) => handleInputChange('new', 'SupplierName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Kontaktname"
            value={editedSupplier['new']?.ContactName || ''}
            onChange={(e) => handleInputChange('new', 'ContactName', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Adresse"
            value={editedSupplier['new']?.Address || ''}
            onChange={(e) => handleInputChange('new', 'Address', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Stadt"
            value={editedSupplier['new']?.City || ''}
            onChange={(e) => handleInputChange('new', 'City', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="PLZ"
            value={editedSupplier['new']?.PostalCode || ''}
            onChange={(e) => handleInputChange('new', 'PostalCode', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Land"
            value={editedSupplier['new']?.Country || ''}
            onChange={(e) => handleInputChange('new', 'Country', e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            type="text"
            placeholder="Telefonnummer"
            value={editedSupplier['new']?.Phone || ''}
            onChange={(e) => handleInputChange('new', 'Phone', e.target.value)}
          />
          <div className="flex space-x-2">
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleSave('new')}
            >
              Speichern
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setEditableSupplierId(null)}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Lieferantenname</th>
            <th className="py-2 px-4 border-b text-left">Kontaktname</th>
            <th className="py-2 px-4 border-b text-left">Adresse</th>
            <th className="py-2 px-4 border-b text-left">Telefon</th>
            <th className="py-2 px-4 border-b w-36">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {currentSuppliers.map(supplier => (
            <tr key={supplier.SupplierID} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.SupplierName || supplier.SupplierName}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'SupplierName', e.target.value)
                    }
                  />
                ) : (
                  supplier.SupplierName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.ContactName || supplier.ContactName}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'ContactName', e.target.value)
                    }
                  />
                ) : (
                  supplier.ContactName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.Address || supplier.Address}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'Address', e.target.value)
                    }
                  />
                ) : (
                  supplier.Address
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <input
                    className="border p-2 w-full"
                    type="text"
                    value={editedSupplier[supplier.SupplierID]?.Phone || supplier.Phone}
                    onChange={(e) =>
                      handleInputChange(supplier.SupplierID, 'Phone', e.target.value)
                    }
                  />
                ) : (
                  supplier.Phone
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editableSupplierId === supplier.SupplierID ? (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSave(supplier.SupplierID)}
                    >
                      Speichern
                    </button>
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => setEditableSupplierId(null)}
                    >
                      Abbrechen
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      className="bg-blue-500 text-black px-4 py-2 rounded"
                      onClick={() => setEditableSupplierId(supplier.SupplierID)}
                    >
                      Bearbeiten
                    </button>
                    <button 
                      className="bg-yellow-500 text-black px-4 py-2 rounded"
                      onClick={() => handleDelete(supplier.SupplierID)}
                    >
                      Löschen
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={prevPage}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          disabled={currentPage === 1}
        >
          &larr;
        </button>
        {Array.from({ length: Math.ceil(filteredSuppliers.length / suppliersPerPage) }, (_, i) => i + 1).map(pageNumber => (
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
          className={`px-3 py-1 rounded ${currentPage === Math.ceil(filteredSuppliers.length / suppliersPerPage) ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          disabled={currentPage === Math.ceil(filteredSuppliers.length / suppliersPerPage)}
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
