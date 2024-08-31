import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Text,
    Link,
    useColorModeValue,
    Checkbox,
    Divider,
    Image,
    FormHelperText,
  } from "@chakra-ui/react";
  import googleIcon from "../../../assets/Logo-google-icon.png";
  import { useState } from "react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { flexStyle, inputFocus } from "./AuthForm";
  import { Formik, Form, Field, ErrorMessage } from "formik";
  import * as Yup from "yup";
  import { useDispatch, useSelector } from "react-redux";
  import { loginUser } from "../../../redux/authSlice";
  import { toast } from "react-toastify";
  import { useNavigate } from "react-router-dom";
  
  // Define the validation schema with Yup
//   const validationSchema = (isRegister) =>
//     Yup.object({
//       firstName: Yup.string()
//         .min(3, "Name must be at least 3 characters long")
//         .when([], {
//           is: () => isRegister,
//           then: (schema) => schema.required("Name is required"),
//           otherwise: (schema) => schema.notRequired(),
//         }),
//       email: Yup.string().email("Invalid email address").required("Email is required"),
//       phoneNumber: Yup.string()
//         .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
//         .when([], {
//           is: () => isRegister,
//           then: (schema) => schema.required("Phone number is required"),
//           otherwise: (schema) => schema.notRequired(),
//         }),
//       password: Yup.string()
//         .required("Password is required")
//         .matches(
//           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//           "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
//         ),
//       confirmPassword: Yup.string()
//         .oneOf([Yup.ref("password"), null], "Passwords must match")
//         .when([], {
//           is: () => isRegister,
//           then: (schema) => schema.required("Confirm password is required"),
//           otherwise: (schema) => schema.notRequired(),
//         }),
//     });
  
  export default function AuthForm({
    isForgot,
    setIsForgot,
    isOtpSended,
    setIsOtpSended,
    setEmail,
  }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async (values, actions) => {
      // Destructure confirmPassword from values and include it in the submission
    
      try {
        let response;
          response = await dispatch(loginUser(values));
          navigate("/");
    
      } catch (error) {
        toast.error(error.message || "Login failed");
      } finally {
        actions.setSubmitting(false);
      }
    };
  
    return (
      <Flex sx={flexStyle}>
        <Stack maxW={"lg"} width={"100%"}>
          <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")}>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
            //   validationSchema={() => validationSchema(isRegister)}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Stack spacing={{ base: 0, md: 1 }}>
  
                    <FormControl id="email">
                      <FormLabel>Email address</FormLabel>
                      <Field name="email">
                        {({ field }) => (
                          <Input {...field} type="email" width={"100%"} sx={inputFocus} />
                        )}
                      </Field>
                      <ErrorMessage name="email" component={FormHelperText} />
                    </FormControl>
  
                    
                    <FormControl id="password">
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Field name="password">
                          {({ field }) => (
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              width={"100%"}
                              sx={inputFocus}
                            />
                          )}
                        </Field>
                        <InputRightElement h={"full"}>
                          <Button
                            variant={"ghost"}
                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                          >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <ErrorMessage name="password" component={FormHelperText} />
                    </FormControl>
  
                    
  
                    <Stack spacing={10} pt={2}>
                      
                        <Stack
                          direction={{ base: "column", sm: "row" }}
                          align={"start"}
                          justify={"space-between"}
                        >
                          
                         
                          <Text color={"black"}>
                            <Link
                              onClick={() => setIsForgot(!isForgot)}
                              textDecoration={"underline"}
                            >
                              Forgot password?
                            </Link>
                          </Text>
                        </Stack>
                      
                      <Button
                        type="submit"
                        isLoading={isSubmitting || loading}
                        size="lg"
                        bg={"black"}
                        color={"white"}
                        _hover={{
                          bg: "gray.900",
                        }}
                      >
                        Login
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </Flex>
    );
  }
  