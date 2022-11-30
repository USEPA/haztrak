import * as yup from 'yup';
import { AddressSchema } from 'components/ManifestForm/AddressForm';

const HandlerSchema = yup.object().shape({
  epaSiteId: yup.string().required('Site ID is required'),
  name: yup.string().required('Site Name is required'),
  mailCheck: yup.boolean(),
  siteAddress: AddressSchema,
  // mailingAddress, not included for since only the generators mailing address
  // ***should*** differ
});

export default HandlerSchema;
