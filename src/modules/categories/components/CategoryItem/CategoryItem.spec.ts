import { describe, it, expect } from 'vitest'
import CategoryItem from './CategoryItem.vue'
import { fireEvent, render } from '@testing-library/vue'

const mockCategory = {
  id: 'any_id',
  createdAt: 'any_created_at',
  updatedAt: 'any_updated_at',
  name: 'any_name',
  parent: 'any_parent',
  children: ['any_children'],
  hasChildren: false,
}

const renderCategoryItem = () => {
  return render(CategoryItem, {
    props: {
      category: mockCategory,
      loading: false,
    },
  })
}

describe('CategoryItem', () => {
  it('should render properly', () => {
    const { getByText, getByTestId, unmount } = renderCategoryItem()
    const categoryName = getByText('any_name')
    const dropdownMenu = getByTestId('dropdown-menu')
    expect(categoryName).toBeInTheDocument()
    expect(dropdownMenu).toBeInTheDocument()
    unmount()
  })

  it('should show dropdown actions on click', async () => {
    const { getByTestId, unmount } = renderCategoryItem()

    const dropdownMenuTrigger = getByTestId('dropdown-menu-trigger')

    await fireEvent.click(dropdownMenuTrigger)

    const dropdownMenuRename = getByTestId('dropdown-menu-rename')
    const dropdownMenuRemove = getByTestId('dropdown-menu-remove')

    expect(dropdownMenuRename).toBeInTheDocument()
    expect(dropdownMenuRemove).toBeInTheDocument()
    unmount()
  })

  it('should show edit input on rename click', async () => {
    const { getByTestId, unmount } = renderCategoryItem()
    const dropdownMenuTrigger = getByTestId('dropdown-menu-trigger')
    await fireEvent.click(dropdownMenuTrigger)
    const dropdownMenuRename = getByTestId('dropdown-menu-rename')
    await fireEvent.click(dropdownMenuRename)
    const editInput = getByTestId('edit-input')
    expect(editInput).toBeInTheDocument()
    unmount()
  })

  it('should cancel edit-mode onClick cancel button', async () => {
    const { getByTestId, getByText, unmount } = renderCategoryItem()
    const dropdownMenuTrigger = getByTestId('dropdown-menu-trigger')
    await fireEvent.click(dropdownMenuTrigger)
    const dropdownMenuRename = getByTestId('dropdown-menu-rename')
    await fireEvent.click(dropdownMenuRename)
    const cancelEditButton = getByTestId('cancel-edit')
    await fireEvent.click(cancelEditButton)
    const categoryName = getByText('any_name')
    const dropdownMenu = getByTestId('dropdown-menu')
    expect(categoryName).toBeInTheDocument()
    expect(dropdownMenu).toBeInTheDocument()
    unmount()
  })

  it('should emit update category event', async () => {
    const { getByTestId, emitted, unmount } = renderCategoryItem()
    const dropdownMenuTrigger = getByTestId('dropdown-menu-trigger')
    await fireEvent.click(dropdownMenuTrigger)

    const dropdownMenuRename = getByTestId('dropdown-menu-rename')
    await fireEvent.click(dropdownMenuRename)

    const editInput = await getByTestId('edit-input-value')

    await fireEvent.update(editInput, 'any_new_value')

    const triggerEmitUpdateCategory = getByTestId('trigger-emit-update-category')
    await fireEvent.click(triggerEmitUpdateCategory)

    expect(emitted('update-category')[0][1]).toBe('any_new_value')
    unmount()
  })

  it('should emit open dialog confirm event', async () => {
    const { getByTestId, emitted, unmount } = renderCategoryItem()
    const dropdownMenuTrigger = getByTestId('dropdown-menu-trigger')
    await fireEvent.click(dropdownMenuTrigger)

    const dropdownMenuRemove = getByTestId('dropdown-menu-remove')
    await fireEvent.click(dropdownMenuRemove)

    expect(emitted('open-dialog')[0][0]).toBe('any_id')
    unmount()
  })
})
