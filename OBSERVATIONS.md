# STRONGMINDS observations

## General

- Ongoing (heavy) development going on simultaneously (eg frontend being revamped to a 'v2')
- MacOS preference for developers (Windows/WSL Ubuntu works as well) - problems were line endings, access rights and more

## Specific items

| Area | Title | Description |
|------------------|-----------------|-----------------|
| General    | Vulnerabilities    | Vulnerabilities in both frontend/backend packages    |
| Frontend   | Copy & paste components    | Eg `RadioInput` in both 'incident' and 'incident-management'    |
| Frontend   | Mix of JS & TS    | Eg Wizard step definitions in `/signals/incident/definitions/`    |
| Frontend   | Dutch language in code    | Eg Wizard step definitions    |
| Frontend   | Language responsibilities in configuration    | `app.base.json` file has "language" section that to some extent belongs in i18next context   |
| Frontend   | Special strings for mobile | Mobile edition uses its own string in some cases (eg `DetailPanel.tsx`) |
| Frontend   | Unit tests against hardcoded texts | As opposed to using `data-` attributes for searching DOM elements (eg `GlobalError.test.js`) | 
| Frontend   | Hardcoded subcategories | Eg `wizard-step-2-vulaan.js` and `wizrd-step-4-summary.js` contains categories matched by (string) name |
| Frontend   | Use of npm packages with no support for i18n | Eg `@amsterdam/asc-ui` |
| Backend   | Filters saved by email | Filters are stored in the `signals_storedsignalfilter` table with an email identifier as opposed to an id |
| Backend   | Missing packages | The back requirements setup seems to be missing several key components, eg `GDAL` and `cairo` and more. Perhaps due to MacOS vs WSL differences? |
| Backend   | Not using i18n feature in Django, but hard coded string. | Example email templates |
| Backend   | Highly customized and hardcoded flows with dutch / Amsterdam specifics | Eg "KTO" in Email templates |
| Architecture | Business logic in frontend | Business logic stored in UI, eg. `frontend/src/signals/incident-management/definitions/index.js` |
| Architecture | Localization in database | Localization should be handled on the backend frontiers, in the application layer |

## Major changes

https://github.com/Strongminds/signals-dk/pull/3

- Introduced the usage of i18n Ally VS component for easing the translation process

https://github.com/Strongminds/signals-dk/pull/2

- i18next-parser vs enzyme versions of cheerio library locked to i18next-parser version
- `app.base.json` had language specifics fleshed out brute force (more work on this needed)

https://github.com/Strongminds/signals-dk/pull/1

- Added i18next and supporting libraries
- Rearranged incident definition code to be localizable
- backend/docker-compose.yml: Removed version
- backend/docker-compose/environments/.celery_beat: Added DATABASE enviroment variables

