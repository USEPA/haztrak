import { Manifest } from 'components/Manifest';

export const manifest = {
  /** Returns EPA ID of the next site that can sign on a manifest or undefined if not applicable. */
  getNextSigner(manifest: Partial<Manifest> | undefined): string | undefined {
    if (manifest === undefined || manifest === null || manifest.status === undefined) {
      return undefined;
    }
    if (
      manifest.status === 'Scheduled' &&
      !manifest.generator?.electronicSignaturesInfo?.[0]?.signer &&
      manifest.generator
    ) {
      return manifest.generator.epaSiteId;
    }
    if (manifest.status === 'Scheduled' && manifest.transporters?.length === 1) {
      return manifest.transporters[0].epaSiteId;
    }
    if (manifest.status === 'InTransit' && manifest.transporters) {
      for (const transporter of manifest.transporters) {
        if (!transporter.electronicSignaturesInfo?.[0].signer) {
          return transporter.epaSiteId;
        }
      }
    }
    if (manifest.status === 'ReadyForSignature' && manifest.designatedFacility) {
      return manifest.designatedFacility.epaSiteId;
    }
    return undefined;
  },
};
