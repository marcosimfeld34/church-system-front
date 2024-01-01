import { useState } from "react";
import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  // Image,
  // Box,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  VStack,
  StackDivider,
  InputGroup,
  InputRightElement,
  IconButton,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

// custom hooks
import { useMessage } from "../../hooks/useMessage";

// services
import loginService from "../../services/login";

// import Logo from "/logo.svg";

const Register = () => {
  const navigate = useNavigate();

  const { showMessage } = useMessage();

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const onSubmit = async ({ firstName, lastName, email, password }) => {
    try {
      const response = await loginService.register({
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        showMessage("Se registro correctamente", "success", "purple");
        navigate("/login");
      }
    } catch (error) {
      if (!error?.response) {
        showMessage("Error del servidor", "error", "red");
      } else if (error?.response?.status === 400) {
        showMessage("Campos incompletos", "error", "red");
      } else if (error.response?.status === 404) {
        showMessage("Credenciales incorrectas", "error", "red");
      } else if (error.response?.status === 409) {
        showMessage("Ya existe el usuario", "error", "red");
      } else {
        showMessage("Falló el registro", "error", "red");
      }
    } finally {
      formik.resetForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    }
  };

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("Requerido"),
    lastName: Yup.string().required("Requerido"),
    email: Yup.string()
      .email("Usá el formato usuario@dominio.com")
      .required("Requerido"),
    password: Yup.string().min(6, "Muy corta!").required("Requerido"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      registerEnabledBtn: false,
    },
    validationSchema: RegisterSchema,
    onSubmit,
  });

  const onChangeEmail = (e) => {
    formik.setFieldValue("email", e.target.value);
    if (
      formik.values.email &&
      formik.values.password &&
      formik.values.firstName &&
      formik.values.lastName
    ) {
      formik.setFieldValue("registerEnabledBtn", true);
    }
  };

  const onChangePassword = (e) => {
    formik.setFieldValue("password", e.target.value);
    if (
      formik.values.email &&
      formik.values.password &&
      formik.values.firstName &&
      formik.values.lastName
    ) {
      formik.setFieldValue("registerEnabledBtn", true);
    }
  };

  const onChangeFirstName = (e) => {
    formik.setFieldValue("firstName", e.target.value);
    if (
      formik.values.email &&
      formik.values.password &&
      formik.values.firstName &&
      formik.values.lastName
    ) {
      formik.setFieldValue("registerEnabledBtn", true);
    }
  };

  const onChangeLastName = (e) => {
    formik.setFieldValue("lastName", e.target.value);
    if (
      formik.values.email &&
      formik.values.password &&
      formik.values.firstName &&
      formik.values.lastName
    ) {
      formik.setFieldValue("registerEnabledBtn", true);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Grid
        templateColumns="repeat(12, 1fr)"
        justifyContent={"center"}
        alignContent={"center"}
        h={"100vh"}
      >
        <GridItem
          colSpan={{ base: 10, sm: 8, md: 6 }}
          colStart={{ base: 2, sm: 3, md: 4 }}
        >
          <Card mb={3} variant="outline">
            <CardHeader textAlign={"center"}>
              <Heading size="md">Registro</Heading>
            </CardHeader>
            <CardBody>
              {/* <Box mb={2} p={2} display={"flex"} placeContent={"center"}>
                <Image
                  borderRadius="full"
                  boxSize={{ base: 100, md: 150 }}
                  src={Logo}
                  alt="el rio logo"
                />
              </Box> */}
              <form noValidate onSubmit={formik.handleSubmit}>
                <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={2}>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormControl
                      isInvalid={
                        formik.errors.firstName && formik.touched.firstName
                      }
                    >
                      <FormLabel htmlFor="firstName">Nombre</FormLabel>
                      <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formik.values.firstName}
                        onChange={onChangeFirstName}
                        onBlur={formik.handleBlur}
                        placeholder="Ingresá tu nombre"
                        isInvalid={
                          formik.errors.firstName && formik.touched.firstName
                        }
                        required
                      />
                      {formik.errors.firstName && formik.touched.firstName && (
                        <FormErrorMessage>
                          {formik.errors.firstName}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormControl
                      isInvalid={
                        formik.errors.lastName && formik.touched.lastName
                      }
                    >
                      <FormLabel htmlFor="lastName">Apellido</FormLabel>
                      <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formik.values.lastName}
                        onChange={onChangeLastName}
                        onBlur={formik.handleBlur}
                        placeholder="Ingresá tu apellido"
                        isInvalid={
                          formik.errors.lastName && formik.touched.lastName
                        }
                        required
                      />
                      {formik.errors.lastName && formik.touched.lastName && (
                        <FormErrorMessage>
                          {formik.errors.lastName}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>

                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={formik.errors.email && formik.touched.email}
                    >
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        value={formik.values.email}
                        onChange={onChangeEmail}
                        onBlur={formik.handleBlur}
                        placeholder="Ingresá un email"
                        isInvalid={formik.errors.email && formik.touched.email}
                        required
                      />
                      {formik.errors.email && formik.touched.email && (
                        <FormErrorMessage>
                          {formik.errors.email}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>

                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={
                        formik.errors.password && formik.touched.password
                      }
                    >
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <InputGroup size="md">
                        <Input
                          type={show ? "text" : "password"}
                          name="password"
                          id="password"
                          value={formik.values.password}
                          onChange={onChangePassword}
                          onBlur={formik.handleBlur}
                          placeholder="Ingresá tu contraseña"
                          isInvalid={
                            formik.errors.password && formik.touched.password
                          }
                          required
                        />
                        <InputRightElement width="2.5rem">
                          <IconButton
                            colorScheme="blue"
                            variant={"link"}
                            icon={show ? <ViewOffIcon /> : <ViewIcon />}
                            isRound={true}
                            size={"lg"}
                            onClick={handleClick}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {formik.errors.password && formik.touched.password && (
                        <FormErrorMessage>
                          {formik.errors.password}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>

                <VStack
                  divider={<StackDivider borderColor="gray.200" />}
                  spacing={3}
                  align="stretch"
                >
                  <Button
                    isDisabled={!formik.values.registerEnabledBtn}
                    type="submit"
                    colorScheme="blue"
                    variant="solid"
                  >
                    Registrar
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
          <Card variant="outline">
            <CardBody>
              <Text>
                ¿Ya tenes cuenta?{" "}
                <Button
                  colorScheme="blue"
                  variant="link"
                  onClick={() => handleLogin()}
                >
                  Iniciar sesión
                </Button>
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};

export default Register;
