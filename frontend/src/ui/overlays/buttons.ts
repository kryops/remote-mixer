import { iconOk, iconClose } from '../icons'

export interface ModalButton<T> {
  icon: string
  label: string
  value: T
}

export const buttonOk: ModalButton<true> = {
  icon: iconOk,
  label: 'Ok',
  value: true,
}

export const buttonYes: ModalButton<true> = {
  icon: iconOk,
  label: 'Yes',
  value: true,
}

export const buttonNo: ModalButton<false> = {
  icon: iconClose,
  label: 'No',
  value: false,
}

export const buttonCancel: ModalButton<null> = {
  icon: iconClose,
  label: 'Cancel',
  value: null,
}

export const yesNo = [buttonYes, buttonNo]
export const okCancel = [buttonOk, buttonCancel]
