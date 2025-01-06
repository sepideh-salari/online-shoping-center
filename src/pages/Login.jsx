import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Union from "../asset/Union.svg";
import styles from "../styles/Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("نام کاربری الزامی است"),
    password: Yup.string()
      .min(4, "رمز عبور باید حداقل ۴ کاراکتر باشد")
      .required("رمز عبور الزامی است"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const apiUrl = `${import.meta.env.VITE_BASE_URL}/auth/login`;

      const response = await axios.post(apiUrl, values, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        alert("شما با موفقیت وارد حساب کاربری خود شده اید");
        navigate("/products");
      } else {
        throw new Error("خطا! مجدد وارد حساب کاربری خود شوید");
      }
    } catch (error) {
      setErrors({
        apiError:
          error.response?.data?.message ||
          "خطا! متاسفانه شما وارد حساب کاربری خود نشدید",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1>بوت کمپ بوتواستارت</h1>
      <div className={styles.container}>
        <img src={Union} alt="logo" />
        <h1 className={styles.title}>فرم ورود</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <div>
                <label>
                  <Field type="text" name="username" placeholder="نام کاربری" />
                </label>
                <ErrorMessage
                  name="username"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              <div>
                <label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="رمز عبور"
                  />
                </label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              {errors.apiError && (
                <div className="error">{errors.apiError}</div>
              )}
              <button type="submit" disabled={isSubmitting}>
                ورود
              </button>
            </Form>
          )}
        </Formik>
        <Link to="/signup"> ایجاد حساب کاربری!</Link>
      </div>
    </>
  );
};

export default Login;
