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
            ('alphanumeric character', min_length_alphanumeric),
            ('special character', min_length_special),
            ('lower character', min_length_lower),
            ('upper character', min_length_upper)
        ]
        self.special_characters = special_characters

    def validate(self, password, user=None):
        validation_errors = []
        for rule, min_length in self.validation_rules:
            if rule == 'special character':
                char_set = self.special_characters
            elif rule == 'alphanumeric character':
                char_set = ''.join([chr(x) for x in range(123) if chr(x).isalpha() or chr(x).isdigit()])
            else:
                char_set = rule + 's' if rule != 'digit' else rule
            count = sum(1 for char in password if char in char_set)
            if count < min_length:
                validation_errors.append(ValidationError(
                    ngettext(
                        f'This password must contain at least %(min_length)d {rule}.',
                        f'This password must contain at least %(min_length)d {rule}s.',
                        min_length
                    ),
                    params={'min_length': min_length},
                    code=f'min_length_{rule}'
                ))
        if validation_errors:
            raise ValidationError(validation_errors)

    def get_help_text(self):
        validation_req = []
        for rule, min_length in self.validation_rules:
            if rule == 'special character':
                rule_name = _('special character')
            else:
                rule_name = _(rule + ' letter')
            validation_req.append(ngettext(
                "%(min_length)s %(rule_name)s",
                "%(min_length)s %(rule_name_plural)s",
                min_length
            ) % {'min_length': min_length, 'rule_name': rule_name, 'rule_name_plural': _(rule + ' letters')})
        return _("This password must contain at least") + ' ' + ', '.join(validation_req) + '.'
