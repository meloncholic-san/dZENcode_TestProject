// import { useEffect } from "react";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { register } from "../../redux/auth/operations";
// import { toast } from "react-toastify";
// import css from "./RegistrationForm.module.css";

// const RegisterSchema = Yup.object({
//   name: Yup.string().required("Name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string().min(6).required("Password is required"),
// });

// export default function RegistrationForm() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { error, isLoading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (error) toast.error(`Registration failed: ${error}`);
//   }, [error]);

//   const handleSubmit = async (values, actions) => {
//     try {
//       await dispatch(register(values)).unwrap();
//       actions.resetForm();
//       toast.success(`Welcome, ${values.name}!`);
//       navigate("/");
//     } catch {
//       toast.error("Registration failed.");
//     }
//   };

//   return (
//     <div className={css.screen}>
//       <div className={css.wrapper}>
//         <h2 className={css.title}>Register</h2>
//         <Formik
//           initialValues={{ name: "", email: "", password: "" }}
//           validationSchema={RegisterSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ errors, touched }) => (
//             <Form className={css.form}>
//               <label className={css.label}>
//                 Name
//                 <Field
//                   name="name"
//                   type="text"
//                   className={`${css.field} ${
//                     errors.name && touched.name ? css.errorField : ""
//                   }`}
//                 />
//               </label>
//               <label className={css.label}>
//                 Email
//                 <Field
//                   name="email"
//                   type="email"
//                   className={`${css.field} ${
//                     errors.email && touched.email ? css.errorField : ""
//                   }`}
//                 />
//               </label>
//               <label className={css.label}>
//                 Password
//                 <Field
//                   name="password"
//                   type="password"
//                   className={`${css.field} ${
//                     errors.password && touched.password ? css.errorField : ""
//                   }`}
//                 />
//               </label>

//               <button className={css.button} type="submit" disabled={isLoading}>
//                 {isLoading ? "Registering..." : "Register"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../redux/auth/operations";
import { toast } from "react-toastify";
import css from "./RegistrationForm.module.css";

const RegisterSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
});

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (error) toast.error(`Registration failed: ${error}`);
  }, [error]);

  const handleSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await dispatch(register(formData)).unwrap();
      actions.resetForm();
      setAvatarFile(null);
      toast.success(`Welcome, ${values.name}!`);
      navigate("/");
    } catch {
      toast.error("Registration failed.");
    }
  };

  return (
    <div className={css.screen}>
      <div className={css.wrapper}>
        <h2 className={css.title}>Register</h2>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className={css.form}>
              <label className={css.label}>
                Name
                <Field
                  name="name"
                  type="text"
                  className={`${css.field} ${
                    errors.name && touched.name ? css.errorField : ""
                  }`}
                />
              </label>

              <label className={css.label}>
                Email
                <Field
                  name="email"
                  type="email"
                  className={`${css.field} ${
                    errors.email && touched.email ? css.errorField : ""
                  }`}
                />
              </label>

              <label className={css.label}>
                Password
                <Field
                  name="password"
                  type="password"
                  className={`${css.field} ${
                    errors.password && touched.password ? css.errorField : ""
                  }`}
                />
              </label>

              <label className={css.label}>
                Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    setAvatarFile(file);
                    setFieldValue("avatar", file);
                  }}
                  className={css.field}
                />
              </label>

              <button className={css.button} type="submit" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
