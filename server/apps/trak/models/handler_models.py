import logging

from django.core.exceptions import ValidationError
from django.db import models

from apps.sites.models import RcraSite

from .base_models import TrakBaseManager, TrakBaseModel
from .signature_models import ESignature, PaperSignature

logger = logging.getLogger(__name__)


class HandlerManager(TrakBaseManager):
    """
    Inter-model related functionality for the Handler Model
    """

    def save(self, **handler_data) -> models.QuerySet:
        e_signatures = []
        paper_signature = None
        if "e_signatures" in handler_data:
            e_signatures = handler_data.pop("e_signatures")
        logger.debug(f"e_signature data {e_signatures}")
        if "paper_signature" in handler_data:
            paper_signature = PaperSignature.objects.create(**handler_data.pop("paper_signature"))
        try:
            if RcraSite.objects.filter(epa_id=handler_data["epa_site"]["epa_id"]).exists():
                epa_site = RcraSite.objects.get(epa_id=handler_data["epa_site"]["epa_id"])
                handler_data.pop("epa_site")
                logger.debug(f"using existing RcraSite {epa_site}")
            else:
                epa_site = RcraSite.objects.save(**handler_data.pop("epa_site"))
                logger.debug(f"RcraSite created {epa_site}")
            manifest_handler = self.model.objects.create(
                epa_site=epa_site,
                paper_signature=paper_signature,
                **handler_data,
            )
            logger.debug(f"Handler created {manifest_handler}")
            for e_signature_data in e_signatures:
                e_sig = ESignature.objects.save(
                    manifest_handler=manifest_handler, **e_signature_data
                )
                logger.debug(f"ESignature created {e_sig}")
            return manifest_handler
        except KeyError as exc:
            logger.warning(f"KeyError while creating Manifest epa_site {exc}")
        except ValidationError as exc:
            logger.warning(f"ValidationError while creating Manifest epa_site {exc}")
            raise exc


class Handler(TrakBaseModel):
    """
    Handler which contains a reference to hazardous waste
    epa_site and data specific to that epa_site on the given manifest.
    """

    class Meta:
        ordering = ["epa_site"]

    objects = HandlerManager()

    epa_site = models.ForeignKey(
        "sites.RcraSite",
        on_delete=models.CASCADE,
        help_text="Hazardous waste epa_site associated with the manifest",
    )
    paper_signature = models.OneToOneField(
        "PaperSignature",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="The signature associated with hazardous waste custody exchange",
    )

    @property
    def signed(self) -> bool:
        """Returns True if one of the signature types is present"""
        e_signature_exists = ESignature.objects.filter(
            manifest_handler=self, sign_date__isnull=False
        ).exists()
        paper_signature_exists = self.paper_signature is not None
        return paper_signature_exists or e_signature_exists

    def __str__(self):
        return f"{self.epa_site.epa_id}"
