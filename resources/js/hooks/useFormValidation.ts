import { useState } from 'react';

export function useFormValidation(initialValues: any, validate: (values: any) => any) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name: string, value: any) => {
    setValues({ ...values, [name]: value });
    setTouched({ ...touched, [name]: true });
    setErrors(validate({ ...values, [name]: value }));
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    setErrors(validate(values));
  };

  const validateForm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate: validateForm,
  };
}
