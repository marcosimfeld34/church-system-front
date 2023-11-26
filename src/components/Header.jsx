"use client";

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Image,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  // ChevronRightIcon,
  ArrowForwardIcon,
} from "@chakra-ui/icons";

import Logo from "../../public/logo.svg";

// custom hooks
import { useAuthContext } from "../hooks/useAuthContext";

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();

  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "space-between" }}
        >
          <Flex gap={1}>
            <Image
              borderRadius="full"
              boxSize={{ base: 50, md: 25 }}
              src={Logo}
              alt="el rio logo"
            />
            <Text
              display={{ base: "none", md: "flex" }}
              textAlign={useBreakpointValue({ base: "center", md: "left" })}
              fontFamily={"heading"}
              color={useColorModeValue("gray.800", "white")}
            >
              RIO
            </Text>
          </Flex>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav user={user} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Button
            fontSize={"sm"}
            fontWeight={500}
            variant={"link"}
            mt={0.5}
            pl={5}
            colorScheme="purple"
            onClick={() => handleLogout()}
          >
            Salir
            <ArrowForwardIcon boxSize={4} ml={1} />
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav user={user} />
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ user }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  // const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => {
        if (navItem?.profiles?.includes(user?.profile)) {
          return (
            <Box key={navItem.label}>
              {/* <Popover trigger={"hover"} placement={"bottom-start"}>
                <PopoverTrigger> */}
              {navItem.label === "Divider" && (
                <Divider
                  borderColor={"gray.400"}
                  borderWidth={"revert-layer"}
                  orientation="vertical"
                />
              )}
              {navItem.label !== "Divider" && (
                <Box
                  as="a"
                  p={2}
                  href={navItem.href ?? "#"}
                  fontSize={"sm"}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: { linkHoverColor },
                    bg: "purple.100",
                    borderRadius: "5px",
                  }}
                >
                  {navItem.label}
                </Box>
              )}
              {/* </PopoverTrigger> */}

              {/* {navItem.children && (
                  <PopoverContent
                    border={0}
                    boxShadow={"xl"}
                    bg={popoverContentBgColor}
                    p={4}
                    rounded={"xl"}
                    minW={"sm"}
                  >
                    <Stack>
                      {navItem.children.map((child) => (
                        <DesktopSubNav key={child.label} {...child} />
                      ))}
                    </Stack>
                  </PopoverContent>
                )}
              </Popover> */}
            </Box>
          );
        }
      })}
    </Stack>
  );
};

// const DesktopSubNav = ({ label, href, subLabel }) => {
//   return (
//     <Box
//       as="a"
//       href={href}
//       role={"group"}
//       display={"block"}
//       p={2}
//       rounded={"md"}
//       _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
//     >
//       <Stack direction={"row"} align={"center"}>
//         <Box>
//           <Text
//             transition={"all .3s ease"}
//             _groupHover={{ color: "pink.400" }}
//             fontWeight={500}
//           >
//             {label}
//           </Text>
//           <Text fontSize={"sm"}>{subLabel}</Text>
//         </Box>
//         <Flex
//           transition={"all .3s ease"}
//           transform={"translateX(-10px)"}
//           opacity={0}
//           _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
//           justify={"flex-end"}
//           align={"center"}
//           flex={1}
//         >
//           <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
//         </Flex>
//       </Stack>
//     </Box>
//   );
// };

const MobileNav = ({ user }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={0}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => {
        if (navItem?.profiles?.includes(user?.profile)) {
          return <MobileNavItem key={navItem.label} {...navItem} />;
        }
      })}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      {label === "Divider" && (
        <Box py={0}>
          <Divider
            borderColor={"gray.400"}
            borderWidth={"revert-layer"}
            orientation="horizontal"
          />
        </Box>
      )}
      {label !== "Divider" && (
        <Box
          p={3}
          as="a"
          href={href ?? "#"}
          justifyContent="space-between"
          alignItems="center"
          _hover={{
            textDecoration: "none",
          }}
        >
          <Text fontWeight={600} color={"gray.600"}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={"all .25s ease-in-out"}
              transform={isOpen ? "rotate(180deg)" : ""}
              w={6}
              h={6}
            />
          )}
        </Box>
      )}

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Ventas",
    href: "/",
    profiles: ["System Administrator", "Seller"],
  },
  {
    label: "Deudas",
    href: "/debts",
    profiles: ["System Administrator", "Seller"],
  },
  {
    label: "Divider",
    href: "#",
    profiles: ["System Administrator", "Seller"],
  },
  {
    label: "Productos",
    href: "/products",
    profiles: ["System Administrator", "Seller"],
  },
  {
    label: "Categorias",
    href: "/categories",
    profiles: ["System Administrator", "Seller"],
  },
  {
    label: "Clientes",
    href: "/clients",
    profiles: ["System Administrator", "Seller"],
  },
  {
    label: "Gráficos",
    href: "/reports",
    profiles: ["System Administrator", "Seller"],
  },
];

export default Header;
