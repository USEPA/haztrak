import * as yup from 'yup';
import HandlerSchema from './HandlerForm/HandlerSchema';

const ManifestSchema = yup.object().shape({
  generator: HandlerSchema,
});

export default ManifestSchema;
