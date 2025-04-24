# SPDX-License-Identifier: MPL-2.0
# Copyright (C) 2021 - 2023 Gemeente Amsterdam
from signals.apps.email_integrations.translations import TranslationKey, translate
from signals.apps.email_integrations.actions.abstract import AbstractSignalStatusAction
from signals.apps.email_integrations.models import EmailTemplate
from signals.apps.email_integrations.rules import SignalScheduledRule
from signals.apps.email_integrations.rules.abstract import AbstractRule


class SignalScheduledAction(AbstractSignalStatusAction):
    rule: AbstractRule = SignalScheduledRule()

    key: str = EmailTemplate.SIGNAL_STATUS_CHANGED_INGEPLAND
    subject: str = translate(TranslationKey.email_changed_notification_message_template)
    note: str = translate(TranslationKey.email_scheduled_notification_message)
