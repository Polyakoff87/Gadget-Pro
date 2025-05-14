import React, { useState, useEffect } from "react";
import {
  useGetGoodsQuery,
  useAddGoodsMutation,
  useUpdateGoodsMutation,
  useDeleteGoodsMutation,
} from "../../../api/rtkApi";
import styles from "./AdminPanel.module.css";
import { useTheme } from "../../../context/ThemeContext";

export default function AdminPanel() {
  const { data: goods, isLoading } = useGetGoodsQuery();
  const [addGoods] = useAddGoodsMutation();
  const [updateGoods] = useUpdateGoodsMutation();
  const [deleteGoods] = useDeleteGoodsMutation();
  const { theme } = useTheme();
  const [localGoods, setLocalGoods] = useState([]);
  const [newGoods, setNewGoods] = useState({
    id: "",
    title: "",
    tags: "",
    brand: "",
    model: "",
    price: "",
    inStock: true,
    description: "",
    images: [],
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (goods) {
      setLocalGoods(goods);
    }
  }, [goods]);

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleAddGoods = async () => {
    const goodsWithId = { ...newGoods, id: generateUniqueId() };
    await addGoods(goodsWithId);
    setNewGoods({
      id: "",
      title: "",
      tags: "",
      brand: "",
      model: "",
      price: "",
      inStock: true,
      description: "",
      images: [],
    });
  };

  const handleDeleteGoods = async (id) => {
    try {
      await deleteGoods(id).unwrap();

      setLocalGoods((prevGoods) =>
        prevGoods.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
  };

  const handleSaveChanges = async () => {
    if (editProduct) {
      try {
        const updatedProduct = await updateGoods({
          id: editProduct.id,
          ...editProduct,
        }).unwrap();

        setLocalGoods((prevGoods) =>
          prevGoods.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );

        setEditProduct(null);
      } catch (error) {
        console.error("Failed to update product:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageLinks = files.map((file) => URL.createObjectURL(file));
    setNewGoods({ ...newGoods, images: [...newGoods.images, ...imageLinks] });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminPanel}>
      <h2>Панель Администратора</h2>

      <div className={`${styles.addGoods} ${styles[theme]}`}>
        <h3>Добавить новый товар</h3>
        <input
          type="text"
          placeholder="Title"
          value={newGoods.title}
          onChange={(e) => setNewGoods({ ...newGoods, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags"
          value={newGoods.tags}
          onChange={(e) => setNewGoods({ ...newGoods, tags: e.target.value })}
        />
        <input
          type="text"
          placeholder="Brand"
          value={newGoods.brand}
          onChange={(e) => setNewGoods({ ...newGoods, brand: e.target.value })}
        />
        <input
          type="text"
          placeholder="Model"
          value={newGoods.model}
          onChange={(e) => setNewGoods({ ...newGoods, model: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newGoods.price}
          onChange={(e) => setNewGoods({ ...newGoods, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newGoods.description}
          onChange={(e) =>
            setNewGoods({ ...newGoods, description: e.target.value })
          }
        />
        <h3>Добавить фото</h3>
        <input
          className={styles.customFileLabel}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div className={styles.imagePreview}>
          {newGoods?.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Preview ${index + 1}`}
              className={styles.previewImage}
            />
          ))}
        </div>
        <button onClick={handleAddGoods}>Создать товар</button>
      </div>

      <div className={`${styles.addGoods} ${styles[theme]}`}>
        <h3>Список товаров</h3>
        {localGoods?.length > 0 ? (
          localGoods.map((goods) => (
            <div key={goods.id} className={styles.goods}>
              <p>{goods.title}</p>
              <p>{goods.brand}</p>
              <p>{goods.model}</p>
              <p>{goods.price} руб.</p>
              <p>{goods.description}</p>
              <p>
                <span>In Stock:</span> {goods.inStock ? "true" : "false"}
              </p>
              <div className={styles.imagePreview}>
                {goods.images?.map((image, index) => (
                  <img
                    key={`${goods.id}-${index}`}
                    src={image}
                    alt={`Goods ${index + 1}`}
                    className={styles.previewImage}
                  />
                ))}
              </div>
              <button onClick={() => handleEditClick(goods)}>
                Редактировать
              </button>
              <button onClick={() => handleDeleteGoods(goods.id)}>
                Удалить
              </button>
            </div>
          ))
        ) : (
          <p>No goods available.</p>
        )}
      </div>

      {editProduct && (
        <div className={styles.modal}>
          <div className={`${styles.modalContent} ${styles[theme]}`}>
            <h3>Редактировать товар</h3>
            <input
              type="text"
              name="title"
              value={editProduct.title}
              onChange={handleInputChange}
              placeholder="Title"
            />
            <input
              type="text"
              name="tags"
              value={editProduct.tags}
              onChange={handleInputChange}
              placeholder="Tags"
            />
            <input
              type="text"
              name="brand"
              value={editProduct.brand}
              onChange={handleInputChange}
              placeholder="Brand"
            />
            <input
              type="text"
              name="model"
              value={editProduct.model}
              onChange={handleInputChange}
              placeholder="Model"
            />
            <input
              type="number"
              name="price"
              value={editProduct.price}
              onChange={handleInputChange}
              placeholder="Price"
            />
            <div className={styles.toggleContainer}>
              <label htmlFor="inStockToggle">In Stock:</label>
              <input
                type="checkbox"
                id="inStockToggle"
                checked={editProduct.inStock}
                onChange={(e) =>
                  setEditProduct((prev) => ({
                    ...prev,
                    inStock: e.target.checked,
                  }))
                }
              />
            </div>
            <textarea
              name="description"
              value={editProduct.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <div className={styles.modalButtons}>
              <button onClick={handleSaveChanges}>Сохранить изменения</button>
              <button onClick={() => setEditProduct(null)}>
                Отменить изменения
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
