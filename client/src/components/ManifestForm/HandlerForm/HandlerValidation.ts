import * as yup from 'yup';

const HandlerSchema = yup.object().shape({
  epaSiteId: yup.string().required('Site ID is required'),
  name: yup.string().required('Site Name is required'),
  siteAddress: yup
    .object({
      streetNumber: yup.number().optional(),
      address1: yup.string().required('Street address is required'),
      city: yup.string().optional(),
      state: yup.string().required("Select the site's state"),
    })
    .required('Site Address is required'),
});

export default HandlerSchema;
