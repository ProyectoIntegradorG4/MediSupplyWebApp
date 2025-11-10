import { Box, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Delivery = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Heading size="lg" mb={4}>{t('delivery.title')}</Heading>
      <Text>{t('delivery.comingSoon')}</Text>
    </Box>
  );
};

export default Delivery;
