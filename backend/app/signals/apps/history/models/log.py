# SPDX-License-Identifier: MPL-2.0
# Copyright (C) 2021 - 2023 Gemeente Amsterdam
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from .translations import TranslationKey, translate
from signals.apps.questionnaires.models import Questionnaire
from signals.apps.signals.models.signal_departments import SignalDepartments
from signals.apps.signals.models.type import _history_translated_action
from signals.apps.signals.workflow import STATUS_CHOICES


class Log(models.Model):
    ACTION_UNKNOWN = 'UNKNOWN'
    ACTION_CREATE = 'CREATE'
    ACTION_UPDATE = 'UPDATE'
    ACTION_DELETE = 'DELETE'
    ACTION_RECEIVE = 'RECEIVE'
    ACTION_NOT_RECEIVED = 'NOT_RECEIVED'

    ACTION_CHOICES = (
        (ACTION_UNKNOWN, 'Unknown'),
        (ACTION_CREATE, 'Created'),
        (ACTION_UPDATE, 'Updated'),
        (ACTION_DELETE, 'Deleted'),
        (ACTION_RECEIVE, 'Received'),
        (ACTION_NOT_RECEIVED, 'Not received'),
    )

    content_type = models.ForeignKey(ContentType, on_delete=models.DO_NOTHING, related_name='+')
    object_pk = models.CharField(max_length=128, db_index=True)
    object = GenericForeignKey('content_type', 'object_pk')

    action = models.CharField(editable=False, max_length=20, choices=ACTION_CHOICES, default=ACTION_UNKNOWN)
    description = models.TextField(max_length=3000, null=True, blank=True)
    extra = models.TextField(max_length=255, null=True, blank=True)
    data = models.JSONField(null=True)

    created_by = models.EmailField(null=True, blank=True)
    created_at = models.DateTimeField(editable=False)

    # This is a reference to a specific Signal. It can be blank if the object does not have a relation to a Signal.
    #
    # We want this to be here so that for the Signal history endpoint we can easily select all history for that specific
    # Signal.
    #
    # When creating history log for any changes on a Signal make sure to use the SignalLogService. In the future more
    # LogService classes can and will be created to facilitate the history logging of other objects.
    _signal = models.ForeignKey('signals.Signal', on_delete=models.CASCADE, related_name='history_log',
                                blank=True, null=True)

    class Meta:
        ordering = ('-created_at', )
        indexes = [
            models.Index(fields=['content_type', 'object_pk', ])
        ]

    def __str__(self) -> str:
        representation = f'{self.action} on {self.content_type.name} #{self.object_pk}'
        if self._signal:
            representation = f'{representation}, on signal #{self._signal_id}'
        return representation

    # START - Backwards compatibility functions
    #
    # To keep the history endpoint intact the following functions are defined to mimic the history view in the database

    def translate_content_type(self, content_type_name) -> str:
        """
        Present for backwards compatibility
        """
        content_type_translations = {
            'category assignment': 'category_assignment',
            'service level objective': 'sla',
            'type': 'type_assignment',
            'signal user': 'user_assignment',
        }

        if content_type_name in content_type_translations:
            return content_type_translations[content_type_name]
        elif content_type_name == 'signal departments':
            assert self.object

            if self.object.relation_type == SignalDepartments.REL_ROUTING:
                content_type_name = 'routing_assignment'
            elif self.object.relation_type == SignalDepartments.REL_DIRECTING:
                content_type_name = 'directing_departments_assignment'

        return content_type_name

    @staticmethod
    def translate_what_to_action(what) -> str:
        """
        Present for backwards compatibility
        """
        return what[:what.find('_')]

    @staticmethod
    def translate_what_to_content_type(what) -> str:
        """
        Present for backwards compatibility
        """
        # Note: this should produce a content_type.model not .name
        translations = {
            'category_assignment': 'categoryassignment',
            'sla': 'servicelevelobjective',
            'type_assignment': 'type',
            'user_assignment': 'signaluser',
            'routing_assignment': 'signaldepartments',
            'directing_departments_assignment': 'signaldepartments',
        }

        content_type = what[what.find('_') + 1:].lower()
        if content_type in translations:
            content_type = translations[content_type]
        return content_type

    @property
    def identifier(self) -> str:
        """
        "identifier" in the style of the signals_history_view
        Present for backwards compatibility
        """
        return f'{self.what}_{self.object_pk}'

    @property
    def what(self) -> str:
        """
        "what" in the style of the signals_history_view
        Present for backwards compatibility
        """
        translated_content_type = self.translate_content_type(self.content_type.name)
        return f'{self.action}_{translated_content_type}'.upper()

    @property
    def who(self) -> str:
        """
        "who" in the style of the signals_history_view
        Present for backwards compatibility
        """
        return self.created_by or 'Signalen system'

    def get_action(self) -> str:  # noqa C901
        """
        "get_action" copied from History
        Present for backwards compatibility
        """
        action = translate(TranslationKey.log_unknown_action)
        what = self.what
        if what == 'UPDATE_STATUS':
            _status_choice = translate(TranslationKey.log_unknown)
            if self.extra:
                _status_choice = dict(STATUS_CHOICES).get(self.extra, TranslationKey.log_unknown)

            action = f'{translate(TranslationKey.log_status_choice)}: {_status_choice}'
        elif what == 'UPDATE_PRIORITY':
            _priority = TranslationKey.log_unknown
            if self.extra:
                _priority = {'high': translate(TranslationKey.log_priority_high), 'normal': translate(TranslationKey.log_priority_normal), 'low': translate(TranslationKey.log_priority_low)}.get(self.extra, translate(TranslationKey.log_unknown))
            action = f'{translate(TranslationKey.log_urgency_changed_to)}: {_priority}'
        elif what == 'UPDATE_CATEGORY_ASSIGNMENT':
            action = f'{translate(TranslationKey.log_category_changed_to)}: {self.extra}'
        elif what == 'UPDATE_LOCATION':
            action = translate(TranslationKey.log_location_changed_to)
        elif what == 'CREATE_NOTE':
            action = translate(TranslationKey.log_note_added)
        elif what == 'RECEIVE_FEEDBACK' or what == 'CREATE_FEEDBACK':
            action = translate(TranslationKey.log_feedback_from_reporter)
        elif what == 'UPDATE_TYPE_ASSIGNMENT':
            action = f'{translate(TranslationKey.log_type_changed_to)}: {_history_translated_action(self.extra)}'
        elif what == 'UPDATE_DIRECTING_DEPARTMENTS_ASSIGNMENT':
            action = f'{translate(TranslationKey.log_direction_changed_to)}: {self.extra or translate(TranslationKey.log_responsible_department)}'
        elif what == 'UPDATE_ROUTING_ASSIGNMENT':
            _route_assignment = self.extra or translate(TranslationKey.log_default_responsible_department)
            action = f'{translate(TranslationKey.log_routing_department_changed_to)}: {_route_assignment}'
        elif what == 'UPDATE_USER_ASSIGNMENT':
            if self.extra:
                action = f'{translate(TranslationKey.log_report_assignment_changed_to)}: {self.extra}'
            else:
                action = translate(TranslationKey.log_unassigned_report)
        elif what == 'CREATE_SIGNAL' and self.object_pk != self._signal_id:
            action = translate(TranslationKey.log_sub_report_added)
        elif what == 'UPDATE_SLA':
            action = translate(TranslationKey.log_service_commitment) + ':'
        elif what == 'RECEIVE_SESSION':
            assert self.object
            assert self.object.questionnaire

            if self.object.questionnaire.flow == Questionnaire.FORWARD_TO_EXTERNAL:
                action = translate(TranslationKey.log_received_explanation)
        elif what == 'NOT_RECEIVED_SESSION':
            assert self.object
            assert self.object.questionnaire

            if self.object.questionnaire.flow == Questionnaire.FORWARD_TO_EXTERNAL:
                action = translate(TranslationKey.log_no_explanation_received)
        elif what == 'UPDATE_REPORTER':
            action = translate(TranslationKey.log_reporter_contact_info) + ':'

        return action

    def get_description(self) -> str | None:
        """
        "get_description" copied from History
        Present for backwards compatibility
        """
        description = self.description
        what = self.what
        if what == 'UPDATE_LOCATION' or what == 'RECEIVE_FEEDBACK':
            assert self.object

            description = self.object.get_description()
        elif what == 'CHILD_SIGNAL_CREATED':
            description = f'Melding {self.extra}'
        elif what == 'UPDATE_SLA' and self.description is None:
            description = translate(TranslationKey.log_default_service_promise)

        return description

    # END - Backwards compatibility functions
