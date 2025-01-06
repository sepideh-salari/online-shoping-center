import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Union from "../asset/Union.svg";
import styles from "../styles/Singup.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Signup successful:", response.data);
      alert("حساب کاربری با موفقیت ساخته شد");
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error.response?.data || error.message);
      setErrors({
        apiError:
          error.response?.data?.message || "متاسفانه حساب کاربری ساخته نشد",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1>بوت کمپ بوتواستارت</h1>
      <div className={styles.container}>
        <img src={Union} alt="" />
        <h1 className={styles.title}>فرم ثبت نام</h1>
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
                <ErrorMessage name="username" component="div" />
              </div>
              <div>
                <label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="رمز عبور"
                  />
                </label>
                <ErrorMessage name="password" component="div" />
              </div>
              <div>
                <label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="تکرار رمز عبور"
                  />
                </label>
                <ErrorMessage name="confirmPassword" component="div" />
              </div>
              {errors.apiError && (
                <div className="error">{errors.apiError}</div>
              )}
              <button type="submit" disabled={isSubmitting}>
                ثبت نام
              </button>
            </Form>
          )}
        </Formik>
        <Link to="/login">حساب کاربری دارید؟</Link>
      </div>
    </>
  );
};

export default Signup;
