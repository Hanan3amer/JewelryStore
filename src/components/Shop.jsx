import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../Context/WishlistContext';
export default function Shop() {
  let [products, setProducts] = useState([]);
  let [categories, setCategories] = useState([]);
  let [selectedCategory, setSelectedCategory] = useState('');
  let [title, setTitle] = useState('Shop');
  let { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  let isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  let toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error('Unexpected data structure:', res.data);
        }
      })
      .catch(err => console.log(err));

    axios.get('http://localhost:3000/categories')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error('Unexpected data structure:', res.data);
        }
      })
      .catch(err => console.log(err));
  }, []);

  let handleCategoryClick = (categoryKey, categoryName) => {
    setSelectedCategory(categoryKey);
    setTitle(categoryName);
  };

  let countItemsInCategory = (categoryKey) => {
    return products.filter(product => product.category === categoryKey).length;
  };

  let filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <>
      <section>
        <div className="header-cat" style={{ position: 'relative' }}>
          <div style={{
            background: 'url(/products/header-background.jpg) no-repeat center center',
            backgroundSize: 'cover',
            padding: '100px 0',
            textAlign: 'center',
          }}>
            <h3 className='text-white shop' style={{
              fontSize: '2.5rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {title}
            </h3>
            <div className="category-images d-flex justify-content-center mt-4" style={{ marginTop: '20px' }}>
              {categories.map(category => (
                <div key={category.key} className="category-item mx-2" style={{ textAlign: 'center' }}>
                  <Link to="#" onClick={() => handleCategoryClick(category.key, category.name)} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={category.imgSrc} alt={category.name} className="img-fluid rounded-circle cat" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                    <p className='text-white shop' style={{ marginTop: '10px' }}>{category.name}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container my-5">
          <div className="row">
            <div className="col-md-3">
              <h4 className='shop'>Categories</h4>
              <ul className=' list-unstyled'>
                {categories.map(category => (
                  <li className='text-muted mt-4' key={category.key} onClick={() => handleCategoryClick(category.key, category.name)}>
                    {category.name} ({countItemsInCategory(category.key)})
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-9">
              <div className="row d-flex">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div className="col-md-4 my-2 bg-transparent">
                      <Link to={`/productdetails/${product.id}`} className=' text-decoration-none text-black readmore'>
                        <div className="img">
                          <img src={product.image} className="w-100" alt={product.name} />
                        </div>
                      </Link>
                      <p className='my-2'>{product.name}</p>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className='my-2'>{product.price}.00<span className=' text-success'>$</span></p>
                        <i
                          className={`fas fa-heart  bg-black p-2 fa-md rounded-circle ${isInWishlist(product.id) ? 'text-danger' : 'text-white'}`}
                          onClick={() => toggleWishlist(product)}
                        ></i>
                      </div>
                      <p className=' text-secondary'>{product.description.slice(0, 50)}....</p>
                      <p className='read my-2'>Read More <i class="fa-solid fa-angles-right fa-sm readm"></i></p>
                    </div>
                  ))
                ) : (
                  <p>No Products</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
