from django.db import models

COUNTRIES = [
    ("US", "United States"),
    ("MX", "Mexico"),
    ("CA", "Canada"),
]

STATES = [
    ("AK", "Alaska"),
    ("AL", "Alabama"),
    ("AP", "Armed Forces Pacific"),
    ("AR", "Arkansas"),
    ("AZ", "Arizona"),
    ("CA", "California"),
    ("CO", "Colorado"),
    ("CT", "Connecticut"),
    ("DC", "Washington DC"),
    ("DE", "Delaware"),
    ("FL", "Florida"),
    ("GA", "Georgia"),
    ("GU", "Guam"),
    ("HI", "Hawaii"),
    ("IA", "Iowa"),
    ("ID", "Idaho"),
    ("IL", "Illinois"),
    ("IN", "Indiana"),
    ("KS", "Kansas"),
    ("KY", "Kentucky"),
    ("LA", "Louisiana"),
    ("MA", "Massachusetts"),
    ("MD", "Maryland"),
    ("ME", "Maine"),
    ("MI", "Michigan"),
    ("MN", "Minnesota"),
    ("MO", "Missouri"),
    ("MS", "Mississippi"),
    ("MT", "Montana"),
    ("NC", "North Carolina"),
    ("ND", "North Dakota"),
    ("NE", "Nebraska"),
    ("NH", "New Hampshire"),
    ("NJ", "New Jersey"),
    ("NM", "New Mexico"),
    ("NV", "Nevada"),
    ("NY", "New York"),
    ("OH", "Ohio"),
    ("OK", "Oklahoma"),
    ("OR", "Oregon"),
    ("PA", "Pennsylvania"),
    ("PR", "Puerto Rico"),
    ("RI", "Rhode Island"),
    ("SC", "South Carolina"),
    ("SD", "South Dakota"),
    ("TN", "Tennessee"),
    ("TX", "Texas"),
    ("UT", "Utah"),
    ("VA", "Virginia"),
    ("VI", "Virgin Islands"),
    ("VT", "Vermont"),
    ("WA", "Washington"),
    ("WI", "Wisconsin"),
    ("WV", "West Virginia"),
    ("WY", "Wyoming"),
    ("XA", "REGION 01 PURVIEW"),
    ("XB", "REGION 02 PURVIEW"),
    ("XC", "REGION 03 PURVIEW"),
    ("XD", "REGION 04 PURVIEW"),
    ("XE", "REGION 05 PURVIEW"),
    ("XF", "REGION 06 PURVIEW"),
    ("XG", "REGION 07 PURVIEW"),
    ("XH", "REGION 08 PURVIEW"),
    ("XI", "REGION 09 PURVIEW"),
    ("XJ", "REGION 10 PURVIEW"),
]


class Address(models.Model):
    """
    Used to capture RCRAInfo address instances (mail, site).
    """

    street_number = models.CharField(
        max_length=12,
        null=True,
        blank=True,
    )
    address1 = models.CharField(
        verbose_name="Address 1",
        max_length=50,
    )
    address2 = models.CharField(
        verbose_name="Address 2",
        max_length=50,
        default=None,
        null=True,
        blank=True,
    )
    city = models.CharField(
        max_length=25,
    )
    state = models.CharField(
        max_length=3,
        null=True,
        blank=True,
        choices=STATES,
    )
    country = models.CharField(
        max_length=3,
        null=True,
        blank=True,
        choices=COUNTRIES,
    )
    zip = models.CharField(
        null=True,
        blank=True,
        max_length=5,
    )

    def __str__(self):
        if self.street_number:
            return f"{self.street_number} {self.address1}"
        return f" {self.address1}"
