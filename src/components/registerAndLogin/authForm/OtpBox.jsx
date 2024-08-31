import { useState } from "react";
import {
  Box,
  Center,
  Heading,
  Link,
  Text,
  Button,
  FormControl,
  Flex,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../../../utils/api";

export default function OtpBox({
  email,
  setEmail,
  setIsOtpSended,
  isForgot,
  setIsForgot,
  onOtpVerificationSuccess,
  setNeedToChange
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Move useNavigate outside the async function

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await API.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );
      if (isForgot) {
        if (response.data.token) {
          toast.success(response.data.msg || "Email verified");
          setIsOtpSended(false)
          setNeedToChange(true)
        } else {
          console.error("Verification failed:", response.data.msg);
          toast.error(response.data.msg);
        }
      }else{
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          toast.success(response.data.msg || "Email verified");
          if (onOtpVerificationSuccess) {
            onOtpVerificationSuccess(); // Trigger the success callback if provided
          }
        } else {
          console.error("Verification failed:", response.data.msg);
          toast.error(response.data.msg);
        }
      }
      
    } catch (error) {
      console.error(
        "OTP Verification Error:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response?.data?.msg || "An error occurred during verification"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await API.post("/auth/resend-otp", { email });
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error(
        "Error Resending OTP:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response?.data?.msg || "An error occurred while resending OTP"
      );
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack w={"full"} maxW={"sm"} spacing={6}>
        <FormControl>
          <Center>
            <HStack>
              <PinInput value={otp} onChange={handleOtpChange}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Center>
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"black"}
            color={"white"}
            _hover={{
              bg: "gray.900",
            }}
            isLoading={loading}
            onClick={handleVerifyOtp}
          >
            Verify
          </Button>
        </Stack>
        <Stack spacing={10} pt={2}>
          <Stack
            direction={{ base: "column", sm: "row" }}
            align={"start"}
            justify={"space-between"}
          >
            <Text color={"black"}>
              Not yet received?
              <Link textDecoration={"underline"} onClick={handleResendOtp}>
                Resend
              </Link>
            </Text>
            <Text color={"black"}>
              <Link
                onClick={() => {
                  setIsForgot(false);
                  navigate("/"); // Navigates to the home page on "Back" click
                }}
              >
                Back
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
}
