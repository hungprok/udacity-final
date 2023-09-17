import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import { Form, Button, Grid, Loader, Checkbox, Icon } from 'semantic-ui-react'

import {
  createItem,
  deleteItem,
  getItems,
  getUploadUrl,
  patchItem,
  uploadFile
} from '../api/api'
import Auth from '../auth/Auth'
import { Item } from '../types/Item'
const defaultImg =
  'data:image/png;base64,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'
interface ItemsProps {
  auth: Auth
  history: History
}

interface ItemsState {
  items: Item[]
  newItemName: string
  loading: boolean
  attachmentUrl?: string
  done: boolean
  soldDate: string
  file: any
  description: string
  price: number
}

export class ListItem extends React.PureComponent<ItemsProps, ItemsState> {
  state: ItemsState = {
    items: [],
    newItemName: '',
    loading: true,
    attachmentUrl: defaultImg,
    done: false,
    soldDate: '',
    file: undefined,
    description: '',
    price: 0
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newItemName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ description: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: +event.target.value })
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/item/${itemId}/edit`)
  }

  onItemCreate = async () => {
    this.setState({
      loading: true
    })
    try {
      if (!this.state.newItemName) {
        return
      }
      const newItem = await createItem(this.props.auth.getIdToken(), {
        name: this.state.newItemName,
        price: this.state.price,
        description: this.state.description ? this.state.description : ''
      })
      if (this.state.file) {
        const uploadUrl = await getUploadUrl(
          this.props.auth.getIdToken(),
          newItem.itemId
        )
        await uploadFile(uploadUrl, this.state.file)
      }

      const items = await getItems(this.props.auth.getIdToken())
      this.setState({
        items,
        loading: false
      })
    } catch {
      alert('Creation failed')
    }
  }

  onItemDelete = async (itemId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this item?')) {
        await deleteItem(this.props.auth.getIdToken(), itemId)
        this.setState({
          items: this.state.items.filter((item) => item.itemId !== itemId)
        })
      }
    } catch {
      alert('deletion failed')
    }
  }

  onItemCheck = async (pos: number) => {
    this.setState({
      loading: true
    })
    try {
      const item = this.state.items[pos]
      // this.setState({
      //   items: update(this.state.items, {
      //     [pos]: { sold: { $set: !item.sold } }
      //   })
      // })
      await patchItem(this.props.auth.getIdToken(), item.itemId, {
        name: item.name,
        sold: !item.sold,
        soldDate: item.sold ? new Date().toLocaleString() : '',
        price: item.price
      })
      const items = await getItems(this.props.auth.getIdToken())
      this.setState({
        items,
        loading: false
      })
    } catch {
      alert('Update failed')
    }
  }

  async componentDidMount() {
    try {
      const items = await getItems(this.props.auth.getIdToken())
      this.setState({
        items,
        loading: false
      })
    } catch (e) {
      alert(`Failed to fetch items: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        {this.renderCreateItemsInput()}
        {this.renderItems()}
      </div>
    )
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  renderCreateItemsInput() {
    return (
      <div className="mb-3">
        <div className="collapse" id="collapseExample">
          <div className="card card-body">
            <Form onSubmit={this.onItemCreate}>
              <div className="row max-width-50">
                <div className="col justify-content-end d-flex">
                  <img
                    style={{ maxHeight: '216px' }}
                    className="border border-secondary-subtle rounded-2"
                    src={
                      this.state.file
                        ? URL.createObjectURL(this.state.file)
                        : defaultImg
                    }
                    alt="default"
                  />
                </div>
                <div className="col">
                  <div className="row">
                    <div className="col">
                      <Form.Field>
                        <label>Automobile name</label>
                        <input
                          value={this.state.newItemName}
                          type="text"
                          placeholder="Please enter automobile name"
                          onChange={this.handleNameChange}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Automobile image</label>
                        <input
                          type="file"
                          accept="image/*"
                          placeholder="Image to upload"
                          onChange={this.handleFileChange}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Price</label>
                        <input
                          value={this.state.price}
                          type="number"
                          placeholder="Please enter a price"
                          onChange={this.handlePriceChange}
                        />
                      </Form.Field>
                    </div>
                    <div className="col">
                      <Form.Field>
                        <label>Description</label>
                        <textarea
                          style={{
                            maxHeight: '142px'
                          }}
                          value={this.state.description}
                          placeholder="Describe your item"
                          onChange={this.handleDescriptionChange}
                        />
                      </Form.Field>
                      <div className="row">
                        <div className="col d-flex justify-content-end">
                          <Button
                            disabled={!this.state.newItemName}
                            className="button button-primary"
                            type="submit"
                          >
                            Add new automobile
                          </Button>{' '}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }

  renderItems() {
    if (this.state.loading) {
      return this.renderLoading()
    }

    return this.renderItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading
        </Loader>
      </Grid.Row>
    )
  }

  renderItemsList() {
    return (
      <div className="row">
        <div className="text-center">
          <h1 className="mb-4">ITEMS ON SALE</h1>
        </div>
        {this.state.items.map((item, pos) => {
          return (
            <div className="col-3 mb-4" key={pos}>
              <div className="card rounded-3">
                <div
                  className={'overlay rounded-3 ' + (item.sold ? '' : 'hidden')}
                >
                  <p>SOLD</p>
                </div>
                <Checkbox
                  onChange={() => this.onItemCheck(pos)}
                  checked={item.sold}
                />
                <img
                  style={{
                    height: '300px',
                    objectFit: 'cover',
                    width: '100%'
                  }}
                  src={item.attachmentUrl ? item.attachmentUrl : defaultImg}
                  className="card-img-top"
                  alt="default"
                />
                <div className="card-body">
                  <h5 className="card-title"> {item.name}</h5>
                  <p className="card-text">{item.description}</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <div className="col-9">
                    <h3>{item.price} VND</h3>
                  </div>
                  <div className="col-3 d-flex justify-content-between">
                    <Button
                      icon
                      color="blue"
                      onClick={() => this.onEditButtonClick(item.itemId)}
                    >
                      <Icon name="pencil" />
                    </Button>
                    <Button
                      icon
                      color="red"
                      onClick={() => this.onItemDelete(item.itemId)}
                    >
                      <Icon name="delete" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
