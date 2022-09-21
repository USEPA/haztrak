import * as yup from 'yup';

export const AddressSchema = yup.object({
  streetNumber: yup.string().optional(),
  // ToDo: validate streetNumber as an optional number
  // .typeError('Street Number must be number')
  // .nullable(true),
  // .transform((_, val) => (val === Number(val) ? val : null)),
  address1: yup.string().required('Street is required'),
  city: yup.string().optional(),
  state: yup.object().required('State is required'),
  zip: yup.string().required(),
});
