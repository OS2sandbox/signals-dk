# SPDX-License-Identifier: MPL-2.0
# Copyright (C) 2022 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
from signals.apps.email_integrations.translations import TranslationKey, translate
from signals.apps.email_integrations.actions.abstract import AbstractSignalStatusAction
from signals.apps.email_integrations.models import EmailTemplate
from signals.apps.email_integrations.rules import ForwardToExternalRule
from signals.apps.email_integrations.rules.abstract import AbstractRule
from signals.apps.email_integrations.utils import create_forward_to_external_and_mail_context
from signals.apps.signals.models import Signal


class SignalForwardToExternalAction(AbstractSignalStatusAction):
    rule: AbstractRule = ForwardToExternalRule()
    key: str = EmailTemplate.SIGNAL_STATUS_CHANGED_FORWARD_TO_EXTERNAL
    subject: str = translate(TranslationKey.email_signal_processing_request_format)

    fallback_txt_template: str = 'email/signal_forward_to_external.txt'
    fallback_html_template: str = 'email/signal_forward_to_external.html'

    note: str = translate(TranslationKey.email_automated_email_notification)

    def get_additional_context(self, signal: Signal, dry_run: bool = False) -> dict:
        return create_forward_to_external_and_mail_context(signal, dry_run)

    def get_recipient_list(self, signal: Signal) -> list[str]:
        assert signal.status is not None
        assert signal.status.email_override is not None

        return [signal.status.email_override]
