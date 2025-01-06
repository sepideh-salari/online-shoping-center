import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AddModal.module.css";
const AddModal = ({ onCancel, onCreate, onClose }) => {
  const initialValues = {
    name: "",
    quantity: "",
    price: "",
  };
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    name: Yup.string().required("نام الزامی است"),
    quantity: Yup.number()
      .required("تعداد الزامی است")
      .positive("تعداد باید بیشتر از صفر باشد"),
    price: Yup.number()
      .required("قیمت الزامی است")
      .positive("قیمت باید بیشتر از صفر باشد"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("لطفا وارد حساب کاربری شوید.");
      navigate("/login");

      return;
    }

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const newProduct = await response.json();
      onCreate(newProduct);

      onCancel();
    } catch (error) {
      alert("خطا در ایجاد محصول!");
    }
  };

  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose}></div>
      <div className={styles.modal}>
        <h2>ایجاد محصول جدید</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div>
                <label>
                  نام کالا
                  <Field type="text" name="name" />
                  <ErrorMessage name="name" component="div" className="error" />
                </label>
              </div>
              <div>
                <label>
                  تعداد موجودی
                  <Field type="number" name="quantity" />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="error"
                  />
                </label>
              </div>
              <div>
                <label>
                  قیمت
                  <Field type="number" name="price" />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="error"
                  />
                </label>
              </div>
              <div className="button-group">
                <button type="button" onClick={onCancel}>
                  انصراف
                </button>
                <button type="submit">ایجاد</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddModal;
