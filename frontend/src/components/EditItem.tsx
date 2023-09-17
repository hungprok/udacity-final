import * as React from 'react'
import { Form, Grid, Loader, Checkbox } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getItemById, patchItem } from '../api/api'
import { History } from 'history'
import dateFormat from 'dateformat'

const defaultImg =
  'data:image/png;base64,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'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditItemProps {
  match: {
    params: {
      itemId: string
    }
  }
  history: History
  auth: Auth
}

interface EditItemState {
  file: any
  uploadState: UploadState
  newItemName: string
  attachmentUrl?: string
  loading: boolean
  sold: boolean
  soldDate: string
  description: string
  price: number
}
export class EditItem extends React.PureComponent<
  EditItemProps,
  EditItemState
> {
  state: EditItemState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    newItemName: '',
    loading: true,
    attachmentUrl: defaultImg,
    sold: false,
    soldDate: '',
    description: '',
    price: 0
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async () => {
    this.setState({
      loading: true
    })
    try {
      if (this.state.file) {
        this.setUploadState(UploadState.FetchingPresignedUrl)
        const uploadUrl = await getUploadUrl(
          this.props.auth.getIdToken(),
          this.props.match.params.itemId
        )
        this.setUploadState(UploadState.UploadingFile)
        await uploadFile(uploadUrl, this.state.file)
      }
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      await patchItem(
        this.props.auth.getIdToken(),
        this.props.match.params.itemId,
        {
          name: this.state.newItemName,
          sold: this.state.sold,
          soldDate: this.calculateDueDate(),
          description: this.state.description,
          price: this.state.price
        }
      )

      if (this.state.file) {
        this.setUploadState(UploadState.NoUpload)
      }
      this.setState({
        loading: false
      })
      this.props.history.push(`/`)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const ỉtem = await getItemById(
        this.props.auth.getIdToken(),
        this.props.match.params.itemId
      )
      console.log(ỉtem)
      const { name, attachmentUrl, sold, soldDate, description, price } = ỉtem
      this.setState({
        newItemName: name,
        attachmentUrl: attachmentUrl ? attachmentUrl : defaultImg,
        sold: sold,
        loading: false,
        soldDate: soldDate,
        description: description ? description : '',
        price: price
      })
    } catch (e) {
      alert(`Failed to fetch: ${(e as Error).message}`)
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newItemName: event.target.value })
  }

  handleStatusChange = () => {
    this.setState({ sold: !this.state.sold })
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered"></Loader>
      </Grid.Row>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ description: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: +event.target.value })
  }

  render() {
    if (this.state.loading) {
      return this.renderLoading()
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col">
            <img
              style={{ maxWidth: '100%' }}
              className="border border-secondary-subtle rounded-2"
              src={this.state.attachmentUrl}
              alt="default"
            />
          </div>
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
              <div className="col">
                {' '}
                <Form.Field>
                  <label>Current status</label>
                  <Checkbox
                    checked={this.state.sold}
                    onChange={() => this.handleStatusChange()}
                    label={this.state.sold ? 'Sold' : 'Available'}
                  />
                </Form.Field>
              </div>
              <div className="col">
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
              <div className="col d-flex justify-content-end mt-3">
                {this.renderButton()}
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  }

  renderButton() {
    return (
      <div>
        <button className="btn btn-danger" type="submit">
          Update
        </button>
        <button className="btn btn-primary">Cancel</button>
      </div>
    )
  }
}
