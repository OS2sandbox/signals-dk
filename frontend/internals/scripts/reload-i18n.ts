// scripts/reload-i18n.ts
import i18n from '../../src/i18n'; // Adjust the path to your i18n.ts file

(async function reloadTranslations(): Promise<void> {
    try {
      console.log('Reloading translation resources...');
      const languages = ['da', 'en']; // Add other languages if necessary
      const namespaces = ['translations']; // Match your namespace configuration
      await i18n.reloadResources(languages, namespaces);
      console.log('Translations reloaded successfully.');
    } catch (error) {
      console.error('Error reloading translations:', error);
    }
  })();