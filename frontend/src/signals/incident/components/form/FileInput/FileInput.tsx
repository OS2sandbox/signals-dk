// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { useState, useCallback } from 'react'

import FileInputComponent from 'components/FileInput'

import fileSize from '../../../services/file-size'
import type { Meta, Parent } from '../types/FileInput'
import i18n from 'i18n'

export interface Props {
  handler: () => { value: File[] }
  parent: Parent
  meta: Meta
}

const FileInput = ({ handler, parent, meta }: Props) => {
  const [errors, setErrors] = useState<string[]>()
  const maxNumberOfFiles = (meta && meta.maxNumberOfFiles) || 3
  const checkMinFileSize = useCallback(
    (file) => file.size >= meta.minFileSize,
    [meta]
  )

  const checkMaxFileSize = useCallback(
    (file) => file.size < meta.maxFileSize,
    [meta]
  )

  const checkFileType = useCallback(
    (file) => meta.allowedFileTypes.includes(file.type),
    [meta]
  )

  const checkNumberOfFiles = useCallback(
    (_, index) => index < maxNumberOfFiles,
    [maxNumberOfFiles]
  )

  const getErrorMessages = useCallback(
    (files) => {
      const errorMessages = []

      if (meta.minFileSize && !files.every(checkMinFileSize)) {
        errorMessages.push(
          i18n.t('dit-bestand-is-te-klein-de-minimale-bestandgrootte-is-filesize-meta-minfile')
        )
      }

      if (meta.maxFileSize && !files.every(checkMaxFileSize)) {
        errorMessages.push(
          i18n.t('dit-bestand-is-te-groot-de-maximale-bestandgrootte-is') + ` ${fileSize(meta.maxFileSize)}.`
        )
      }

      if (meta.allowedFileTypes && !files.every(checkFileType)) {
        errorMessages.push(
          i18n.t('dit-bestandstype-wordt-niet-ondersteund-toegestaan-zijn') + `: ${meta.allowedFileTypes.map((type) => type.replace(/.*\//, '')).join(', ')}.`
        )
      }

      if (!files.every(checkNumberOfFiles)) {
        errorMessages.push(
          i18n.t('u-kunt-maximaal-maxnumberoffiles-bestanden-uploaden')
        )
      }

      return errorMessages
    },
    [
      meta,
      checkMinFileSize,
      checkMaxFileSize,
      checkFileType,
      checkNumberOfFiles,
      maxNumberOfFiles,
    ]
  )

  const handleChange = useCallback(
    (batchFiles) => {
      const minFileSizeFilter = meta.minFileSize ? checkMinFileSize : () => true
      const maxFileSizeFilter = meta.maxFileSize ? checkMaxFileSize : () => true
      const allowedFileTypesFilter = meta.allowedFileTypes
        ? checkFileType
        : () => true
      const maxNumberOfFilesFilter = checkNumberOfFiles

      const files = batchFiles
        .filter(minFileSizeFilter)
        .filter(maxFileSizeFilter)
        .filter(allowedFileTypesFilter)
        .filter(maxNumberOfFilesFilter)

      setErrors(getErrorMessages(batchFiles))

      parent.meta.updateIncident({
        [meta.name]: files,
        [`${meta.name}_previews`]: files.map((file: File) =>
          window.URL.createObjectURL(file)
        ),
      })
    },
    [
      checkMinFileSize,
      checkMaxFileSize,
      checkFileType,
      checkNumberOfFiles,
      getErrorMessages,
      meta,
      parent,
    ]
  )

  const files = handler().value || []

  return (
    <FileInputComponent
      allowedFileTypes={meta.allowedFileTypes}
      errorMessages={errors}
      files={files}
      maxFileSize={meta.maxFileSize}
      maxNumberOfFiles={maxNumberOfFiles}
      minFileSize={meta.minFileSize}
      name={meta.name}
      onChange={handleChange}
    />
  )
}

export default FileInput
