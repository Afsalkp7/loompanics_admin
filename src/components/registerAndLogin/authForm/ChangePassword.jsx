import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { flexStyle, inputFocus } from "./AuthForm";
import API from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Define the validation schema with Yup
const validationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

function ChangePassword({
  email,
  isForgot,
  setIsForgot,
  isRegister,
  setIsRegister,
  isOtpSended,
  setIsOtpSended,
  needToChange,
  setNeedToChange,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    setLoading(true);
    try {
      const response = await API.put("/auth/password", {
        email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully!");
        setNeedToChange(false);
        setIsForgot(false);
        navigate("/");
      } else {
        toast.error(response.data.msg || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "An error occurred during password change");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex sx={flexStyle}>
      <Stack maxW={"lg"} width={"100%"}>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")}>
          <Formik
            initialValues={{
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack spacing={{ base: 0, md: 1 }}>
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
                    <ErrorMessage name="password" component="div" />
                  </FormControl>

                  <FormControl id="confirmPassword">
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <Field name="confirmPassword">
                        {({ field }) => (
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            width={"100%"}
                            sx={inputFocus}
                          />
                        )}
                      </Field>
                      <InputRightElement h={"full"}>
                        <Button
                          variant={"ghost"}
                          onClick={() => setShowConfirmPassword(
                            (showConfirmPassword) => !showConfirmPassword
                          )}
                        >
                          {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <ErrorMessage name="confirmPassword" component="div" />
                  </FormControl>

                  <Button
                    type="submit"
                    isLoading={isSubmitting || loading}
                    loadingText="Submitting"
                    size="lg"
                    bg={"black"}
                    color={"white"}
                    _hover={{ bg: "gray.900" }}
                  >
                    Submit
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
}

export default ChangePassword;
