import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import management from "../asset/management.svg";
import trash from "../asset/trash.svg";
import edit from "../asset/edit.svg";
import adminPhoto from "../asset/Felix-Vogel-4.png";
import line from "../asset/Line2.svg";
import search from "../asset/search-normal.svg";
import styles from "../styles/ProductList.module.css";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import AddModal from "./AddModal";
import { useNavigate } from "react-router-dom";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const adminName = "میلاد عظمی";
  const navigate = useNavigate();

  const fetchProducts = (currentPage = 1) => {
    fetch(`http://localhost:3000/products?page=${currentPage}&limit=10`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data || []);
        setTotalPages(data.totalPages || 0);
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedProduct) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("لطفا وارد حساب کاربری شوید.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/products/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("محصول به روز رسانی نشد!");
      }

      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      alert("محصول با موفقیت به‌روزرسانی شد.");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error.message);
      alert("خطا در به‌روزرسانی محصول!");
    }
  };

  const handleCreateProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);

    setAddModalOpen(false);
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("لطفا وارد حساب کاربری شوید.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: [productId] }),
      });

      if (!response.ok) {
        throw new Error("متاسفانه محصول مورد نظر حذف نشد");
      }

      alert("محصول با موفقیت حذف شد.");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error.message);
      alert("خطا در حذف محصول!");
    }
  };

  const handleConfirmDelete = async () => {
    if (currentProduct) {
      await handleDeleteProduct(currentProduct.id);
      setDeleteModalOpen(false);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchProducts(selectedPage);
  };

  return (
    <div>
      <div className={styles.headContainer}>
        <div className={styles.adminSection}>
          <div className={styles.adminDetails}>
            <span className={styles.adminName}>{adminName}</span>
            <span className={styles.adminRole}>مدیر</span>
          </div>
          <img src={adminPhoto} alt="Admin" className={styles.adminPhoto} />
        </div>
        <img src={line} alt="divider" style={{ marginLeft: "16px" }} />
        <div className={styles.searchBar}>
          <img src={search} alt="search icon" />
          <input
            type="text"
            placeholder="جستجوی کالا"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.managementSection}>
        <div>
          <span className={styles.managementTitle}>مدیریت کالا</span>
          <img
            className={styles.managementIcon}
            src={management}
            alt="Management"
          />
        </div>
        <button
          className={styles.addProduct}
          onClick={() => setAddModalOpen(true)}
        >
          افزودن محصول
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>نام کالا</th>
              <th>موجودی</th>
              <th>قیمت</th>
              <th>شناسه کالا</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.id}</td>
                  <td>
                    <button
                      className={styles.tableButton}
                      onClick={() => handleEdit(product)}
                    >
                      <img src={edit} alt="Edit" />
                    </button>
                    <button
                      className={styles.tableButton}
                      onClick={() => {
                        setCurrentProduct(product);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <img src={trash} alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        className={styles.pagination}
        pageCount={totalPages}
        marginPagesDisplayed={0}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={styles.paginationContainer}
        pageLinkClassName={styles.pageLink}
        activeClassName={styles.activePage}
        previousLabel={null}
        nextLabel={null}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={
          currentProduct || { name: "", quantity: 0, price: 0, id: "" }
        }
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        productId={currentProduct?.id}
      />

      {isAddModalOpen && (
        <AddModal
          onCancel={() => setAddModalOpen(false)}
          onCreate={handleCreateProduct}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductList;
