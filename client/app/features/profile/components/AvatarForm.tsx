import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FaUser } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage, Input } from '~/components/ui';
import { useAuth } from '~/hooks';
import { htApi } from '~/services';

interface AvatarFormProps {
  avatar?: string;
}

export function AvatarForm({ avatar }: AvatarFormProps) {
  const [preview, setPreview] = useState<string | undefined>(avatar);
  const inputRef = useRef<HTMLInputElement | null>(null);
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
      .then((res) => setPreview(res.data.avatar))
      .catch((err) => console.log(err));
  };

  const registerProps = register('avatar');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="file"
        {...registerProps}
        ref={(e) => {
          registerProps.ref(e);
          inputRef.current = e;
        }}
        className="tw-hidden"
      />
      <div className="tw-flex tw-justify-center">
        <button type="button" onClick={() => inputRef.current?.click()}>
          <Avatar className="tw-h-40 tw-w-40">
            <AvatarImage src={preview} alt="avatar" />
            <AvatarFallback>
              <FaUser size={80} />
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
