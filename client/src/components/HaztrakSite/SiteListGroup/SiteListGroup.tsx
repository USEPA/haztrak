import { HaztrakSite } from 'components/HaztrakSite/haztrakSiteSchema';
import { ListGroup } from 'react-bootstrap';
import { SiteListItem } from 'components/HaztrakSite/SiteListItem/SiteListItem';

interface SiteListGroupProps {
  sites: Array<HaztrakSite>;
}

export function SiteListGroup({ sites }: SiteListGroupProps) {
  return (
    <ListGroup numbered as="ol">
      {sites.map((site) => {
        return <SiteListItem key={site.handler.epaSiteId} site={site} />;
      })}
    </ListGroup>
  );
}
