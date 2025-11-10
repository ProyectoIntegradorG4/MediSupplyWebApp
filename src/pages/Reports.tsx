import { Box, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Heading size="lg" mb={4}>{t('reports.title')}</Heading>
      <Text>{t('reports.comingSoon')}</Text>
    </Box>
  );
};

export default Reports;
