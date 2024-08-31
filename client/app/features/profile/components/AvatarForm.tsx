import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/ui';
import { useAuth } from '~/hooks';
import { htApi } from '~/services';

export function AvatarForm() {
  const { register, handleSubmit } = useForm();
  const { user } = useAuth();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar[0]);
    console.log('data ', formData);
    htApi
      .patch(`/profile/${user?.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input type="file" {...register('avatar')} />
      <button type="submit">Submit</button>
    </form>
  );
}
