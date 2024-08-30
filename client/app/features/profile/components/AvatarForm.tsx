import React, { createRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '~/components/ui';

interface AvatarFormProps {
  avatar?: string;
}

export function AvatarForm({ avatar }: AvatarFormProps) {
  const [editable, setEditable] = useState(false);
  const [preview, setPreview] = useState(avatar);
  const fileRef = createRef<HTMLInputElement>();

  const form = useForm<{ avatar?: string }>({ values: { avatar } });

  const onSubmit = (data: any) => {
    setEditable(!editable);
    console.log('data', data);
  };

  // @ts-expect-error - event not used
  const handleUploadedFile = (event) => {
    console.log('files ', event.target.files);
    const file = event.target.files[0];
    const urlImage = URL.createObjectURL(file);
    setPreview(urlImage);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel />
              <FormControl>
                <div className="tw-flex tw-justify-center">
                  <button onClick={() => fileRef.current?.click()}>
                    <Input
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
          )}
        />
        {/*<FormField label="Picture">*/}
        {/*  <Controller*/}
        {/*    control={control}*/}
        {/*    name={'picture'}*/}
        {/*    rules={{ required: 'Recipe picture is required' }}*/}
        {/*    render={({ field: { value, onChange, ...field } }) => {*/}
        {/*      return (*/}
        {/*        <Input*/}
        {/*          {...field}*/}
        {/*          value={value?.fileName}*/}
        {/*          onChange={(event) => {*/}
        {/*            onChange(event.target.files[0]);*/}
        {/*          }}*/}
        {/*          type="file"*/}
        {/*          id="picture"*/}
        {/*        />*/}
        {/*      );*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</FormField>*/}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
