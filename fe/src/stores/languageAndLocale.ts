import { defineStore } from 'pinia';
import { enUS, itIT, dateEnUS, dateItIT } from 'naive-ui';

/*bisogna fare un if per ciascuna lingua perchè all'interno dei vari locale
 di naive ui ci sono anche funzioni, che non si possono convertire in stringa
 e salvare nel localstorage :(*/
export const useLanguageAndLocaleStore = defineStore('language', {
    getters: {
        LanguageAndLocale() {
            var language = localStorage.getItem("language");
            if (language) {
                if (language == 'en')
                    return {
                        language: language,
                        locale: enUS,
                        dateLocale: dateEnUS
                    };
                else if (language == 'it')
                    return {
                        language: language,
                        locale: itIT,
                        dateLocale: dateItIT
                    };
            }
            //valore di default � inglese
            return {
                language: 'en',
                locale: enUS,
                dateLocale: dateEnUS
            };
        }
    },
    actions: {
        setLanguage(languageKey: string) {
            localStorage.setItem("language", languageKey);
        },
        removeLanguage() {
            localStorage.removeItem("language");
        }
    }
});