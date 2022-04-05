from django.db import models

STATES = [
    ('AK', 'Alaska'),
    ('AL', 'Alabama'),
    ('AP', 'Armed Forces Pacific'),
    ('AR', 'Arkansas'),
    ('AZ', 'Arizona'),
    ('CA', 'California'),
    ('CO', 'Colorado'),
    ('CT', 'Connecticut'),
    ('DC', 'Washington DC'),
    ('DE', 'Delaware'),
    ('FL', 'Florida'),
    ('GA', 'Georgia'),
    ('GU', 'Guam'),
    ('HI', 'Hawaii'),
    ('IA', 'Iowa'),
    ('ID', 'Idaho'),
    ('IL', 'Illinois'),
    ('IN', 'Indiana'),
    ('KS', 'Kansas'),
    ('KY', 'Kentucky'),
    ('LA', 'Louisiana'),
    ('MA', 'Massachusetts'),
    ('MD', 'Maryland'),
    ('ME', 'Maine'),
    ('MI', 'Michigan'),
    ('MN', 'Minnesota'),
    ('MO', 'Missouri'),
    ('MS', 'Mississippi'),
    ('MT', 'Montana'),
    ('NC', 'North Carolina'),
    ('ND', 'North Dakota'),
    ('NE', 'Nebraska'),
    ('NH', 'New Hampshire'),
    ('NJ', 'New Jersey'),
    ('NM', 'New Mexico'),
    ('NV', 'Nevada'),
    ('NY', 'New York'),
    ('OH', 'Ohio'),
    ('OK', 'Oklahoma'),
    ('OR', 'Oregon'),
    ('PA', 'Pennsylvania'),
    ('PR', 'Puerto Rico'),
    ('RI', 'Rhode Island'),
    ('SC', 'South Carolina'),
    ('SD', 'South Dakota'),
    ('TN', 'Tennessee'),
    ('TX', 'Texas'),
    ('UT', 'Utah'),
    ('VA', 'Virginia'),
    ('VI', 'Virgin Islands'),
    ('VT', 'Vermont'),
    ('WA', 'Washington'),
    ('WI', 'Wisconsin'),
    ('WV', 'West Virginia'),
    ('WY', 'Wyoming'),
    ('XA', 'REGION 01 PURVIEW'),
    ('XB', 'REGION 02 PURVIEW'),
    ('XC', 'REGION 03 PURVIEW'),
    ('XD', 'REGION 04 PURVIEW'),
    ('XE', 'REGION 05 PURVIEW'),
    ('XF', 'REGION 06 PURVIEW'),
    ('XG', 'REGION 07 PURVIEW'),
    ('XH', 'REGION 08 PURVIEW'),
    ('XI', 'REGION 09 PURVIEW'),
    ('XJ', 'REGION 10 PURVIEW'),
]

SITE_TYPE = [
    ('GEN', 'Generator'),
    ('TRAN', 'Transporter'),
    ('TSD', 'Receiving Facility'),
]

GEN_STATUS = [
    ('SQG', 'SQG'),
    ('LQG', 'LQG'),
    ('VSQG', 'VSQG'),
]


class EpaSite(models.Model):
    epa_id = models.CharField(max_length=32)
    epa_name = models.CharField(max_length=200, null=True)
    modified = models.BooleanField(null=True)
    has_site_id = models.BooleanField(null=True)
    registered = models.BooleanField(null=True)
    mailing_address = models.ForeignKey('Address', related_name='mailing_address', on_delete=models.CASCADE)
    site_address = models.ForeignKey('Address', related_name='site_address', on_delete=models.CASCADE)
    gis_primary = models.BooleanField(default=False)
    can_esign = models.BooleanField(default=False)
    limited_esign = models.BooleanField(default=True)
    has_emanifest_user = models.BooleanField(default=False)
    site_type = models.CharField(max_length=32, choices=SITE_TYPE, default='GEN')
    federal_generator_status = models.CharField(max_length=32, choices=GEN_STATUS, null=True, default=None)

    def __str__(self):
        return self.epa_id


class Address(models.Model):
    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200, default=None, blank=True)
    city = models.CharField(max_length=200)
    zip_code = models.CharField(max_length=32)
    # state_code = models.CharField(max_length=32)
    state_name = models.CharField(max_length=32, choices=STATES)

    def __str__(self):
        return self.address1
