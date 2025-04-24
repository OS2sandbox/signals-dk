# SPDX-License-Identifier: MPL-2.0
# Copyright (C) 2021 - 2023 Gemeente Amsterdam
from factory import Sequence
from factory.django import DjangoModelFactory
from .translations import translate, TranslationKey
from signals.apps.email_integrations.models import EmailTemplate


class EmailTemplateFactory(DjangoModelFactory):
    class Meta:
        model = EmailTemplate
        django_get_or_create = ('key',)
        skip_postgeneration_save = True

    key = EmailTemplate.SIGNAL_CREATED
    title = f'{translate(TranslationKey.email_title_prefix)} {{ signal_id }}'
    body = f'{translate(TranslationKey.email_body_prefix)} {{ formatted_signal_id }}!'
    created_by = Sequence(lambda n: 'admin-{}@example.com'.format(n))
