import { useState } from "react";
import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import * as Yup from "yup";
import Select from "react-select";
import { useQuery } from "react-query";

// formik
import { useFormik } from "formik";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";

const Register = () => {
  const { register, login, user, getProfiles } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
  });

  const from = location.state?.from?.pathname || "/";

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const onSubmit = async ({
    firstName,
    lastName,
    email,
    password,
    profile,
  }) => {
    const response = await register({
      firstName,
      lastName,
      username: firstName + lastName,
      email,
      password,
      profile,
    });
    if (response && response.isStored && response.status === 201) {
      await login(email, password);
      navigate(from, { replace: true });
    }
  };

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("Requerido"),
    lastName: Yup.string().required("Requerido"),
    email: Yup.string()
      .email("Usá el formato usuario@dominio.com")
      .required("Requerido"),
    password: Yup.string().min(6, "Muy corta!").required("Requerido"),
    profile: Yup.string().required("Requerido"),
  });

  const { handleSubmit, values, setFieldValue, errors, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      profile: "",
      registerEnabledBtn: false,
    },
    validationSchema: RegisterSchema,
    onSubmit,
  });

  const onChangeEmail = (e) => {
    setFieldValue("email", e.target.value);
    if (
      values.email &&
      values.password &&
      values.firstName &&
      values.lastName
    ) {
      setFieldValue("registerEnabledBtn", true);
    }
  };

  const onChangePassword = (e) => {
    setFieldValue("password", e.target.value);
    if (
      values.email &&
      values.password &&
      values.firstName &&
      values.lastName
    ) {
      setFieldValue("registerEnabledBtn", true);
    }
  };

  const onChangeFirstName = (e) => {
    setFieldValue("firstName", e.target.value);
    if (
      values.email &&
      values.password &&
      values.firstName &&
      values.lastName
    ) {
      setFieldValue("registerEnabledBtn", true);
    }
  };

  const onChangeLastName = (e) => {
    setFieldValue("lastName", e.target.value);
    if (
      values.email &&
      values.password &&
      values.firstName &&
      values.lastName
    ) {
      setFieldValue("registerEnabledBtn", true);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const profilesOptions = profiles?.map((profile) => {
    return { label: profile.name, value: profile._id };
  });

  const handleSelectProfile = ({ value }) => {
    setFieldValue("profile", value);
  };

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
            colStart={{ base: 2, sm: 3, md: 4 }}
          >
            <Card mb={3} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  Worship System
                </Heading>
                <form noValidate onSubmit={handleSubmit}>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={2}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <FormControl isInvalid={errors.firstName}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                          type="text"
                          value={values.firstName}
                          onChange={onChangeFirstName}
                          placeholder="Ingresá tu nombre"
                          isInvalid={errors.firstName && touched.firstName}
                          required
                        />
                        <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <FormControl isInvalid={errors.lastName}>
                        <FormLabel>Apellido</FormLabel>
                        <Input
                          type="text"
                          value={values.lastName}
                          onChange={onChangeLastName}
                          placeholder="Ingresá tu apellido"
                          isInvalid={errors.lastName && touched.lastName}
                          required
                        />
                        <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl isInvalid={errors.profile}>
                        <FormLabel>Perfil</FormLabel>
                        <Select
                          options={profilesOptions}
                          onChange={handleSelectProfile}
                          name="profile"
                          placeholder="Buscar perfil"
                          noOptionsMessage={() => "No hay perfiles"}
                          isInvalid={errors.profile && touched.profile}
                          required
                        />
                        <FormErrorMessage>{errors.profile}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Grid mb={4}>
                    <GridItem>
                      <FormControl isInvalid={errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={values.email}
                          onChange={onChangeEmail}
                          placeholder="Ingresá un email"
                          isInvalid={errors.email && touched.email}
                          required
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Grid mb={4}>
                    <GridItem>
                      <FormControl isInvalid={errors.password}>
                        <FormLabel>Contraseña</FormLabel>
                        <InputGroup size="md">
                          <Input
                            type={show ? "text" : "password"}
                            value={values.password}
                            onChange={onChangePassword}
                            placeholder="Ingresá tu contraseña"
                            isInvalid={errors.password && touched.password}
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
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <VStack
                    divider={<StackDivider borderColor="gray.200" />}
                    spacing={3}
                    align="stretch"
                  >
                    <Button type="submit" colorScheme="blue" variant="solid">
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
      )}
    </>
  );
};

export default Register;
