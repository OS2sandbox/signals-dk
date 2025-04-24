# SPDX-License-Identifier: MPL-2.0
# Copyright (C) 2021 - 2023 Gemeente Amsterdam
from signals.apps.email_integrations.translations import TranslationKey, translate
from signals.apps.email_integrations.actions.abstract import AbstractSignalStatusAction
from signals.apps.email_integrations.models import EmailTemplate
from signals.apps.email_integrations.rules import SignalReactionRequestRule
from signals.apps.email_integrations.rules.abstract import AbstractRule
from signals.apps.email_integrations.utils import create_reaction_request_and_mail_context
from signals.apps.signals.models import Signal


class SignalReactionRequestAction(AbstractSignalStatusAction):
    rule: AbstractRule = SignalReactionRequestRule()

    key: str = EmailTemplate.SIGNAL_STATUS_CHANGED_REACTIE_GEVRAAGD
    subject: str = translate(TranslationKey.email_changed_notification_message_template)
    note: str = translate(TranslationKey.email_query_sent_message)

    def get_additional_context(self, signal: Signal, dry_run: bool = False) -> dict:
        return create_reaction_request_and_mail_context(signal, dry_run)
