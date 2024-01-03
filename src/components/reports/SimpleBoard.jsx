import { Card, CardBody, Flex, Text } from "@chakra-ui/react";

const SimpleBoard = ({ amount, size, title }) => {
  return (
    <Card variant="outline">
      <CardBody>
        <Flex direction={"column"}>
          <Text>{title}</Text>
          <Text fontSize={"2xl"} as="b">
            {amount
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  minimumFractionDigits: 2,
                  currency: "USD",
                }).format(size?.length > 0 ? amount : 0)
              : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  minimumFractionDigits: 2,
                  currency: "USD",
                }).format(0)}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default SimpleBoard;
