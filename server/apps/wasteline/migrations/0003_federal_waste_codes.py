from django.db import migrations

from apps.wasteline.models import WasteCode


def populate_federal_waste_codes(apps, schema_editor):
    federal_waste_codes = [
        {
            "code": "D001",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "IGNITABLE WASTE",
        },
        {
            "code": "D002",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "CORROSIVE WASTE",
        },
        {"code": "D003", "code_type": WasteCode.CodeType.FEDERAL, "description": "REACTIVE WASTE"},
        {"code": "D004", "code_type": WasteCode.CodeType.FEDERAL, "description": "ARSENIC"},
        {"code": "D005", "code_type": WasteCode.CodeType.FEDERAL, "description": "BARIUM"},
        {"code": "D006", "code_type": WasteCode.CodeType.FEDERAL, "description": "CADMIUM"},
        {"code": "D007", "code_type": WasteCode.CodeType.FEDERAL, "description": "CHROMIUM"},
        {"code": "D008", "code_type": WasteCode.CodeType.FEDERAL, "description": "LEAD"},
        {"code": "D009", "code_type": WasteCode.CodeType.FEDERAL, "description": "MERCURY"},
        {"code": "D010", "code_type": WasteCode.CodeType.FEDERAL, "description": "SELENIUM"},
        {"code": "D011", "code_type": WasteCode.CodeType.FEDERAL, "description": "SILVER"},
        {
            "code": "D012",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ENDRIN (1,2,3,4,10,10-HEXACHLORO-1,7-EPOXY-1,4,4A,5,6,7,8,8A-OCTAHYDRO-1,4-ENDO, ENDO-5,8-DIMETH-ANO-NAPHTHALENE)",
        },
        {
            "code": "D013",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "LINDANE (1,2,3,4,5,6-HEXA-CHLOROCYCLOHEXANE, GAMMA ISOMER)",
        },
        {
            "code": "D014",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "METHOXYCHLOR (1,1,1-TRICHLORO-2,2-BIS [P-METHOXYPHENYL] ETHANE)",
        },
        {
            "code": "D015",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "TOXAPHENE (C10 H10 CL8, TECHNICAL CHLORINATED CAMPHENE, 67-69 PERCENT CHLORINE)",
        },
        {
            "code": "D016",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2,4-D (2,4-DICHLOROPHENOXYACETIC ACID)",
        },
        {
            "code": "D017",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2,4,5-TP SILVEX (2,4,5-TRICHLOROPHENOXYPROPIONIC ACID)",
        },
        {"code": "D018", "code_type": WasteCode.CodeType.FEDERAL, "description": "BENZENE"},
        {
            "code": "D019",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "CARBON TETRACHLORIDE",
        },
        {"code": "D020", "code_type": WasteCode.CodeType.FEDERAL, "description": "CHLORDANE"},
        {"code": "D021", "code_type": WasteCode.CodeType.FEDERAL, "description": "CHLOROBENZENE"},
        {"code": "D022", "code_type": WasteCode.CodeType.FEDERAL, "description": "CHLOROFORM"},
        {"code": "D023", "code_type": WasteCode.CodeType.FEDERAL, "description": "O-CRESOL"},
        {"code": "D024", "code_type": WasteCode.CodeType.FEDERAL, "description": "M-CRESOL"},
        {"code": "D025", "code_type": WasteCode.CodeType.FEDERAL, "description": "P-CRESOL"},
        {"code": "D026", "code_type": WasteCode.CodeType.FEDERAL, "description": "CRESOL"},
        {
            "code": "D027",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "1,4-DICHLOROBENZENE",
        },
        {
            "code": "D028",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "1,2-DICHLOROETHANE",
        },
        {
            "code": "D029",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "1,1-DICHLOROETHYLENE",
        },
        {
            "code": "D030",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2,4-DINITROTOLUENE",
        },
        {
            "code": "D031",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEPTACHLOR (AND ITS EPOXIDE)",
        },
        {
            "code": "D032",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEXACHLOROBENZENE",
        },
        {
            "code": "D033",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEXACHLOROBUTADIENE",
        },
        {
            "code": "D034",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEXACHLOROETHANE",
        },
        {
            "code": "D035",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "METHYL ETHYL KETONE",
        },
        {"code": "D036", "code_type": WasteCode.CodeType.FEDERAL, "description": "NITROBENZENE"},
        {
            "code": "D037",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "PENTACHLOROPHENOL",
        },
        {"code": "D038", "code_type": WasteCode.CodeType.FEDERAL, "description": "PYRIDINE"},
        {
            "code": "D039",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "TETRACHLOROETHYLENE",
        },
        {
            "code": "D040",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "TRICHLORETHYLENE",
        },
        {
            "code": "D041",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2,4,5-TRICHLOROPHENOL",
        },
        {
            "code": "D042",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2,4,6-TRICHLOROPHENOL",
        },
        {"code": "D043", "code_type": WasteCode.CodeType.FEDERAL, "description": "VINYL CHLORIDE"},
        {
            "code": "F001",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "THE FOLLOWING SPENT HALOGENATED SOLVENTS USED IN DEGREASING: TETRACHLOROETHYLENE, TRICHLORETHYLENE, METHYLENE CHLORIDE, 1,1,1-TRICHLOROETHANE, CARBON TETRACHLORIDE AND CHLORINATED FLUOROCARBONS; ALL SPENT SOLVENT MIXTURES/BLENDS USED IN DEGREASING CONTAINING, BEFORE USE, A TOTAL OF TEN PERCENT OR MORE (BY VOLUME) OF ONE OR MORE OF THE ABOVE HALOGENATED SOLVENTS OR THOSE SOLVENTS LISTED IN F002, F004, AND F005; AND STILL BOTTOMS FROM THE RECOVERY OF THESE SPENT SOLVENTS AND SPENT SOLVENT MIXTURES.",
        },
        {
            "code": "F002",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "THE FOLLOWING SPENT HALOGENATED SOLVENTS: TETRACHLOROETHYLENE, METHYLENE CHLORIDE, TRICHLOROETHYLENE, 1,1,1-TRICHLOROETHANE, CHLOROBENZENE, 1,1,2-TRICHLORO-1,2,2-TRIFLUOROETHANE, ORTHO-DICHLOROBENZENE, TRICHLOROFLUOROMETHANE, AND 1,1,2, TRICHLOROETHANE; ALL SPENT SOLVENT MIXTURES/BLENDS CONTAINING, BEFORE USE, A TOTAL OF TEN PERCENT OR MORE (BY VOLUME) OF ONE OR MORE OF THE ABOVE HALOGENATED SOLVENTS OR THOSE SOLVENTS LISTED IN F001, F004, AND F005; AND STILL BOTTOMS FROM THE RECOVERY OF THESE SPENT SOLVENTS AND SPENT SOLVENT MIXTURES.",
        },
        {
            "code": "F003",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "THE FOLLOWING SPENT NONHALOGENATED SOLVENTS: XYLENE, ACETONE, ETHYL ACETATE, ETHYL BENZENE, ETHYL ETHER, METHYL ISOBUTYL KETONE, N-BUTYL ALCOHOL, CYCLOHEXANONE, AND METHANOL; ALL SPENT SOLVENT MIXTURES/BLENDS CONTAINING, BEFORE USE, ONLY THE ABOVE SPENT NONHALOGENATED SOLVENTS; AND ALL SPENT SOLVENT MIXTURES/BLENDS CONTAINING, BEFORE USE, ONE OR MORE OF THE ABOVE NONHALOGENATED SOLVENTS, AND A TOTAL OF TEN PERCENT OR MORE (BY VOLUME) OF ONE OR MORE OF THOSE SOLVENTS LISTED IN F001, F002, F004, AND F005; AND STILL BOTTOMS FROM THE RECOVERY OF THESE SPENT SOLVENTS AND SPENT SOLVENT MIXTURES.",
        },
        {
            "code": "F004",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "THE FOLLOWING SPENT NONHALOGENATED SOLVENTS: CRESOLS, CRESYLIC ACID, AND NITROBENZENE; AND THE STILL BOTTOMS FROM THE RECOVERY OF THESE SOLVENTS; ALL SPENT SOLVENT MIXTURES/BLENDS CONTAINING, BEFORE USE, A TOTAL OF TEN PERCENT OR MORE (BY VOLUME) OF ONE OR MORE OF THE ABOVE NONHALOGENATED SOLVENTS OR THOSE SOLVENTS LISTED IN F001, F002, AND F005; AND STILL BOTTOMS FROM THE RECOVERY OF THESE SPENT SOLVENTS AND SPENT SOLVENT MIXTURES.",
        },
        {
            "code": "F005",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "THE FOLLOWING SPENT NONHALOGENATED SOLVENTS: TOLUENE, METHYL ETHYL KETONE, CARBON DISULFIDE, ISOBUTANOL, PYRIDINE, BENZENE, 2-ETHOXYETHANOL, AND 2-NITROPROPANE; ALL SPENT SOLVENT MIXTURES/BLENDS CONTAINING, BEFORE USE, A TOTAL OF TEN PERCENT OR MORE (BY VOLUME) OF ONE OR MORE OF THE ABOVE NONHALOGENATED SOLVENTS OR THOSE SOLVENTS LISTED IN F001, F002, OR F004; AND STILL BOTTOMS FROM THE RECOVERY OF THESE SPENT SOLVENTS AND SPENT SOLVENT MIXTURES.",
        },
        {
            "code": "F006",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATER TREATMENT SLUDGES FROM ELECTROPLATING OPERATIONS, EXCEPT FROM THE FOLLOWING PROCESSES: (1) SULFURIC ACID ANODIZING OF ALUMINUM; (2) TIN PLATING ON CARBON STEEL; (3) ZINC PLATING (SEGREGATED BASIS) ON CARBON STEEL; (4) ALUMINUM OR ZINC-ALUMINUM PLATING ON CARBON STEEL; (5) CLEANING/STRIPPING ASSOCIATED WITH TIN, ZINC, AND ALUMINUM PLATING ON CARBON STEEL; AND (6) CHEMICAL ETCHING AND MILLING OF ALUMINUM.",
        },
        {
            "code": "F007",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "SPENT CYANIDE PLATING BATH SOLUTIONS FROM ELECTROPLATING OPERATIONS.",
        },
        {
            "code": "F008",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "PLATING BATH RESIDUES FROM THE BOTTOM OF PLATING BATHS FROM ELECTROPLATING OPERATIONS IN WHICH CYANIDES ARE USED IN THE PROCESS.",
        },
        {
            "code": "F009",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "SPENT STRIPPING AND CLEANING BATH SOLUTIONS FROM ELECTROPLATING OPERATIONS IN WHICH CYANIDES ARE USED IN THE PROCESS.",
        },
        {
            "code": "F010",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "QUENCHING BATH RESIDUES FROM OIL BATHS FROM METAL HEAT TREATING OPERATIONS IN WHICH CYANIDES ARE USED IN THE PROCESS.",
        },
        {
            "code": "F011",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "SPENT CYANIDE SOLUTIONS FROM SLAT BATH POT CLEANING FROM METAL HEAT TREATING OPERATIONS.",
        },
        {
            "code": "F012",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "QUENCHING WASTEWATER TREATMENT SLUDGES FROM METAL HEAT TREATING OPERATIONS IN WHICH CYANIDES ARE USED IN THE PROCESS.",
        },
        {
            "code": "F019",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATER TREATMENT SLUDGES FROM THE CHEMICAL CONVERSION COATING OF ALUMINUM, EXCEPT FROM ZIRCONIUM PHOSPHATING IN ALUMINUM CAN WASHING WHEN SUCH PHOSPHATING IS AN EXCLUSIVE CONVERSION COATING PROCESS.",
        },
        {
            "code": "F020",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTES (EXCEPT WASTEWATER AND SPENT CARBON FROM HYDROGEN CHLORIDE PURIFICATION) FROM THE PRODUCTION OR MANUFACTURING USE (AS A REACTANT, CHEMICAL INTERMEDIATE, OR COMPONENT IN A FORMULATING PROCESS) OF TRI- OR TETRACHLOROPHENOL OR OF INTERMEDIATES USED TO PRODUCE THEIR PESTICIDE DERIVATIVES.  (THIS LISTING DOES NOT INCLUDE WASTES FROM THE PRODUCTION OF HEXACHLOROPHENE FROM HIGHLY PURIFIED 2,4,5-TRICHLOROPHENOL.)",
        },
        {
            "code": "F021",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTES (EXCEPT WASTEWATER AND SPENT CARBON FROM HYDROGEN CHLORIDE PURIFICATION) FROM THE PRODUCTION OR MANUFACTURING USE (AS A REACTANT, CHEMICAL INTERMEDIATE, OR COMPONENT IN A FORMULATING PROCESS) OF PENTACHLOROPHENOL, OR OF INTERMEDIATES USED TO PRODUCE DERIVATIVES.",
        },
        {
            "code": "F022",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTES (EXCEPT WASTEWATER AND SPENT CARBON FROM HYDROGEN CHLORIDE PURIFICATION) FROM THE MANUFACTURING USE (AS A REACTANT, CHEMICAL INTERMEDIATE, OR COMPONENT IN A FORMULATING PROCESS) OF TETRA-, PENTA-, OR HEXACHLOROBENZENES UNDER ALKALINE CONDITIONS.",
        },
        {
            "code": "F023",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTES (EXCEPT WASTEWATER AND SPENT CARBON FROM HYDROGEN CHLORIDE PURIFICATION) FROM THE PRODUCTION OF MATERIALS ON EQUIPMENT PREVIOUSLY USED FOR THE PRODUCTION OR MANUFACTURING USE (AS A REACTANT, CHEMICAL INTERMEDIATE, OR COMPONENT IN A FORMULATING PROCESS) OF TRI- AND TETRACHLOROPHENOLS.  (THIS LISTING DOES NOT INCLUDE WASTES FROM EQUIPMENT USED ONLY FOR THE PRODUCTION OR USE OF HEXACHLOROPHENE FROM HIGHLY PURIFIED 2,4,5-TRICHLOROPHENOL.)",
        },
        {
            "code": "F024",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "PROCESS WASTES INCLUDING, BUT NOT LIMITED TO, DISTILLATION RESIDUES, HEAVY ENDS, TARS, AND REACTOR CLEAN-OUT WASTES FROM THE PRODUCTION OF CERTAIN CHLORINATED ALIPHATIC HYDROCARBONS BY FREE RADICAL CATALYZED PROCESSES.  THESE CHLORINATED ALIPHATIC HYDROCARBONS ARE THOSE HAVING CARBON CHAIN LENGTHS RANGING FROM ONE TO, AND INCLUDING FIVE, WITH VARYING AMOUNTS AND POSITIONS OF CHLORINE SUBSTITUTION.  (THIS LISTING DOES NOT INCLUDE WASTEWATERS, WASTEWATER TREATMENT SLUDGE, SPENT CATALYSTS, AND WASTES LISTED IN SECTIONS 261.31. OR 261.32)",
        },
        {
            "code": "F025",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "CONDENSED LIGHT ENDS, SPENT FILTERS AND FILTER AIDS, AND SPENT DESICCANT WASTES FROM THE PRODUCTION OF CERTAIN CHLORINATED ALIPHATIC HYDROCARBONS BY FREE RADICAL CATALYZED PROCESSES.  THESE CHLORINATED ALIPHATIC HYDROCARBONS ARE THOSE HAVING CARBON CHAIN LENGTHS RANGING FROM ONE TO, AND INCLUDING FIVE, WITH VARYING AMOUNTS AND POSITIONS OF CHLORINE SUBSTITUTION.",
        },
        {
            "code": "F026",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTES (EXCEPT WASTEWATER AND SPENT CARBON FROM HYDROGEN CHLORIDE PURIFICATION) FROM THE PRODUCTION OF MATERIALS ON EQUIPMENT PREVIOUSLY USED FOR THE MANUFACTURING USE (AS A REACTANT, CHEMICAL INTERMEDIATE, OR COMPONENT IN A FORMULATING PROCESS) OF TETRA-, PENTA-, OR HEXACHLOROBENZENE UNDER ALKALINE CONDITIONS.",
        },
        {
            "code": "F027",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DISCARDED UNUSED FORMULATIONS CONTAINING TRI-, TETRA-, OR PENTACHLOROPHENOL OR DISCARDED UNUSED FORMULATIONS CONTAINING COMPOUNDS DERIVED FROM THESE CHLOROPHENOLS.  (THIS LISTING DOES NOT INCLUDE FORMULATIONS CONTAINING HEXACHLOROPHENE SYNTHESIZED FROM PREPURIFIED 2,4,5-TRICHLOROPHENOL AS THE SOLE COMPONENT.)",
        },
        {
            "code": "F028",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "RESIDUES RESULTING FROM THE INCINERATION OR THERMAL TREATMENT OF SOIL CONTAMINATED WITH EPA HAZARDOUS WASTE NOS. F020, F021, F022, F023, F026, AND F027.",
        },
        {
            "code": "F032",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATERS, PROCESS RESIDUALS, PRESERVATIVE DRIPPAGE, AND SPENT FORMULATIONS FROM WOOD PRESERVING PROCESSES GENERATED AT PLANTS THAT CURRENTLY USE, OR HAVE PREVIOUSLY USED, CHLOROPHENOLIC FORMULATIONS [EXCEPT POTENTIALLY CROSS-CONTAMINATED WASTES THAT HAVE HAD THE F032 WASTE CODE DELETED IN ACCORDANCE WITH SECTION 261.35 (I.E., THE NEWLY PROMULGATED EQUIPMENT CLEANING OR REPLACEMENT STANDARDS), AND WHERE THE GENERATOR DOES NOT RESUME OR INITIATE USE OF CHLOROPHENOLIC FORMULATIONS].  (THIS LISTING DOES NOT INCLUDE K001 BOTTOM SEDIMENT SLUDGE FROM THE TREATMENT OF WASTEWATER FROM WOOD PRESERVING PROCESSES THAT USE CREOSOTE AND/OR PENTACHLOROPHENOL.)",
        },
        {
            "code": "F034",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATERS, PROCESS RESIDUALS, PRESERVATIVE DRIPPAGE, AND SPENT FORMULATIONS FROM WOOD PRESERVING PROCESSES GENERATED AT PLANTS THAT USE CREOSOTE FORMULATIONS.  THIS LISTING DOES NOT INCLUDE K001 BOTTOM SEDIMENT SLUDGE FROM THE TREATMENT OF WASTEWATER FROM WOOD PRESERVING PROCESSES THAT USE CREOSOTE AND/OR PENTACHLOROPHENOL.",
        },
        {
            "code": "F035",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATERS, PROCESS RESIDUALS, PRESERVATIVE DRIPPAGE, AND SPENT FORMULATIONS FROM WOOD PRESERVING PROCESSES GENERATED AT PLANTS THAT USE INORGANIC PRESERVATIVES CONTAINING ARSENIC OR CHROMIUM.  THIS LISTING DOES NOT INCLUDE K001 BOTTOM SEDIMENT SLUDGE FROM THE TREATMENT OF WASTEWATER FROM WOOD PRESERVING PROCESSES THAT USE CREOSOTE AND/OR PENTACHLOROPHENOL.",
        },
        {
            "code": "F037",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "PETROLEUM REFINERY PRIMARY OIL/WATER/SOLIDS SEPARATION SLUDGE - ANY SLUDGE GENERATED FROM THE GRAVITATIONAL SEPARATION OF OIL/WATER/SOLIDS DURING THE STORAGE OR TREATMENT OF PROCESS WASTEWATERS AND OILY COOLING WASTEWATERS FROM PETROLEUM REFINERIES.  SUCH SLUDGES INCLUDE, BUT ARE NOT LIMITED TO, THOSE GENERATED IN OIL/WATER/SOLIDS SEPARATORS; TANKS AND IMPOUNDMENTS; DITCHES AND OTHER CONVEYANCES; SUMPS; AND STORM WATER UNITS RECEIVING DRY WEATHER FLOW.  SLUDGES GENERATED IN STORM WATER UNITS THAT DO NOT RECEIVE DRY WEATHER FLOW, SLUDGES GENERATED IN AGGRESSIVE BIOLOGICAL TREATMENT UNITS AS DEFINED IN SECTION 261.31(B)(2) (INCLUDING SLUDGES GENERATED IN ONE OR MORE ADDITIONAL UNITS AFTER WASTEWATERS HAVE BEEN TREATED IN AGGRESSIVE BIOLOGICAL TREATMENT UNITS), AND K051 WASTES ARE EXEMPTED FROM THIS LISTING.",
        },
        {
            "code": "F038",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "PETROLEUM REFINERY SECONDARY (EMULSIFIED) OIL/WATER/SOLIDS SEPARATION SLUDGE - ANY SLUDGE AND/OR FLOAT GENERATED FROM THE PHYSICAL AND/OR CHEMICAL SEPARATION OF OIL/WATER/SOLIDS IN PROCESS WASTEWATERS AND OILY COOLING WASTEWATERS FROM PETROLEUM REFINERIES.  SUCH WASTES INCLUDE, BUT ARE NOT LIMITED TO, ALL SLUDGES AND FLOATS GENERATED IN INDUCED AIR FLOTATION (IAF) UNITS, TANKS AND IMPOUNDMENTS, AND ALL SLUDGES GENERATED IN DAF UNITS.  SLUDGES GENERATED IN STORMWATER UNITS THAT DO NOT RECEIVE DRY WEATHER FLOW, SLUDGES GENERATED IN AGGRESSIVE BIOLOGICAL TREATMENT UNITS AS DEFINED IN SECTION 261.31(B)(2) (INCLUDING SLUDGES GENERATED IN ONE OR MORE ADDITIONAL UNITS AFTER WASTEWATERS HAVE BEEN TREATED IN AGGRESSIVE BIOLOGICAL TREATMENT UNITS), AND F037, K048, AND K051 WASTES ARE EXEMPTED FROM THIS LISTING.",
        },
        {
            "code": "F039",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "LEACHATE RESULTING FROM THE TREATMENT, STORAGE, OR DISPOSAL OF WASTES CLASSIFIED BY MORE THAN ONE WASTE CODE UNDER SUBPART D, OR FROM A MIXTURE OF WASTES CLASSIFIED UNDER SUBPARTS C AND D OF THIS PART.  (LEACHATE RESULTING FROM THE MANAGEMENT OF ONE OR MORE OF THE FOLLOWING EPA HAZARDOUS WASTES AND NO OTHER HAZARDOUS WASTES RETAINS ITS HAZARDOUS WASTE CODE(S): F020, F021, F022, F023, F026, F027, AND/OR F028.)",
        },
        {
            "code": "K001",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BOTTOM SEDIMENT SLUDGE FROM THE TREATMENT OF WASTEWATERS FROM WOOD PRESERVING PROCESSES THAT USE CREOSOTE AND/OR PENTACHLOROPHENOL.",
        },
        {
            "code": "K002",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATER TREATMENT SLUDGE FROM THE PRODUCTION OF CHROME YELLOW AND ORANGE PIGMENTS.",
        },
        {
            "code": "K003",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATER TREATMENT SLUDGE FROM THE PRODUCTION OF MOLYBDATE ORANGE PIGMENTS.",
        },
        {
            "code": "K004",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATER TREATMENT SLUDGE FROM THE PRODUCTION OF ZINC YELLOW PIGMENTS.",
        },
        {
            "code": "K005",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATER TREATMENT SLUDGE FROM THE PRODUCTION OF CHROME GREEN PIGMENTS.",
        },
        {
            "code": "K006",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATER TREATMENT SLUDGE FROM THE PRODUCTION OF CHROME OXIDE GREEN PIGMENTS (ANHYDROUS AND HYDRATED).",
        },
        {
            "code": "K007",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "WASTEWATER TREATMENT SLUDGE FROM THE PRODUCTION OF IRON BLUE PIGMENTS.",
        },
        {
            "code": "K008",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "OVEN RESIDUE FROM THE PRODUCTION OF CHROME OXIDE GREEN PIGMENTS.",
        },
        {
            "code": "K009",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DISTILLATION BOTTOMS FROM THE PRODUCTION OF ACETALDEHYDE FROM ETHYLENE.",
        },
        {
            "code": "K010",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DISTILLATION SIDE CUTS FROM THE PRODUCTION OF ACETALDEHYDE FROM ETHYLENE.",
        },
        {
            "code": "K011",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BOTTOM STREAM FROM THE WASTEWATER STRIPPER IN THE PRODUCTION OF ACRYLONITRILE.",
        },
        {
            "code": "K013",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BOTTOM STREAM FROM THE ACETONITRILE COLUMN IN THE PRODUCTION OF ACRYLONITRILE.",
        },
        {
            "code": "K014",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BOTTOMS FROM THE ACETONITRILE PURIFICATION COLUMN IN THE PRODUCTION OF ACRYLONITRILE.",
        },
        {
            "code": "K015",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "STILL BOTTOMS FROM THE DISTILLATION OF BENZYL CHLORIDE.",
        },
        {
            "code": "K016",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEAVY ENDS OR DISTILLATION RESIDUES FROM THE PRODUCTION OF CARBON TETRACHLORIDE.",
        },
        {
            "code": "K017",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEAVY ENDS (STILL BOTTOMS) FROM THE PURIFICATION COLUMN IN THE PRODUCTION OF EPICHLOROHYDRIN.",
        },
        {
            "code": "K018",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEAVY ENDS FROM THE FRACTIONATION COLUMN IN ETHYL CHLORIDE PRODUCTION.",
        },
        {
            "code": "K019",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEAVY ENDS FROM THE DISTILLATION OF ETHYLENE DICHLORIDE IN ETHYLENE DICHLORIDE PRODUCTION.",
        },
        {
            "code": "K020",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HEAVY ENDS FROM THE DISTILLATION OF VINYL CHLORIDE IN VINYL CHLORIDE MONOMER PRODUCTION.",
        },
        {
            "code": "K021",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "AQUEOUS SPENT ANTIMONY CATALYST WASTE FROM FLUOROMETHANE PRODUCTION.",
        },
        {
            "code": "K022",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DISTILLATION BOTTOM TARS FROM THE PRODUCTION OF PHENOL/ACETONE FROM CUMENE.",
        },
        {
            "code": "K023",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DISTILLATION LIGHT ENDS FROM THE PRODUCTION OF PHTHALIC ANHYDRIDE FROM NAPHTHALENE.",
        },
        {
            "code": "K024",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DISTILLATION BOTTOMS FROM THE PRODUCTION OF PHTHALIC ANHYDRIDE FROM NAPHTHALENE.",
        },
        {
            "code": "K025",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DISTILLATION BOTTOMS FROM THE PRODUCTION OF NITROBENZENE BY THE NITRATION OF BENZENE.",
        },
        {"code": "LABP", "code_type": WasteCode.CodeType.FEDERAL, "description": "LAB PACK"},
        {
            "code": "P001",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2H-1-BENZOPYRAN-2-ONE, 4-HYDROXY-3-(3-OXO-1-PHENYLBUTYL)-, & SALTS, WHEN PRESENT AT CONCENTRATIONS GREATER THAN 0.3% (OR) WARFARIN, & SALTS, WHEN PRESENT AT CONCENTRATIONS GREATER THAN 0.3%",
        },
        {
            "code": "P002",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "1-ACETYL-2-THIOUREA (OR) ACETAMIDE, N-(AMINOTHIOXOMETHYL)-",
        },
        {
            "code": "P003",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-PROPENAL (OR) ACROLEIN",
        },
        {
            "code": "P004",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "1,4,5,8-DIMETHANONAPHTHALENE, 1,2,3,4,10,10-HEXA-CHLORO-1,4,4A,5,8,8A,-HEXAHYDRO-, (1ALPHA, 4ALPHA, 4ABETA, 5ALPHA, 8ALPHA, 8ABETA)- (OR) ALDRIN",
        },
        {
            "code": "P005",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-PROPEN-1-OL (OR) ALLYL ALCOHOL",
        },
        {
            "code": "P006",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ALUMINUM PHOSPHIDE (R,T)",
        },
        {
            "code": "P007",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "3(2H)-ISOXAZOLONE, 5-(AMINOMETHYL)- (OR) 5-(AMINOMETHYL)-3-ISOXAZOLOL",
        },
        {
            "code": "P008",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "4-AMINOPYRIDINE (OR) 4-PYRIDINAMINE",
        },
        {
            "code": "P009",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "AMMONIUM PICRATE (R) (OR) PHENOL, 2,4,6-TRINITRO-, AMMONIUM SALT (R)",
        },
        {
            "code": "P010",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ARSENIC ACID H3ASO4",
        },
        {
            "code": "P011",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ARSENIC OXIDE AS2O5 (OR) ARSENIC PENTOXIDE",
        },
        {
            "code": "P012",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ARSENIC OXIDE AS2O3 (OR) ARSENIC TRIOXIDE",
        },
        {"code": "P013", "code_type": WasteCode.CodeType.FEDERAL, "description": "BARIUM CYANIDE"},
        {
            "code": "P014",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BENZENETHIOL (OR) THIOPHENOL",
        },
        {"code": "P015", "code_type": WasteCode.CodeType.FEDERAL, "description": "BERYLLIUM"},
        {
            "code": "P016",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DICHLOROMETHYL ETHER (OR) METHANE, OXYBIS[CHLORO-",
        },
        {
            "code": "P017",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-PROPANONE, 1-BROMO- (OR) BROMOACETONE",
        },
        {
            "code": "P018",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BRUCINE (OR) STRYCHNIDIN-10-ONE, 2,3-DIMETHOXY-",
        },
        {
            "code": "P020",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DINOSEB (OR) PHENOL, 2-(1-METHYLPROPYL)-4,6-DINITRO-",
        },
        {
            "code": "P021",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "CALCIUM CYANIDE (OR) CALCIUM CYANIDE CA(CN)2",
        },
        {
            "code": "P022",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "CARBON DISULFIDE",
        },
        {
            "code": "P023",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ACETALDEHYDE, CHLORO- (OR) CHLOROACETALDEHYDE",
        },
        {
            "code": "P024",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BENZENAMINE, 4-CHLORO- (OR) P-CHLORANILINE",
        },
        {
            "code": "P026",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "1-(O-CHLOROPHENYL)THIOUREA (OR) THIOUREA, (2-CHLOROPHENYL)-",
        },
        {
            "code": "P027",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "3-CHLOROPROPIONITRILE (OR) PROPANENITRILE, 3-CHLORO-",
        },
        {
            "code": "P028",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BENZENE, (CHLOROMETHYL)- (OR) BENZYL CHLORIDE",
        },
        {
            "code": "P029",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "COPPER CYANIDE (OR) COPPER CYANIDE CU(CN)",
        },
        {
            "code": "P030",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "CYANIDES (SOLUBLE CYANIDE SALTS), NOT OTHERWISE SPECIFIED",
        },
        {
            "code": "P031",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "CYANOGEN (OR) ETHANEDINITRILE",
        },
        {
            "code": "P033",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "CYANOGEN CHLORIDE (OR) CYANOGEN CHLORIDE (CN)CL",
        },
        {
            "code": "P034",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-CYCLOHEXYL-4,6-DINITROPHENOL (OR) PHENOL, 2-CYCLOHEXYL-4,6-DINITRO-",
        },
        {
            "code": "P036",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ARSONOUS DICHLORIDE, PHENYL- (OR) DICHLOROPHENYLARSINE",
        },
        {
            "code": "P037",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2,7:3,6-DIMETHANONAPHTH[2,3-B]OXIRENE, 3,4,5,6,9,9-HEXACHLORO-1A,2,2A,3,6,6A,7,7A-OCTAHYDRO-, (1AALPHA, 2BETA, 2AALPHA, 3BETA, 6BETA, 6AALPHA, 7BETA, 7AALPHA)- (OR) DIELDRIN",
        },
        {
            "code": "P038",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ARSINE, DIETHYL- (OR) DIETHYLARSINE",
        },
        {
            "code": "P039",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DISULFOTON (OR) PHOSPHORODITHIOIC ACID, O,O-DIETHYL S-[2-(ETHYLTHIO)ETHYL] ESTER",
        },
        {
            "code": "P040",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "O,O-DIETHYL O-PYRAZINYL PHOSPHOROTHIOATE (OR) PHOSPHOROTHIOIC ACID, O,O-DIETHYL O-PYRAZINYL ESTER",
        },
        {
            "code": "P041",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DIETHYL-P-NITROPHENYL PHOSPHATE (OR) PHOSPHORIC ACID, DIETHYL 4-NITROPHENYL ESTER",
        },
        {
            "code": "P042",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "1,2-BENZENEDIOL, 4-[1-HYDROXY-2-(METHYLAMINO)ETHYL]-, (R)- (OR) EPINEPHRINE",
        },
        {
            "code": "P043",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DIISOPROPYLFLUOROPHOSPHATE (DFP) (OR) PHOSPHOROFLUORIDIC ACID, BIS(1-METHYLETHYL) ESTER",
        },
        {
            "code": "P044",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DIMETHOATE (OR) PHOSPHORODITHIOIC ACID, O,O-DIMETHYL S-[2-(METHYLAMINO)-2-OXOETHYL] ESTER",
        },
        {
            "code": "P045",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-BUTANONE, 3,3-DIMETHYL-1-(METHYLTHIO)-, O-[METHYLAMINO)CARBONYL] OXIME (OR) THIOFANOX",
        },
        {
            "code": "P046",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ALPHA,ALPHA-DIMETHYLPHENETHYLAMINE (OR) BENZENEETHANAMINE, ALPHA, ALPHA-DIMETHYL-",
        },
        {
            "code": "P047",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "4,6-DINITRO-O-CRESOL, & SALTS (OR) PHENOL, 2-METHYL-4,6-DINITRO-, & SALTS",
        },
        {
            "code": "P048",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2,4-DINITROPHENOL (OR) PHENOL, 2,4-DINITRO-",
        },
        {
            "code": "P049",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DITHIOBIURET (OR) THIOIMIDODICARBONIC DIAMIDE [(H2N)C(S)]2NH",
        },
        {
            "code": "PHARMS",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "Hazardous Waste Pharmaceuticals",
        },
        {
            "code": "PHRM",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "HAZARDOUS WASTE PHARMACEUTICALS",
        },
        {
            "code": "U001",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ACETALDEHYDE (I) (OR) ETHANAL (I)",
        },
        {
            "code": "U002",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-PROPANONE (I) (OR) ACETONE (I)",
        },
        {
            "code": "U003",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ACETONITRILE (I,T)",
        },
        {
            "code": "U004",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ACETOPHENONE (OR) ETHANONE, 1-PHENYL-",
        },
        {
            "code": "U005",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-ACETYLAMINOFLUORENE (OR) ACETAMIDE, N-9H-FLUOREN-2-YL",
        },
        {
            "code": "U006",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ACETYL CHLORIDE (C,R,T)",
        },
        {
            "code": "U007",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-PROPENAMIDE (OR) ACRYLAMIDE",
        },
        {
            "code": "U008",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-PROPENOIC ACID (I) (OR) ACRYLIC ACID (I)",
        },
        {
            "code": "U009",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "2-PROPENENITRILE (OR) ACRYLONITRILE",
        },
        {
            "code": "U010",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "AZIRINO [2',3':3,4]PYRROLO[1,2-A]INDOLE-4,7-DIONE, 6-AMINO-8-[[(AMINOCARBONYL)OXY]METHYL]-1,1A,2,8,8A,8B-HEXAHYDRO-8A-METHOXY-5-METHYL-, [1AS-(1AALPHA, 8BETA, 8AALPHA, 8BALPHA)]- (OR) MITOMYCIN C",
        },
        {
            "code": "U011",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "1H-1,2,4-TRIAZOL-3-AMINE (OR) AMITROLE",
        },
        {
            "code": "U012",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "ANILINE (I,T) (OR) BENZENAMINE (I,T)",
        },
        {
            "code": "U014",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "AURAMINE (OR) BENZENAMINE, 4,4'-CARBONIMIDOYLBIS[N,N-DIMETHYL-",
        },
        {
            "code": "U015",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "AZASERINE (OR) L-SERINE, DIAZOACETATE (ESTER)",
        },
        {
            "code": "U016",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BENZ[C]ACRIDINE",
        },
        {
            "code": "U017",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BENZAL CHLORIDE (OR) BENZENE, (DICHLOROMETHYL)-",
        },
        {
            "code": "U018",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BENZ[A]ANTHRACENE",
        },
        {"code": "U019", "code_type": WasteCode.CodeType.FEDERAL, "description": "BENZENE (I,T)"},
        {
            "code": "U020",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BENZENESULFONIC ACID CHLORIDE (C,R) (OR) BENZENESULFONYL CHLORIDE (C,R)",
        },
        {
            "code": "U021",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "[1,1'-BIPHENYL]-4,4'-DIAMINE (OR) BENZIDINE",
        },
        {"code": "U022", "code_type": WasteCode.CodeType.FEDERAL, "description": "BENZO[A]PYRENE"},
        {
            "code": "U023",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "BENZENE, (TRICHLOROMETHYL)- (OR) BENZOTRICHLORIDE (C,R,T)",
        },
        {
            "code": "U024",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DICHLOROMETHOXY ETHANE (OR) ETHANE, 1,1'-[METHYLENEBIS(OXY)]BIS[2-CHLORO-",
        },
        {
            "code": "U025",
            "code_type": WasteCode.CodeType.FEDERAL,
            "description": "DICHLOROETHYL ETHER (OR) ETHANE, 1,1'-OXYBIS[2-CHLORO-",
        },
    ]

    for waste_code_data in federal_waste_codes:
        WasteCode.objects.create(**waste_code_data)


class Migration(migrations.Migration):
    dependencies = [
        ("wasteline", "0002_state_waste_codes"),
    ]

    operations = [
        migrations.RunPython(populate_federal_waste_codes),
    ]
