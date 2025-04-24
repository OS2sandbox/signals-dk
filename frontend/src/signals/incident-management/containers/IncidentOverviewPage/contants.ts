import i18n from 'i18n'
import configuration from 'shared/services/configuration/configuration'

export enum SortOptions {
  ADDRESS_ASC = 'address',
  ADDRESS_DESC = '-address',
  ASSIGNED_USER_EMAIL_ASC = 'assigned_user_email',
  ASSIGNED_USER_EMAIL_DESC = '-assigned_user_email',
  BUROUGH_ASC = 'stadsdeel',
  BUROUGH_DESC = '-stadsdeel',
  ID_ASC = 'id',
  ID_DESC = '-id',
  DISTRICT_ASC = 'area_name',
  DISTRICT_DESC = '-area_name',
  CREATED_AT_ASC = 'created_at',
  CREATED_AT_DESC = '-created_at',
  PRIORITY_ASC = 'priority',
  PRIORITY_DESC = '-priority',
  STATUS_ASC = 'status',
  STATUS_DESC = '-status',
  SUBCATEGORY_ASC = 'sub_category',
  SUBCATEGORY_DESC = '-sub_category',
}

export enum SortOptionKeys {
  ADDRESS = 'adres',
  DATE = 'datum',
  ID = 'id',
  BUROUGH = 'stadsdeel',
  DISTRICT = 'area_name',
  STATUS = 'status',
  SUBCATEGORY = 'subcategorie',
  PRIORITY = 'urgentie',
  ASSIGNED_USER_EMAIL = 'toegewezen_aan',
}

export const SortOptionLabels = {
  ADDRESS: i18n.t('Adres'),
  DISTRICT: i18n.t('wijk'),
  DATE: i18n.t('datum'),
  ID: i18n.t('id'),
  BUROUGH: i18n.t('stadsdeel'),
  STATUS: i18n.t('status'),
  SUBCATEGORY: i18n.t('subcategorie'),
  PRIORITY: i18n.t('urgentie'),
  ASSIGNED_USER_EMAIL: i18n.t('toegewezen-aan'),
} as const;

export type SortOption = {
  label: string
  asc: SortOptions
  desc: SortOptions
  asc_label: string
  desc_label: string
}

export const sortOptionsList: SortOption[] = [
  {
    label: SortOptionLabels.ASSIGNED_USER_EMAIL,
    asc: SortOptions.ASSIGNED_USER_EMAIL_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.ASSIGNED_USER_EMAIL_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.ADDRESS,
    asc: SortOptions.ADDRESS_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.ADDRESS_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.DATE,
    asc: SortOptions.CREATED_AT_ASC,
    asc_label: '(' + i18n.t('oud-nieuw') + ')',
    desc: SortOptions.CREATED_AT_DESC,
    desc_label: '(' + i18n.t('nieuw-oud') + ')',
  },
  {
    label: SortOptionLabels.ID,
    asc: SortOptions.ID_ASC,
    asc_label: '(' + i18n.t('laag-hoog') + ')',
    desc: SortOptions.ID_DESC,
    desc_label: '(' + i18n.t('hoog-laag') + ')',
  },
  {
    label: SortOptionLabels.BUROUGH,
    asc: SortOptions.BUROUGH_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.BUROUGH_DESC,
    desc_label: '(z-a)',
  },
  {
    label: configuration.language.district ?? SortOptionLabels.DISTRICT,
    asc: SortOptions.DISTRICT_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.DISTRICT_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.STATUS,
    asc: SortOptions.STATUS_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.STATUS_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.SUBCATEGORY,
    asc: SortOptions.SUBCATEGORY_ASC,
    asc_label: '(a-z)',
    desc: SortOptions.SUBCATEGORY_DESC,
    desc_label: '(z-a)',
  },
  {
    label: SortOptionLabels.PRIORITY,
    asc: SortOptions.PRIORITY_ASC,
    asc_label: '(' + i18n.t('hoog-laag-normaal') + ')',
    desc: SortOptions.PRIORITY_DESC,
    desc_label: '(' + i18n.t('normaal-laag-hoog') + ')',
  },
]
