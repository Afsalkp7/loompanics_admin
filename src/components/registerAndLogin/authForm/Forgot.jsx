import React, { useState } from "react";
import { flexStyle, inputFocus } from "./AuthForm";
import { Box, Button, Flex, FormControl, FormLabel, Input, Link, Stack, useColorModeValue, useToast } from "@chakra-ui/react";
import API from "../../../utils/api";

function Forgot({
  isForgot,
  setIsForgot,
  isOtpSended,
  setIsOtpSended,
  setEmail, // Add setEmail prop
}) {
  const [localEmail, setLocalEmail] = useState(""); // Local state to capture email
  const toast = useToast(); // Chakra UI toast for notifications

  const handleSubmit = async () => {
    try {
      // Send request to forgot password API
      const response = await API.post('/adminAuth/forgot', { email: localEmail });

      // Handle successful response
      if (response.status === 200) {
        setEmail(localEmail); // Pass the email to the parent state
        setIsOtpSended(true); // Transition to OTP form
        toast({
          title: "Success",
          description: response.data.msg,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      // Handle error response
      toast({
        title: "Error",
        description: error.response ? error.response.data.msg : "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex sx={flexStyle}>
      <Stack maxW={"lg"} width={"100%"}>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")}>
          <Stack spacing={{ base: 0, md: 1 }}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                width={"100%"}
                sx={inputFocus}
                value={localEmail} // Bind the input to local state
                onChange={(e) => setLocalEmail(e.target.value)} // Update local state
              />
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Stack direction={{ base: "column", sm: "row" }} align={"start"} justify={"space-between"}>
                <Link
                  color={"black"}
                  textDecoration={"underline"}
                  onClick={() => {
                    setIsForgot(!isForgot);
                  }}
                >
                  Back to Login
                </Link>
              </Stack>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"black"}
                color={"white"}
                _hover={{ bg: "gray.900" }}
                onClick={handleSubmit} // Trigger the handleSubmit function
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Forgot;
