import { useState } from "react";
import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Image,
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
  Box,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import * as Yup from "yup";

import { useToast } from "@chakra-ui/react";

// formik
import { useFormik } from "formik";

import Logo from "/logo.svg";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";
// import { useMessageContext } from "../hooks/useMessageContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const toast = useToast();

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  // const {
  //   message,
  //   recordType,
  //   type,
  //   handleSetMessage,
  //   handleSetType,
  //   handleSetRecordType,
  //   clearMessages,
  // } = useMessageContext();

  const { login, user } = useAuthContext();

  const onSubmit = async ({ email, password }) => {
    setFieldValue("isLoading", true);

    const { data } = await login(email, password);

    if (data?.status === 404) {
      setFieldValue("isLoading", false);
      toast({
        title: "Credenciales incorrectas",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (data?.status === 200) navigate(from, { replace: true });
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Usá el formato usuario@dominio.com")
      .required("Requerido"),
    password: Yup.string().min(6, "Muy corta!").required("Requerido"),
  });

  const { handleSubmit, values, setFieldValue, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
        isLoading: false,
      },
      validationSchema: LoginSchema,
      onSubmit,
    });

  const onChangeEmail = (e) => {
    setFieldValue("email", e.target.value);
    if (values.email && values.password) {
      setFieldValue("loginEnabledBtn", true);
    }
  };

  const onChangePassword = (e) => {
    setFieldValue("password", e.target.value);
    if (values.email && values.password) {
      setFieldValue("loginEnabledBtn", true);
    }
  };

  const handleShowRegister = () => {
    navigate("/register");
  };

  // const handleRecoverPassword = () => {
  // handleSetMessage(null);
  // handleSetType(null);
  // handleSetRecordType(null);
  // navigate("/forgot-password");
  // };

  // const showMessage = () => {
  //   return message !== null && recordType === "user";
  // };

  return (
    <>
      {user && <Navigate to={from} replace />}
      {!user && (
        <Grid
          templateColumns="repeat(12, 1fr)"
          justifyContent={"center"}
          alignContent={"center"}
          h={"100vh"}
        >
          <GridItem
            colSpan={{ base: 10, sm: 8, md: 6 }}
            colStart={{ base: 2, sm: 2, md: 4 }}
          >
            <Card mb={3} variant="outline">
              <CardBody>
                <Box p={2} display={"flex"} placeContent={"center"}>
                  <Image
                    borderRadius="full"
                    boxSize={{ base: 100, md: 150 }}
                    src={Logo}
                    alt="el rio logo"
                  />
                </Box>
                <form noValidate onSubmit={handleSubmit}>
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl isInvalid={touched.email && errors.email}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          type="email"
                          value={values.email}
                          name="email"
                          id="email"
                          onBlur={handleBlur}
                          onChange={onChangeEmail}
                          placeholder="Ingresá tu email"
                          isInvalid={touched.email && errors.email}
                          required
                        />
                        {touched.email && errors.email && (
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        )}
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl
                        isInvalid={touched.password && errors.password}
                      >
                        <FormLabel htmlFor="password">Contraseña</FormLabel>
                        <InputGroup size="md">
                          <Input
                            type={show ? "text" : "password"}
                            value={values.password}
                            name="password"
                            id="password"
                            onChange={onChangePassword}
                            onBlur={handleBlur}
                            placeholder="Ingresá tu contraseña"
                            isInvalid={touched.password && errors.password}
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
                        {touched.password && errors.password && (
                          <FormErrorMessage>{errors.password}</FormErrorMessage>
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
                      isLoading={values.isLoading}
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
      )}
    </>
  );
};

export default Login;
