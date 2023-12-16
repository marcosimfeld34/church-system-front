import { useToast } from "@chakra-ui/react";

export const useMessage = () => {
  const toast = useToast();

  const showMessage = (title, status, colorScheme, description) => {
    toast({
      position: "top",
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
      colorScheme,
      variant: "subtle",
    });
  };

  return { showMessage };
};
