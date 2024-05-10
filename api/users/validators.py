import re
from django.core.exceptions import ValidationError
from django.utils.translation import ngettext, gettext as _


class PasswordCharacterValidator:
    def __init__(
            self,
            min_length_digit=1,
            min_length_alphanumeric=1,
            min_length_special=1,
            min_length_lower=1,
            min_length_upper=1,
            special_characters=r'[@$!%*?&#^()]'
    ):
        self.validation_rules = [
            ('digit', min_length_digit),
            ('alphanumeric_character', min_length_alphanumeric),
            ('special_character', min_length_special),
            ('lower_character', min_length_lower),
            ('upper_character', min_length_upper)
        ]
        self.special_characters = special_characters

    def validate(self, password, user=None):
        validation_errors = []
        for rule, min_length in self.validation_rules:
            if rule == 'special_character':
                regex_pattern = self.special_characters
            elif rule == 'alphanumeric_character':
                regex_pattern = r'[a-zA-Z0-9]'
            elif rule == 'lower_character':
                regex_pattern = r'[a-z]'
            elif rule == 'upper_character':
                regex_pattern = r'[A-Z]'
            elif rule == 'digit':
                regex_pattern = r'\d'
            else:
                regex_pattern = ''
            count = len(re.findall(regex_pattern, password))
            if count < min_length:
                validation_errors.append(ValidationError(
                    f'This password must contain at least {min_length} {rule.replace("_", " ")}.',
                    params={'min_length': min_length},
                    code=f'min_length_{rule}'
                ))
        if validation_errors:
            raise ValidationError(validation_errors)

    def get_help_text(self):
        validation_req = []
        for rule, min_length in self.validation_rules:
            if rule == 'special_character':
                rule_name = _('special character')
            else:
                rule_name = _(rule.replace('_', ' ') + ' letter')
            validation_req.append(ngettext(
                "%(min_length)s %(rule_name)s",
                "%(min_length)s %(rule_name_plural)s",
                min_length
            ) % {'min_length': min_length, 'rule_name': rule_name,
                 'rule_name_plural': _(rule.replace('_', ' ') + ' letters')})
        return _("This password must contain at least") + ' ' + ', '.join(validation_req) + '.'
