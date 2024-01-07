import { Card, CardBody, Alert, AlertIcon } from "@chakra-ui/react";

const WithoutResults = ({ text }) => {
  return (
    <Card variant="outline">
      <CardBody>
        <Alert colorScheme="purple" status="success">
          <AlertIcon />
          {text}
        </Alert>
      </CardBody>
    </Card>
  );
};

export default WithoutResults;
