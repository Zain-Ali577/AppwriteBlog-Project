import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import conf from '../conf/conf.js';

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className='w-full'>
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

      <Controller
        name={name || 'content'}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={conf.tinymceApiKey || 'no-api-key'} 
            initialValue={defaultValue}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'anchor',
                'autolink',
                'autoresize',
                'code',
                'codesample',
                'charmap',
                'emoticons',
                'image',
                'insertdatetime',
                'link',
                'lists',
                'media',
                'preview',
                'searchreplace',
                'table',
                'wordcount',
              ],
              toolbar:
                'undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  )
}