import { forwardRef, useImperativeHandle, useState } from 'react'
import type { Ref } from 'react'
import { Modal, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export interface ImageLightboxHandle {
  open: (index: number) => void
  close: () => void
}

interface ImageLightboxProps {
  images: string[]
}

function ImageLightboxComponent({ images }: ImageLightboxProps, ref: Ref<ImageLightboxHandle>) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  useImperativeHandle(ref, () => ({
    open: (i: number) => {
      setIndex(i)
      setOpen(true)
    },
    close: () => setOpen(false),
  }))

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        {images[index] && (
          <Box
            component="img"
            src={images[index]}
            alt=""
            sx={{ maxWidth: '100%', maxHeight: '80vh', display: 'block' }}
          />
        )}
      </Box>
    </Modal>
  )
}

export const ImageLightbox = forwardRef(ImageLightboxComponent)
