import * as Yup from "yup";

const NameSchema = Yup.object().shape({
  name: Yup.string().required("Requerido"),
});

export default NameSchema;
