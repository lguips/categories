import { describe, it, expect, vi } from 'vitest'
import HomeView from './HomeView.vue'
import { render } from '@testing-library/vue'

import axios from 'axios'

const successResponseMock = {
  data: [
    {
      id: 'any_id',
      createdAt: 'any_created_at',
      updatedAt: 'any_updated_at',
      name: 'any_name',
      parent: 'any_parent',
      children: ['any_children'],
      hasChildren: false,
    },
    {
      id: 'any_id',
      createdAt: 'any_created_at',
      updatedAt: 'any_updated_at',
      name: 'any_name',
      parent: 'any_parent',
      children: ['any_children'],
      hasChildren: false,
    },
  ],
}

const emptyResponseMock = {
  data: [],
}

describe('HomeView tests', () => {
  it('should render properly properly with at least one category in response', async () => {
    vi.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve(successResponseMock)
    })

    const { getByText, findByText } = render(HomeView)

    const categoriesButton = await findByText('Categorias')
    const subcategoriesButton = await findByText('Subcategorias')
    const numberOfCategories = await findByText('2')

    expect(getByText('Organize seu catálogo com categorias e subcategorias'))
    expect(
      getByText(
        'Ao usar categorias e subcategorias do catálogo, você ajuda seus clientes a encontrarem os produtos desejados.',
      ),
    )
    expect(categoriesButton).toBeInTheDocument()
    expect(subcategoriesButton).toBeInTheDocument()
    expect(numberOfCategories).toBeInTheDocument()
  })

  it('should show add category button if no category is found', async () => {
    vi.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve(emptyResponseMock)
    })
    const { findByTestId } = render(HomeView)
    const addCategoryButton = await findByTestId('create-categories-button')
    expect(addCategoryButton).toBeInTheDocument()
  })

  it('should show toast on error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Houve um erro ao carregar os dados',
        },
      },
    }
    vi.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject(mockError)
    })
    const { findByText } = render(HomeView)
    const error = await findByText('Houve um erro ao carregar os dados')
    expect(error).toBeInTheDocument()
  })
})
