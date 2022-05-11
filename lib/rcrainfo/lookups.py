# Choices presented by RCRAinfo and utility functions for easy access to values
STATUS = [
    ('notAssigned', 'Not Assigned'),
    ('Pending', 'Pending'),
    ('Scheduled', 'Scheduled'),
    ('InTransit', 'In Transit'),
    ('ReadyForSignature', 'Ready for Signature'),
    ('Signed', 'Signed'),
    ('Corrected', 'Corrected'),
    ('UnderCorrection', 'Under Correction'),
    ('MtnValidationFailed', 'MTN Validation Failed'),
]

SUB_TYPE = [
    ('FullElectronic', 'Full Electronic'),
    ('DataImage5Copy', 'Data + Image'),
    ('Hybrid', 'Hybrid'),
    ('Image', 'Image'),
]

ORIGIN_TYPE = [
    ('Web', 'Web'),
    ('Service', 'Service'),
    ('Mail', 'Mail'),
]

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

LOCKED_REASON = [
    ('AsyncSign', 'Asynchronous signature'),
    ('EpaChangeBiller', 'EPA change biller'),
    ('EpaCorrection', 'EPA corrections'),
]

COUNTRIES = [
    ('US', 'United States'),
    ('MX', 'Mexico'),
    ('CA', 'Canada'),
]

CONTAINERS = [
    ('BA', 'Burlap, cloth, paper, or plastic bags'),
    ('DT', 'Dump truck'),
    ('CF', 'Fiber or plastic boxes, cartons, cases'),
    ('DW', 'Wooden drums, barrels, kegs'),
    ('CM', 'Metal boxes, cartons, cases (including roll offs)'),
    ('HG', 'Hopper or gondola cars'),
    ('CW', 'Wooden boxes, cartons, cases'),
    ('TC', 'Tank cars'),
    ('CY', 'Cylinders'),
    ('TP', 'Portable tanks'),
    ('DF', 'Fiberboard or plastic drums, barrels, kegs'),
    ('TT', 'Cargo tanks (tank trucks)'),
    ('DM', 'Metal drums, barrels, kegs'),
]

UOM = [
    ('P', 'Pounds'),
    ('T', 'Tons (2000 Pounds)'),
    ('K', 'Kilograms'),
    ('M', 'Metric Tons (1000 Kilograms)'),
    ('G', 'Gallons'),
    ('L', 'Liters'),
    ('Y', 'Cubic Yards'),
    ('N', 'Cubic Meters'),
]


# for usage with the serializers
# The locality name is not required by RCRAinfo so we can return nothing if error
def get_state_name(code: str) -> str:
    try:
        for state in STATES:
            if state[0] == code:
                return str(state[1])
    except KeyError:
        pass


def get_country_name(code: str) -> str:
    try:
        for country in COUNTRIES:
            if country[0] == code:
                return str(country[1])
    except KeyError:
        pass
