import { Menu, MenuButton, MenuList, MenuItem, Button, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<Icon as={FaGlobe} />}
        variant="ghost"
        size="sm"
        color="white"
        _hover={{ bg: 'blue.600' }}
        _active={{ bg: 'blue.700' }}
      >
        {currentLanguage.flag} {currentLanguage.name}
      </MenuButton>
      <MenuList bg="white" borderColor="gray.200">
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            bg={i18n.language === language.code ? 'blue.50' : 'white'}
            color="gray.800"
            _hover={{ bg: 'blue.100' }}
            fontWeight={i18n.language === language.code ? 'bold' : 'normal'}
          >
            {language.flag} {language.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
