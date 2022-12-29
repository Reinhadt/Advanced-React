import { useEffect, useState } from 'react';

export const useForm = (initial = {}) => {
  // create state obj for fields
  const [inputs, setInputs] = useState(initial);
  // we have to start intiialValues and create an string from
  // because of the way the data loads inthe fields in update product case
  // the data comes from the server after await for it but useForm gets initialized
  // with undefined data so we force the set of the inputs when the initial value changes
  // inside of a useEffect hook
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    console.log(inputs);
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    console.log(blankState);
    setInputs(blankState);
  }

  // return stuaf
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
};
