import { describe, it, expect } from 'vitest'
import AddSubcategoryItem from './AddSubcategoryItem.vue'
import { fireEvent, render } from '@testing-library/vue'

const renderCategoryItem = () => {
  return render(AddSubcategoryItem, {
    props: {
      loading: false,
    },
  })
}

describe('AddSubcategoryItem', () => {
  it('should render properly', () => {
    const { getByTestId, unmount } = renderCategoryItem()
    const buttonText = getByTestId('button-text')
    const buttonIcon = getByTestId('button-icon')
    expect(buttonText).toBeInTheDocument()
    expect(buttonIcon).toBeInTheDocument()
    unmount()
  })

  it('should show edit input on button click', async () => {
    const { getByTestId, unmount } = renderCategoryItem()
    const onEnableRegisterMode = getByTestId('on-enable-register-mode')
    await fireEvent.click(onEnableRegisterMode)
    const inputContainer = getByTestId('input-container')
    const inputValue = getByTestId('input-value')
    const onCancelRegister = getByTestId('on-cancel-register-button')
    const onConfirmEvent = getByTestId('on-confirm-event-button')
    expect(inputContainer).toBeInTheDocument()
    expect(inputValue).toBeInTheDocument()
    expect(onCancelRegister).toBeInTheDocument()
    expect(onConfirmEvent).toBeInTheDocument()
    unmount()
  })

  it('should not show edit input on click cancel register button', async () => {
    const { getByTestId, unmount } = renderCategoryItem()
    const onEnableRegisterMode = getByTestId('on-enable-register-mode')
    await fireEvent.click(onEnableRegisterMode)
    const onCancelRegister = getByTestId('on-cancel-register-button')
    await fireEvent.click(onCancelRegister)
    const buttonText = getByTestId('button-text')
    const buttonIcon = getByTestId('button-icon')
    expect(buttonText).toBeInTheDocument()
    expect(buttonIcon).toBeInTheDocument()
    unmount()
  })

  it('should emit on confirm event on click register button with correct categoryName', async () => {
    const { getByTestId, unmount, emitted } = renderCategoryItem()
    const onEnableRegisterMode = getByTestId('on-enable-register-mode')
    await fireEvent.click(onEnableRegisterMode)
    const editInput = getByTestId('input-value')
    await fireEvent.update(editInput, 'new_category_name')
    const onConfirmEvent = getByTestId('on-confirm-event-button')
    await fireEvent.click(onConfirmEvent)
    expect(emitted('confirm')[0][0]).toBe('new_category_name')
    unmount()
  })
})
