import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../redux/auth/operations";
import { clearAuthError } from "../../redux/auth/slice";
import { toast } from "react-toastify";
import css from "./LoginForm.module.css";

const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6).required("Required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(`Login failed: ${error}`);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (values, actions) => {
    try {
      await dispatch(logIn(values)).unwrap();
      actions.resetForm();
      toast.success("Logged in successfully!");
      navigate("/");
    } catch {
      toast.error("Login failed.");
    }
  };

  return (
    <div className={css.screen}>
      <div className={css.wrapper}>
        <h2 className={css.title}>Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          <Form className={css.form}>
            <label className={css.label}>
              Email
              <Field name="email" type="email" className={css.field} />
            </label>
            <label className={css.label}>
              Password
              <Field name="password" type="password" className={css.field} />
            </label>

            <button className={css.button} type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
