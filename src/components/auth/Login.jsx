import { useState } from "react";
import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  // Image,
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
  // Box,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";

// formik
import { useFormik } from "formik";

// import Logo from "/logo.svg";

// custom hooks
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMessage } from "../../hooks/useMessage";

import loginService from "../../services/login";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { showMessage } = useMessage();

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const { setAuth } = useAuthContext();

  const onSubmit = async ({ email, password }) => {
    formik.setFieldValue("isLoading", true);

    try {
      const response = await loginService.login({ email, password });

      const accessToken = response?.data?.accessToken;

      setAuth({ accessToken });

      navigate(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        showMessage("Error del servidor", "error", "red");
      } else if (error?.response?.status === 400) {
        showMessage("Campos incompletos", "error", "red");
      } else if (error.response?.status === 404) {
        showMessage("Credenciales incorrectas", "error", "red");
      } else {
        showMessage("Falló el inicio de sesión", "error", "red");
      }
    } finally {
      formik.resetForm({ email: "", password: "", isLoading: false });
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Usá el formato usuario@dominio.com")
      .required("Requerido"),
    password: Yup.string().min(6, "Muy corta!").required("Requerido"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      isLoading: false,
    },
    validationSchema: LoginSchema,
    onSubmit,
  });

  const onChangeEmail = (e) => {
    formik.setFieldValue("email", e.target.value);
    if (formik.values.email && formik.values.password) {
      formik.setFieldValue("loginEnabledBtn", true);
    }
  };

  const onChangePassword = (e) => {
    formik.setFieldValue("password", e.target.value);
    if (formik.values.email && formik.values.password) {
      formik.setFieldValue("loginEnabledBtn", true);
    }
  };

  const handleShowRegister = () => {
    navigate("/register");
  };

  // const handleRecoverPassword = () => {
  // navigate("/forgot-password");
  // };

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
              <Heading size="md">Inicio de sesión</Heading>
            </CardHeader>
            <CardBody>
              {/* <Box p={2} display={"flex"} placeContent={"center"}>
                <Image
                  borderRadius="full"
                  boxSize={{ base: 100, md: 150 }}
                  src={Logo}
                  alt="el rio logo"
                />
              </Box> */}
              <form noValidate onSubmit={formik.handleSubmit}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                      isInvalid={formik.touched.email && formik.errors.email}
                    >
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        type="email"
                        value={formik.values.email}
                        name="email"
                        id="email"
                        onBlur={formik.handleBlur}
                        onChange={onChangeEmail}
                        placeholder="Ingresá tu email"
                        isInvalid={formik.touched.email && formik.errors.email}
                        required
                      />
                      {formik.touched.email && formik.errors.email && (
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
                        formik.touched.password && formik.errors.password
                      }
                    >
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <InputGroup size="md">
                        <Input
                          type={show ? "text" : "password"}
                          value={formik.values.password}
                          name="password"
                          id="password"
                          onChange={onChangePassword}
                          onBlur={formik.handleBlur}
                          placeholder="Ingresá tu contraseña"
                          isInvalid={
                            formik.touched.password && formik.errors.password
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
                      {formik.touched.password && formik.errors.password && (
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
                    isLoading={formik.values.isLoading}
                    type="submit"
                    colorScheme="blue"
                    variant="solid"
                  >
                    Iniciar sesión
                  </Button>

                  {/* <Button
                      colorScheme="blue"
                      variant="link"
                      onClick={() => handleRecoverPassword()}
                    >
                      ¿Olvidaste tu clave?
                    </Button> */}
                </VStack>
              </form>
            </CardBody>
          </Card>
          <Card variant="outline">
            <CardBody>
              <Text>
                ¿No tenes cuenta?{" "}
                <Button
                  colorScheme="blue"
                  variant="link"
                  onClick={() => handleShowRegister()}
                >
                  Crear una cuenta
                </Button>
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
};

export default Login;
