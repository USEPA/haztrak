import { Manifest } from 'components/Manifest';
import { ManifestStatus, RcraSiteType, SiteType } from 'components/Manifest/manifestSchema';
import { ProfileSlice } from 'store';

export const manifest = {
  /** Returns EPA ID of the next site that can sign on a manifest or undefined if not applicable. */
  getNextSigner(manifest: Partial<Manifest> | undefined):
    | {
        epaSiteId: string;
        siteType: SiteType;
        transporterOrder?: number;
      }
    | undefined {
    if (manifest === undefined || manifest === null || manifest.status === undefined) {
      return undefined;
    }
    if (
      manifest.status === 'Scheduled' &&
      !manifest.generator?.electronicSignaturesInfo?.[0]?.signer &&
      manifest.generator
    ) {
      return { epaSiteId: manifest.generator.epaSiteId, siteType: 'generator' };
    }
    if (manifest.status === 'Scheduled' && manifest.transporters?.length === 1) {
      return {
        epaSiteId: manifest.transporters[0].epaSiteId,
        siteType: 'transporter',
        transporterOrder: 1,
      };
    }
    if (manifest.status === 'InTransit' && manifest.transporters) {
      for (const transporter of manifest.transporters) {
        if (!transporter.electronicSignaturesInfo?.[0].signer) {
          return {
            epaSiteId: transporter.epaSiteId,
            siteType: 'transporter',
            transporterOrder: transporter.order,
          };
        }
      }
    }
    if (manifest.status === 'ReadyForSignature' && manifest.designatedFacility) {
      return { epaSiteId: manifest?.designatedFacility.epaSiteId, siteType: 'designatedFacility' };
    }
    return undefined;
  },
  siteTypeToRcraSiteType(siteType: SiteType | undefined): RcraSiteType | undefined {
    switch (siteType) {
      case 'generator':
        return 'Generator';
      case 'designatedFacility':
        return 'Tsdf';
      case 'transporter':
        return 'Transporter';
      default:
        return undefined;
    }
  },
  getStatusOptions({ manifest, profile }: { manifest: Manifest; profile: ProfileSlice }) {
    let options: ManifestStatus[] = [];
    const currentStatus = manifest.status;
    if (currentStatus === 'NotAssigned') {
      options.push('NotAssigned', 'Pending');
    }
    if (manifest.designatedFacility && profile.sites) {
      if (manifest.designatedFacility.epaSiteId in profile.sites) {
        options.push('Scheduled');
      }
    }
    return options;
  },
};
