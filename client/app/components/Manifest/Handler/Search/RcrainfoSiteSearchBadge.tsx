import { Badge } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { Spinner } from '~/components/ui';

interface RcrainfoInfoStatusProps {
  data: any;

  error: any;
  isFetching: boolean;
  rcraInfoIntegrated: boolean;
}

export function RcrainfoSiteSearchBadge({
  isFetching,
  error,
  data,
  rcraInfoIntegrated,
}: RcrainfoInfoStatusProps) {
  let bg = 'secondary';
  let text = 'white';
  let message = 'Ready to search RCRAInfo';
  if (!rcraInfoIntegrated) {
    message = 'RCRAInfo not integrated';
    bg = 'warning';
    text = 'dark';
  }
  if (error) {
    message = 'Error searching RCRAInfo';
    bg = 'danger';
  } else if (isFetching) {
    message = 'Searching RCRAInfo ';
    bg = 'primary';
  } else if (data) {
    message = 'Sites Retrieved from RCRAInfo ';
    bg = 'success';
  }

  return (
    <div className="my-2">
      <Badge className="p-2" bg={bg} text={text} pill>
        <span>{message}</span>
        {isFetching ? <Spinner size="md" /> : error ? <FaXmark /> : data ? <FaCheck /> : <></>}
      </Badge>
    </div>
  );
}
