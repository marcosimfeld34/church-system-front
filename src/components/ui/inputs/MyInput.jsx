import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";

const MyInput = (props) => {
  const { formik, field, type, placeholder, label, isRequired, isDisabled } =
    props;
  return (
    <FormControl isInvalid={formik.errors[field] && formik.touched[field]}>
      <FormLabel htmlFor={field}>{label}:</FormLabel>
      <Input
        name={field}
        id={field}
        type={type}
        value={formik.values[field]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isDisabled={isDisabled}
        placeholder={placeholder}
        isInvalid={formik.errors[field] && formik.touched[field]}
        required={isRequired}
      />
      {formik.errors[field] && formik.touched[field] && (
        <FormErrorMessage>{formik.errors[field]}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default MyInput;
