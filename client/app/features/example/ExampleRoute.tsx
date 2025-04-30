import { useParams } from 'react-router';

export const ExampleRoute = () => {
  const { accountPath } = useParams();
  console.log(accountPath);
  return (
    <div className="tw:flex tw:justify-center">
      <p>{accountPath}</p>
    </div>
  );
};
