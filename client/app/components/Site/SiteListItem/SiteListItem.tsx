import { HaztrakSite } from '~/components/Site/siteSchema';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import { SiteListItemActions } from '~/components/Site/SiteListItem/SiteListItemActions';

interface SiteListItemProps {
  site: HaztrakSite;
}

export function SiteListItem({ site }: SiteListItemProps) {
  return (
    <ListGroup.Item
      className="text-nowrap d-flex justify-content-between align-items-start"
      as="li"
    >
      <div className="ms-2 me-auto">
        <div>
          <Link
            to={`/site/${site.handler.epaSiteId}`}
            aria-label={`site ${site.name}`}
            className="fw-bold text-decoration-none"
          >
            {site.name}
          </Link>
        </div>
        <i>{site.handler.epaSiteId}</i>
      </div>
      <SiteListItemActions siteId={site.handler.epaSiteId} />
    </ListGroup.Item>
  );
}
