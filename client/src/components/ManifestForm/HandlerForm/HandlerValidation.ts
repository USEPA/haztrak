import * as yup from 'yup';

const HandlerSchema = yup.object().shape({
  epaSiteId: yup.string().required('Site ID is required'),
  name: yup.string().required('Site Name is required'),
  siteAddress: yup.object({
    streetNumber: yup
      .number()
      .typeError('Street Number must be number')
      .nullable(true)
      // Transform NaN to null so empty number is allowed
      .transform((_, val) => (val === Number(val) ? val : null)),
    address1: yup.string().required('Street address is required'),
    city: yup.string().optional(),
    state: yup.object().required('State is required'),
  }),
});

export default HandlerSchema;
