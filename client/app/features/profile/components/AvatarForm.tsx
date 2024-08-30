import React, { createRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '~/components/ui';

interface AvatarFormProps {
  avatar?: string;
}

export function AvatarForm({ avatar }: AvatarFormProps) {
  const [preview, setPreview] = useState(avatar);
  const fileRef = createRef<HTMLInputElement>();

  const form = useForm<{ avatar?: string }>({ values: { avatar } });

  const handleUploadedFile = (event: React.FormEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) {
      return;
    }
    const file = event.currentTarget.files[0];
    const urlImage = URL.createObjectURL(file);
    setPreview(urlImage);
  };

  const onSubmit = (data: any) => {
    console.log('data ', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormItem>
          <FormLabel />
          <FormControl>
            <div className="tw-flex tw-justify-center">
              <button onClick={() => fileRef.current?.click()}>
                <Input
                  {...form.register('avatar')}
                  id="picture"
                  type="file"
                  accept="image/png,image/jpeg"
                  aria-label="Profile Picture"
                  ref={fileRef}
                  onChange={handleUploadedFile}
                  className="tw-hidden"
                />
                <Avatar className="tw-h-40 tw-w-40">
                  <AvatarImage src={preview} alt="avatar" />
                  <AvatarFallback>
                    <FaUser size={80} />
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </form>
    </Form>
  );
}
